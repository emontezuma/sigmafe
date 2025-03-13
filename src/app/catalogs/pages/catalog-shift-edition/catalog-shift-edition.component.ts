import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, GeneralHardcodedValuesData, emptyGeneralHardcodedValuesData } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip,  tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import {  ShiftDetail, ShiftItem,    emptyShiftItem } from '../../models';
import { HttpClient  } from '@angular/common/http';

import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { emptyGeneralCatalogItem } from '../../models/catalogs-shared.models';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-catalog-shift-edition',
  templateUrl: './catalog-shift-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-shift-edition.component.scss']
})
export class CatalogShiftEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;
  @ViewChild('fromTime', { static: false }) selection: ElementRef;

  // Shifts ===============
  shift: ShiftDetail = emptyShiftItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  valueTypeChanges$: Observable<any>;

  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  shift$: Observable<ShiftDetail>;
  translations$: Observable<any>;
  updateShift$: Observable<any>;
  updateShiftCatalog$: Observable<any>;
  deleteShiftTranslations$: Observable<any>;  
  addShiftTranslations$: Observable<any>;  
  
  shiftFormChangesSubscription: Subscription;
  
  uploadFiles: Subscription;
  
  catalogIcon: string = "time";  
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  storedTranslations: [] = [];
  translationChanged: boolean = false

  submitControlled: boolean = false
  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  shiftData: ShiftItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';

  shiftForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),   
    notes: new FormControl(''),   
    reference: new FormControl(''),    
    prefix: new FormControl(''),
    
    twoDays: new FormControl(''), 

    fromTimeTime: new FormControl(''),  
    toTimeTime: new FormControl(''),  

    moveToDate: new FormControl(0), 
    sequence: new FormControl(0), 

    isFirstSequence: new FormControl(''), 
    isLastSequence : new FormControl(''),     

    
    calendar: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
  });

  pageInfo: PageInfo = {
    currentPage: 0,
    totalRecords:  0,
    totalPages: 0,
    inactiveRecords: 0,
    activeRecords: 0,
  }
  
  // Temporal
  tmpDate: number = 112;
  loaded: boolean = false;


  genYesNoValues$: Observable<any>;
  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 

  variableByDefaultDate$: Observable<any>;
  variableByDefaultDate: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 

  harcodedValuesOrderById: any = JSON.parse(`{ "id": "${'ASC'}" }`);
  
  constructor(
    private _store: Store<AppState>,
    public _sharedService: SharedService,
    private _catalogsService: CatalogsService,
    private _router: Router,
    public _scrollDispatcher: ScrollDispatcher,
    private _route: ActivatedRoute,
    public _dialog: MatDialog,
    private _location: Location,
  ) {}

// Hooks ====================
  ngOnInit() {
    this.pageAnimationFinished();
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.SHIFTS_CATALOG_EDITION,
      true,
    );
    this.showGoTop$ = this._sharedService.showGoTop.pipe(
      tap((goTop) => {
        if (goTop.status === 'temp') {
          this.onTopStatus = 'active';
          this.catalogEdition.nativeElement.scrollIntoView({            
            behavior: 'smooth',
            block: 'start',
          });
          // Ensure
        }      
      })
    );
    this.scroll$ = this._scrollDispatcher
    .scrolled()
    .pipe(
      tap((data: any) => {      
        this.getScrolling(data);
      })
    );  

    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap(settingsData => {
        this.settingsData = settingsData;
        this.takeRecords = this.settingsData.catalog?.pageSize || 50
        const currentPage = 0;
        this.requestGenYesNoValuesData(currentPage);
        this.requestVariableByDefaultDateValuesData(currentPage);   
      })
    );

    this.shiftFormChangesSubscription = this.shiftForm.controls.fromTimeTime.valueChanges
    .subscribe((value: any) => {
      if (value >= this.shiftForm.controls.toTimeTime.value && this.shiftForm.controls.twoDays.value !== GeneralValues.YES) {
        this.shiftForm.controls.fromTimeTime.setErrors({ invalidValue: true });
      } else {
        this.shiftForm.controls.fromTimeTime.setErrors(null);
      }
    });

    this.shiftFormChangesSubscription = this.shiftForm.controls.toTimeTime.valueChanges
    .subscribe((value: any) => {
      if (value <= this.shiftForm.controls.fromTimeTime.value && this.shiftForm.controls.twoDays.value !== GeneralValues.YES) {        
        this.shiftForm.controls.fromTimeTime.markAsTouched();
        this.shiftForm.controls.fromTimeTime.setErrors({ invalidValue: true });        
      } else {
        this.shiftForm.controls.fromTimeTime.setErrors(null);
      }
    });
    
    this.shiftFormChangesSubscription = this.shiftForm.valueChanges.subscribe((shiftFormChanges: any) => {
      if (!this.loaded) return;
      this.setEditionButtonsState();
    }); 
    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.SHIFTS_CATALOG_EDITION,
          !animationFinished,
        ); 
      }
    ));    
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.SHIFTS_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestShiftData(+params['id']);
        }
      })
    ); 
    this.calcElements();


   
    setTimeout(() => {
      this.focusThisField = 'name';
      this.loaded = true;
    }, 200); 
    
  }

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.SHIFTS_CATALOG_EDITION,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.SHIFTS_CATALOG_EDITION,
      false,
    );
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.shiftFormChangesSubscription) this.shiftFormChangesSubscription.unsubscribe(); 
  }
  
// Functions ================

  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.SHIFTS_CATALOG_EDITION,
          show: true,
          buttonsToLeft: 1,
          showSpinner: false,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'right',
        });        
      }, 10);
    // }
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.from === ApplicationModules.SHIFTS_CATALOG_EDITION && this.elements.length > 0) {
      if (action.action === ButtonActions.NEW) {        
        this.elements.find(e => e.action === action.action).loading = true;
        if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`Cambios sin guardar`,  
              topIcon: 'warn_fill',
              defaultButtons: dialogByDefaultButton.ACCEPT,
              buttons: [],
              body: {
                message: $localize`Existen cambios sin guardar, primero <strong>cancele la edición actual</strong> y luego reinicie el formulario.`,
              },
              showCloseButton: true,
            },
          }); 
          dialogResponse.afterClosed().subscribe((response) => {
            this.elements.find(e => e.action === action.action).loading = false;
          });    
        } else {
          this._location.replaceState('/catalogs/shifts/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/shifts'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this._location.replaceState('/catalogs/shifts/create');
        this.focusThisField = 'name';
        setTimeout(() => {
          this.focusThisField = '';
        }, 100);
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
        }, 750);
      } else if (action.action === ButtonActions.SAVE) {        
        this.elements.find(e => e.action === action.action).loading = true;
        this.submitControlled = true;
        this.thisForm.ngSubmit.emit();
        setTimeout(() => {          
          this.elements.find(e => e.action === action.action).loading = false;
        }, 200);
      } else if (action.action === ButtonActions.CANCEL) {         
        this.elements.find(e => e.action === action.action).loading = true;
        let noData = true;
        if (!this.shift.id || this.shift.id === null || this.shift.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestShiftData(this.shift.id);
        }
        const message = $localize`Edición cancelada`;
          this._sharedService.showSnackMessage({
            message,      
            snackClass: 'snack-primary',
          });
        setTimeout(() => {
          if (noData) {
            this.setToolbarMode(toolbarMode.INITIAL_WITH_NO_DATA);
          } else {
            this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
          }
          this.elements.find(e => e.action === action.action).loading = false;
        }, 200);
      } else if (action.action === ButtonActions.INACTIVATE) { 
        this.elements.find(e => e.action === action.action).loading = true;
        if (this.shift?.id > 0 && this.shift.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR SHIFT`,  
              topIcon: 'delete',
              buttons: [{
                action: 'inactivate',
                showIcon: true,
                icon: 'delete',
                showCaption: true,
                caption: $localize`Inactivar`,
                showTooltip: true,
                class: 'warn',
                tooltip: $localize`Inactiva el registro`,
                default: true,
              }, {
                action: 'cancel',
                showIcon: true,
                icon: 'cancel',
                showCaption: true,
                caption: $localize`Cancelar`,
                showTooltip: true,            
                tooltip: $localize`Cancela la acción`,
                default: false,
              }],
              body: {
                message: $localize`Esta acción inactivará el shift con el Id <strong>${this.shift.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === 'cancel') {
              setTimeout(() => {
                this._sharedService.actionCancelledByTheUser();
                this.elements.find(e => e.action === action.action).loading = false;
              }, 200); 
            } else {
              this.elements.find(e => e.action === action.action).loading = true;
              const shiftParameters = {
                settingType: 'status',
                id: this.shift.id,
                customerId: this.shift.customerId,

                status: RecordStatus.INACTIVE,
              }
              const shifts = this._sharedService.setGraphqlGen(shiftParameters);
              this.updateShift$ = this._catalogsService.updateShiftStatus$(shifts)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateShift.length > 0 && data?.data?.createOrUpdateShift[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE)
                      const message = $localize`El shift ha sido inhabilitada`;
                      this.shift.status = RecordStatus.INACTIVE;
                      this._sharedService.showSnackMessage({
                        message,
                        snackClass: 'snack-warn',
                        progressBarColor: 'warn',
                        icon: 'delete',
                      });
                      this.elements.find(e => e.action === action.action).loading = false;
                    }, 200);
                  }
                })
              )
            }            
          });
        } else if (this.shift?.id > 0 && this.shift.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR SHIFT`,  
              topIcon: 'check',
              buttons: [{
                action: 'reactivate',
                showIcon: true,
                icon: 'check',
                showCaption: true,
                caption: $localize`Reactivar`,
                showTooltip: true,
                class: 'primary',
                tooltip: $localize`Reactiva el registro`,
                default: true,
              }, {
                action: 'cancel',
                showIcon: true,
                icon: 'cancel',
                showCaption: true,
                caption: $localize`Cancelar`,
                showTooltip: true,            
                tooltip: $localize`Cancela la acción`,
                default: false,
              }],
              body: {
                message: $localize`Esta acción reactivará el shift con el Id <strong>${this.shift.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === 'cancel') {
              setTimeout(() => {
                this._sharedService.actionCancelledByTheUser();
                this.elements.find(e => e.action === action.action).loading = false;
              }, 200); 
            } else {
              this.elements.find(e => e.action === action.action).loading = true;
              const shiftParameters = {
                settingType: 'status',
                id: this.shift.id,
                customerId: this.shift.customerId,

                status: RecordStatus.ACTIVE,
              }
              const shifts = this._sharedService.setGraphqlGen(shiftParameters);
              this.updateShift$ = this._catalogsService.updateShiftStatus$(shifts)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateShift.length > 0 && data?.data?.createOrUpdateShift[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE)
                      const message = $localize`El shift ha sido reactivada`;
                      this.shift.status = RecordStatus.ACTIVE;
                      this._sharedService.showSnackMessage({
                        message,
                        snackClass: 'snack-primary',
                        progressBarColor: 'primary',
                        icon: 'check',
                      });
                      this.elements.find(e => e.action === action.action).loading = false;
                    }, 200);
                  }
                })
              )
            }            
          });
        }
      } else if (action.action === ButtonActions.TRANSLATIONS) { 
        if (this.shift?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones del shift <strong>${this.shift.id}</strong>`,
              topIcon: 'world',
              translations: this.shift.translations,
              buttons: [{
                action: ButtonActions.SAVE,
                showIcon: true,
                icon: 'save',
                showCaption: true,
                caption: $localize`Registrar`,
                showTooltip: true,
                class: 'primary',
                tooltip: $localize`Registra las traducciones`,
                default: true,
                disabled: true,
              }, {
                action: ButtonActions.CANCEL,
                showIcon: true,
                icon: 'cancel',
                showCaption: true,
                caption: $localize`Cancelar`,
                showTooltip: true,                            
                tooltip: $localize`Cancela la edición actual`,    
                disabled: true,
              }, {
                action: ButtonActions.DELETE,
                showIcon: true,
                icon: 'garbage_can',
                showCaption: true,
                caption: $localize`Eliminar`,
                showTooltip: true,            
                class: 'warn',
                tooltip: $localize`Elimina la traducción`,    
                disabled: true,
              }, {
                action: ButtonActions.CLOSE,
                showIcon: true,
                icon: 'cross',
                showCaption: true,
                caption: $localize`Cerrar`,
                showTooltip: true,            
                tooltip: $localize`Cierra ésta ventana`,
                cancel: true,
              }],
              body: {
                message: $localize`Esta acción inactivará al shift ${this.shift.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.shift.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.shift.translations?.length > 0 ? $localize`Traducciones (${this.shift.translations.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.shift.translations?.length > 0 ? 'accent' : '';   
              this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
            }
          });
        }
      }
    }
  }

  calcElements() {
    this.elements = [{
      type: 'button',
      caption: $localize`Regresar...`,
      tooltip:  $localize`Regresar a la lista de shifts`,
      icon: 'arrow_left',
      class: 'primary',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      alignment: 'left',
      showCaption: true,
      loading: false,
      disabled: false,
      visible: true,
      action: ButtonActions.BACK,
    },{
      type: 'button',
      caption: $localize`Inicializar`,
      tooltip:  $localize`Inicializa la pantalla actual`,
      icon: 'document',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
      visible: true,
      action: ButtonActions.NEW,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: undefined,
    },{
      type: 'button',
      caption: $localize`Guardar`,
      tooltip: $localize`Guarda los cambios...`,
      class: '',
      icon: 'save',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      elementType: 'submit',
      action: ButtonActions.SAVE,
    },{
      type: 'button',
      caption: $localize`Cancelar`,
      tooltip: $localize`Cancela los cambios`,
      class: '',
      icon: 'cancel',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: ButtonActions.CANCEL,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: undefined,
    },{
      type: 'button',
      caption: $localize`Copiar`,
      tooltip: $localize`Copia los datos actuales para un nuevo registro...`,
      class: '',
      icon: 'copy',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: ButtonActions.COPY,
    },{
      type: 'button',
      caption: $localize`Inactivar`,
      tooltip: $localize`Inactivar el registro...`,
      class: '',
      icon: 'delete',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: this.shift?.status !== RecordStatus.ACTIVE,
      action: ButtonActions.INACTIVATE,
      visible: true,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
            visible: true,
      action: undefined,
    
    },{
      type: 'button',
      caption: $localize`Traducciones`,
      tooltip: $localize`Agregar traducciones al registro...`,
      class: '',
      icon: 'world',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: !!!this.shift.id,
      action: ButtonActions.TRANSLATIONS,      
    },];
  }

  getScrolling(data: CdkScrollable) {       
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0; 
    let status = 'inactive'
    if (scrollTop < 5) {
      status = 'inactive';
    } else if (this.onTopStatus !== 'temp') {
      status = 'active';
      clearTimeout(this.goTopButtonTimer);
      this.goTopButtonTimer = setTimeout(() => {
        if (this.onTopStatus !== 'inactive') {
          this.onTopStatus = 'inactive';
          this._sharedService.setGoTopButton(
            ApplicationModules.GENERAL,
            'inactive',
          );
        }
        return;
      }, 2500);
    }    
    if (this.onTopStatus !== status) {
      this.onTopStatus = status;
      this._sharedService.setGoTopButton(
        ApplicationModules.GENERAL,
        status,
      );
    }
  }

  onSubmit() {
    if (!this.submitControlled) return;
    this.submitControlled = false;
    this.validateTables();
    this.shiftForm.markAllAsTouched();
    this.shiftForm.updateValueAndValidity(); 
    if (this.shiftForm.valid) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.shiftForm.controls) {
        if (this.shiftForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.shiftForm.controls[controlName]; 
          if (typedControl.invalid) {
            fieldsMissingCounter++;
            fieldsMissing += `<strong>${fieldsMissingCounter}.</strong> ${this.getFieldDescription(controlName)}<br>`;
          }
        }
      }
      const dialogResponse = this._dialog.open(GenericDialogComponent, {
        width: '450px',
        disableClose: true,
        panelClass: 'warn-dialog',
        autoFocus : true,
        data: {
          title: $localize`DATOS INVÁLIDOS`,
          topIcon: 'warn_fill',
          defaultButtons: dialogByDefaultButton.ACCEPT,
          buttons: [],
          body: {
            message: $localize`El formulario contiene campos requeridos que deben llenarse o campos con datos incorrectos.<br>${fieldsMissing}`,
          },
          showCloseButton: true,
        },
      }); 
      dialogResponse.afterClosed().subscribe((response) => {
        let fieldFocused = false;
        for (const controlName in this.shiftForm.controls) {
          if (this.shiftForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.shiftForm.controls[controlName]; 
            if (typedControl.invalid) {
              if (!fieldFocused) {
                this.focusThisField = controlName;
                if (controlName === "fromTimeTime") {
                  setTimeout(() => {
                    this.selection.nativeElement.focus();    
                  }, 100);
                } else {
                  setTimeout(() => {
                    this.focusThisField = '';
                  }, 100);
                }
                break;                
              }
              fieldsMissingCounter++;
              fieldsMissing += `<strong>${fieldsMissingCounter}.</strong> ${this.getFieldDescription(controlName)}<br>`;
            }
          }
        }
        setTimeout(() => {
          this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;
        }, 100);
      });
    }
  }

  saveRecord() {
    this.setViewLoading(true);
    const newRecord = !this.shift.id || this.shift.id === null || this.shift.id === 0;
    const dataToSave = this.prepareRecordToAdd(newRecord);

    this.updateShiftCatalog$ = this._catalogsService.updateShiftCatalog$(dataToSave)
    .pipe(
      tap((data: any) => {
        if (data?.data?.createOrUpdateShift.length > 0) {
          const shiftId = data?.data?.createOrUpdateShift[0].id;          
          this.processTranslations$(shiftId).subscribe(() => {
            this.requestShiftData(shiftId);
            setTimeout(() => {              
              let message = $localize`El shift ha sido actualizado`;
              if (newRecord) {                
                message = $localize`El shift ha sido creado satisfactoriamente con el id <strong>${this.shift.id}</strong>`;
                this._location.replaceState(`/catalogs/shifts/edit/${shiftId}`);
              }
              this._sharedService.showSnackMessage({
                message,
                snackClass: 'snack-accent',
                progressBarColor: 'accent',                
              });
              this.setViewLoading(false);
              this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;
            }, 200);
          });
        }
      })
    )
  }

  requestShiftData(shiftId: number): void { 
    let shifts = undefined;
    shifts = { shiftId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "shiftId": { "eq": ${shiftId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.shift$ = this._catalogsService.getShiftDataGql$({ 
      shiftId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
    }).pipe(
      map(([ shiftGqlData, shiftGqlTranslationsData ]) => {
        return this._catalogsService.mapOneShift({
          shiftGqlData,  
          shiftGqlTranslationsData,
        })
      }),
      tap((shiftData: ShiftDetail) => {
        if (!shiftData) {
          const message = $localize`El registro no existe...`;
          this._sharedService.showSnackMessage({
            message,
            duration: 2500,
            snackClass: 'snack-warn',
            icon: 'check',
          });
          this.setToolbarMode(toolbarMode.INITIAL_WITH_NO_DATA);
          this.setViewLoading(false);
          this.loaded = true;
          this._location.replaceState('/catalogs/shifts/create');
          return;
        }
        this.shift =  shiftData;
        this.translationChanged = false;

        this.storedTranslations = JSON.parse(JSON.stringify(this.shift.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.shift.translations?.length > 0 ? $localize`Traducciones (${this.shift.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.shift.translations?.length > 0 ? 'accent' : '';   
        this.updateFormFromData();
        this.changeInactiveButton(this.shift.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = shiftData.translations?.length > 0 ? $localize`Traducciones (${shiftData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = shiftData.translations?.length > 0 ? 'accent' : '';
        }        
        this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        this.setViewLoading(false);
        this.loaded = true;
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
  }  

 

  handleOptionSelected(getMoreDataParams: any){
    console.log('[handleOptionSelected]', getMoreDataParams)
  }

  handleInputKeydown(event: KeyboardEvent) {
    console.log('[handleInputKeydown]', event)
  }

  pageChange(event: any) {
    this.pageInfo = { 
      ...this.pageInfo, 
      currentPage: event?.pageIndex, 
    }; 
    //this.requestData(this.pageInfo.currentPage * this.pageInfo.pageSize, this.pageInfo.pageSize, this.order);
  }

  setToolbarMode(mode: toolbarMode) {
    if (this.elements.length === 0) return;
    if (mode === toolbarMode.EDITING_WITH_DATA) {      
      // if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = false;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
    } else if (mode === toolbarMode.EDITING_WITH_NO_DATA) {
      // if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = true;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
    } else if (mode === toolbarMode.INITIAL_WITH_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = false;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = false;
    } else if (mode === toolbarMode.INITIAL_WITH_NO_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = true;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
    }    
  }

  updateFormFromData(): void {    

    this.shiftForm.patchValue({
      name: this.shift.name,
      reference: this.shift.reference,      

      twoDays: this.shift.twoDays,
      isFirstSequence: this.shift.isFirstSequence,
      isLastSequence: this.shift.isLastSequence,
      
      fromTimeTime: this.shift.fromTimeTime,
      toTimeTime: this.shift.toTimeTime,
      moveToDate: this.shift.moveToDate,
      sequence: this.shift.sequence,

      prefix: this.shift.prefix,      
      notes: this.shift.notes,
      calendar:this.shift.calendar,

    });
  } 

  prepareRecordToAdd(newRecord: boolean): any {
    const fc = this.shiftForm.controls;
    let toTime = fc.toTimeTime.value;
    let fromTime = fc.fromTimeTime.value;
    if (fc.fromTimeTime.dirty || fc.fromTimeTime.touched || newRecord) {
      fromTime = this._sharedService.formatDate(new Date(), 'yyyy-MM-dd ' + fc.fromTimeTime.value)
    }
    if (fc.toTimeTime.dirty || fc.toTimeTime.touched || newRecord) {
      toTime = this._sharedService.formatDate(new Date(), 'yyyy-MM-dd ' + fc.toTimeTime.value)
    }
    return  {
        id: this.shift.id,
      customerId: 1, // TODO: Get from profile
      calendarId: 1, // TODO: Get from profile
        status: newRecord ? RecordStatus.ACTIVE : this.shift.status,
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.prefix.dirty || fc.prefix.touched || newRecord) && { prefix: fc.prefix.value },
      ...(fc.twoDays.dirty || fc.twoDays.touched || newRecord) && { twoDays: fc.twoDays.value },
      ...(fc.sequence.dirty || fc.sequence.touched || newRecord) && { sequence: fc.sequence.value ? +fc.sequence.value : 0 },
      ...(fc.moveToDate.dirty || fc.moveToDate.touched || newRecord) && { moveToDate: fc.moveToDate.value ? +fc.moveToDate.value : 0 },
      ...(fc.isFirstSequence.dirty || fc.isFirstSequence.touched || newRecord) && { isFirstSequence: fc.isFirstSequence.value },
      ...(fc.isLastSequence.dirty || fc.isLastSequence.touched || newRecord) && { isLastSequence: fc.isLastSequence.value },
      ...(fc.calendar.dirty || fc.calendar.touched || newRecord) && { calendarId: fc.calendar.value ? fc.calendar.value.id : null },      
      fromTime,      
      toTime,
    }
  }

  setEditionButtonsState() {
    if (!this.shift.id || this.shift.id === null || this.shift.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }
  


  initForm(): void {
    this.shiftForm.reset();
    // Default values
    this.shiftForm.controls.fromTimeTime.setValue("00:00");
    this.shiftForm.controls.toTimeTime.setValue("00:00");

    this.storedTranslations = [];
    this.translationChanged = false;
    this.shift = emptyShiftItem;
    this.focusThisField = 'name';
    setTimeout(() => {
      this.catalogEdition.nativeElement.scrollIntoView({            
        behavior: 'smooth',
        block: 'start',
      });   
      this.focusThisField = '';
    }, 200);
  }

  initUniqueField(): void {
    this.shift.id = null;
    this.shift.createdBy = null;
    this.shift.createdAt = null;
    this.shift.updatedBy = null;
    this.shift.updatedAt = null; 
    this.shift.status = RecordStatus.ACTIVE; 
    this.shift.translations.map((t) => {
      return {
        ...t,
        id: null,
      }
    });
  }

  changeInactiveButton(status: RecordStatus | string): void {
    const toolbarOption = this.elements.find(e => e.action === ButtonActions.INACTIVATE);
    if (toolbarOption) {
      toolbarOption.caption = status === RecordStatus.ACTIVE ? $localize`Inactivar` : $localize`Reactivar`;
      toolbarOption.tooltip = status === RecordStatus.ACTIVE ? $localize`Inactivar el registro...` : $localize`Reactivar el registro...`;
      toolbarOption.icon = status === RecordStatus.ACTIVE ? 'delete' : 'check';   
    }
  }

  getFieldDescription(fieldControlName: string): string {
    if (fieldControlName === 'name') {
      return $localize`Descripción o nombre del Turno`
    } else if (fieldControlName === 'fromTimeTime') {
      return $localize`Hora de inicio del turno`
    }
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.SHIFTS_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.SHIFTS_CATALOG_EDITION,
      loading,
    ); 
  }

  validateTables(): void {

    // It is missing the validation for state and thresholdType because we dont retrieve the complete record but tghe value
  }

  processTranslations$(shiftId: number): Observable<any> { 
    const differences = this.storedTranslations?.length !== this.shift.translations?.length || this.storedTranslations?.some((st: any) => {
      return this.shift.translations.find((t: any) => {        
        return st.languageId === t.languageId &&
        st.id === t.id &&
        (st.name !== t.name || 
        st.reference !== t.reference || 
        st.notes !== t.notes);
      });
    });
    if (differences) {
      const translationsToDelete = this.storedTranslations.map((t: any) => {
        return {
          id: t.id,
          deletePhysically: true,
        }
      });
      const varToDelete = {
        ids: translationsToDelete,
        customerId: 1, // TODO: Get from profile
        calendarId: 1, // TODO: Get from profile
      }      
      const translationsToAdd = this.shift.translations.map((t: any) => {
        return {
          id: null,
          shiftId,
          name: t.name,
          reference: t.reference,
          notes: t.notes,
          languageId: t.languageId,
          customerId: 1, // TODO: Get from profile
          calendarId: 1, // TODO: Get from profile
          status: RecordStatus.ACTIVE,
        }
      });
      const varToAdd = {
        translations: translationsToAdd,
      }
  
      return combineLatest([ 
        varToAdd.translations?.length > 0 ? this._catalogsService.addShiftTranslations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteShiftTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

  requestGenYesNoValuesData(currentPage: number) {
    this.genYesNoValues = {
      ...this.genYesNoValues,
      currentPage,
      loading: true,
    }        
    this.genYesNoValues$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.GEN_VALUES_YES_NO)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.genYesNoValues.items?.concat(data?.data?.hardcodedValues?.items);
        this.genYesNoValues = {
          ...this.genYesNoValues,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }


  requestVariableByDefaultDateValuesData(currentPage: number) {
    this.variableByDefaultDate = {
      ...this.variableByDefaultDate,
      currentPage,
      loading: true,
    }        
    this.variableByDefaultDate$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrderById, SystemTables.VARIABLE_BY_DEFAULT_DATE)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.variableByDefaultDate.items?.concat(data?.data?.hardcodedValues?.items);
        this.variableByDefaultDate = {
          ...this.genYesNoValues,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  calculateByDefaultValue(name: string): void {    
    let date;
    let time;
    if (name === 'from') {
      time = this.shiftForm.controls.fromTimeTime.value ?? this._sharedService.formatDate(new Date(), 'HH:mm:ss');
    } else {
      time = this.shiftForm.controls.toTimeTime.value ?? this._sharedService.formatDate(new Date(), 'HH:mm:ss');
    }
    
    if (time.length === 5) {
      time = `${time}:00`;
    }
    let byDefaulDAT = null;
    try {
      byDefaulDAT = new Date(`${date}' '${time}`)
    } catch (error) {
      byDefaulDAT = null;
    }          
    if(name==='from'){
      this.shiftForm.controls.fromTimeTime.setValue(byDefaulDAT);
    }else {
      this.shiftForm.controls.toTimeTime.setValue(byDefaulDAT);
    }
  }  

  get SystemTables () {
    return SystemTables;
  }

  get ScreenDefaultValues () {
    return ScreenDefaultValues;
  }

  get GeneralValues() {
    return GeneralValues; 
  }

  get RecordStatus() {
    return RecordStatus; 
  }

// End ======================
}
