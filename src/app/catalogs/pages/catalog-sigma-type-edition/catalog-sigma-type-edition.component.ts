import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, originProcess } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip, tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import {SigmaTypeDetail, SigmaTypeItem, emptySigmaTypeItem } from '../../models';

import { HttpClient, HttpParams } from '@angular/common/http';


import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { emptyGeneralHardcodedValuesItem } from '../../models/catalogs-shared.models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-catalog-sigma-type-edition',
  templateUrl: './catalog-sigma-type-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-sigma-type-edition.component.scss']
})
export class CatalogSigmaTypeEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;

  // SigmaTypes ===============
  sigmaType: SigmaTypeDetail = emptySigmaTypeItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 
  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  sigmaType$: Observable<SigmaTypeDetail>;
  translations$: Observable<any>;
  updateSigmaType$: Observable<any>;
  updateSigmaTypeCatalog$: Observable<any>;
  deleteSigmaTypeTranslations$: Observable<any>;  
  addSigmaTypeTranslations$: Observable<any>;  
  sigmaTypeFormChangesSubscription: Subscription;
  
  uploadFiles: Subscription;
  
  catalogIcon: string = "allow_list2";  
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  storedTranslations: [] = [];
  translationChanged: boolean = false
  imageChanged: boolean = false
  submitControlled: boolean = false
  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  sigmaTypeData: SigmaTypeItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';

  sigmaTypeForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),
    required: new FormControl(emptyGeneralHardcodedValuesItem),
    mainImageName: new FormControl(''),    
    notes: new FormControl(''),
    reference: new FormControl(''),    
    prefix: new FormControl(''),      
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

  constructor(
    private _store: Store<AppState>,
    public _sharedService: SharedService,
    private _catalogsService: CatalogsService,
    private _router: Router,
    public _scrollDispatcher: ScrollDispatcher,
    private _route: ActivatedRoute,
    private _http: HttpClient,
    public _dialog: MatDialog,
    private _location: Location,
  ) {}

// Hooks ====================
  ngOnInit() {
    this.pageAnimationFinished();
    // this.sigmaTypeForm.get('name').disable();
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.MANUFACTURERS_CATALOG_EDITION,
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
      })
    );

    this.sigmaTypeFormChangesSubscription = this.sigmaTypeForm.valueChanges.subscribe((sigmaTypeFormChanges: any) => {
      if (!this.loaded) return;
      this.setEditionButtonsState()
    }); 

    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.MANUFACTURERS_CATALOG_EDITION,
          !animationFinished,
        ); 
      }
      ));
    
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.MANUFACTURERS_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
      ));
    
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestSigmaTypeData(+params['id']);
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
      from: ApplicationModules.MANUFACTURERS_CATALOG,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.MANUFACTURERS_CATALOG,
      false,
    );
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.sigmaTypeFormChangesSubscription) this.sigmaTypeFormChangesSubscription.unsubscribe(); 
  }
  
// Functions ================
  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.MANUFACTURERS_CATALOG_EDITION,
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
    if (action.from === ApplicationModules.MANUFACTURERS_CATALOG_EDITION && this.elements.length > 0) {
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
          this._location.replaceState('/catalogs/sigma-types/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/sigma-types'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this._location.replaceState('/catalogs/sigma-types/create');
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
        if (!this.sigmaType.id || this.sigmaType.id === null || this.sigmaType.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestSigmaTypeData(this.sigmaType.id);
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
        if (this.sigmaType?.id > 0 && this.sigmaType.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR TIPO DE VARIABLE`,  
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
                message: $localize`Esta acción inactivará al tipo de variable con el Id <strong>${this.sigmaType.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const sigmaTypeParameters = {
                settingType: 'status',
                id: this.sigmaType.id,
                customerId: this.sigmaType.customerId,
                status: RecordStatus.INACTIVE,
              }
              const sigmaTypes = this._sharedService.setGraphqlGen(sigmaTypeParameters);
              this.updateSigmaType$ = this._catalogsService.updateSigmaTypeStatus$(sigmaTypes)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateSigmaType.length > 0 && data?.data?.createOrUpdateSigmaType[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE);
                      this.sigmaType.status = RecordStatus.INACTIVE;
                      const message = $localize`El tipo de variable ha sido inhabilitado`;
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
        } else if (this.sigmaType?.id > 0 && this.sigmaType.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR TIPO DE VARIABLE`,  
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
                message: $localize`Esta acción reactivará al tipo de variable con el Id <strong>${this.sigmaType.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const sigmaTypeParameters = {
                settingType: 'status',
                id: this.sigmaType.id,
                customerId: this.sigmaType.customerId,
                status: RecordStatus.ACTIVE,
              }
              const sigmaTypes = this._sharedService.setGraphqlGen(sigmaTypeParameters);
              this.updateSigmaType$ = this._catalogsService.updateSigmaTypeStatus$(sigmaTypes)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateSigmaType.length > 0 && data?.data?.createOrUpdateSigmaType[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE);
                      this.sigmaType.status = RecordStatus.ACTIVE;
                      const message = $localize`El tipo de variable ha sido reactivado`;
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
        if (this.sigmaType?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones dEl tipo de variable <strong>${this.sigmaType.id}</strong>`,
              topIcon: 'world',
              translations: this.sigmaType.translations,
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
                message: $localize`Esta acción inactivará al tipo de variable ${this.sigmaType.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.sigmaType.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.sigmaType.translations?.length > 0 ? $localize`Traducciones (${this.sigmaType.translations.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.sigmaType.translations?.length > 0 ? 'accent' : '';   
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
      tooltip:  $localize`Regresar a la lista de tipo de variables`,
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
      disabled: this.sigmaType?.status !== RecordStatus.ACTIVE,
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
      disabled: !!!this.sigmaType.id,
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
    this.sigmaTypeForm.markAllAsTouched();
    this.sigmaTypeForm.updateValueAndValidity(); 
    if (this.sigmaTypeForm.valid) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.sigmaTypeForm.controls) {
        if (this.sigmaTypeForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.sigmaTypeForm.controls[controlName]; 
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
        for (const controlName in this.sigmaTypeForm.controls) {
          if (this.sigmaTypeForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.sigmaTypeForm.controls[controlName]; 
            if (typedControl.invalid) {
              if (!fieldFocused) {
                this.focusThisField = controlName;
                setTimeout(() => {
                  this.focusThisField = '';
                }, 100)
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
    const newRecord = !this.sigmaType.id || this.sigmaType.id === null || this.sigmaType.id === 0;
    try {
    const dataToSave = this.prepareRecordToSave(newRecord);
    console.log(dataToSave)

      this.updateSigmaTypeCatalog$ = this._catalogsService.updateSigmaTypeCatalog$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateSigmaType.length > 0) {        
            const sigmaTypeId = data?.data?.createOrUpdateSigmaType[0].id;        
            this.processTranslations$(sigmaTypeId)
            .subscribe(() => {
              this.requestSigmaTypeData(sigmaTypeId);
              setTimeout(() => {              
                let message = $localize`El tipo de variable ha sido actualizado`;
                if (newRecord) {                
                  message = $localize`El tipo de variable ha sido creado satisfactoriamente con el id <strong>${sigmaTypeId}</strong>`;
                  this._location.replaceState(`/catalogs/sigma-types/edit/${sigmaTypeId}`);
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
    } catch (error) {
      const message = $localize`Se generó un error al procesar el registro. Error: ${error}`;
      this._sharedService.showSnackMessage({
        message,
        duration: 5000,
        snackClass: 'snack-warn',
        icon: 'check',
      }); 
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;    
    }
  }


  requestSigmaTypeData(sigmaTypeId: number): void { 
    let sigmaTypes = undefined;
    sigmaTypes = { sigmaTypeId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "sigmaTypeId": { "eq": ${sigmaTypeId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.sigmaType$ = this._catalogsService.getSigmaTypeDataGql$({ 
      sigmaTypeId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
    }).pipe(
      map(([ sigmaTypeGqlData, sigmaTypeGqlTranslationsData ]) => {
        return this._catalogsService.mapOneSigmaType({
          sigmaTypeGqlData,  
          sigmaTypeGqlTranslationsData,
        })
      }),
      tap((sigmaTypeData: SigmaTypeDetail) => {
        if (!sigmaTypeData) {
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
          this._location.replaceState('/catalogs/sigma-types/create');
          return;
        }
        this.sigmaType =  sigmaTypeData;
        this.translationChanged = false;
        this.imageChanged = false;
        this.storedTranslations = JSON.parse(JSON.stringify(this.sigmaType.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.sigmaType.translations?.length > 0 ? $localize`Traducciones (${this.sigmaType.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.sigmaType.translations?.length > 0 ? 'accent' : '';   
        this.updateFormFromData();
        this.changeInactiveButton(this.sigmaType.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = sigmaTypeData.translations?.length > 0 ? $localize`Traducciones (${sigmaTypeData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = sigmaTypeData.translations?.length > 0 ? 'accent' : '';
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

  requestGenericsData$(currentPage: number, skipRecords: number, catalog: string, filterStr: string = null): Observable<any> {    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "tableName": { "eq": "${catalog}" } } }, { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);
    } else {
      filter = JSON.parse(`{ "and":  [ { "data": { "tableName": { "eq": "${catalog}" } } } , { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } } ] } `);
    }
    const sigmaTypeParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order,
    }    
    const sigmaTypes = this._sharedService.setGraphqlGen(sigmaTypeParameters);
    return this._catalogsService.getGenericsLazyLoadingDataGql$(sigmaTypes).pipe();
  }





  handleOptionSelected(getMoreDataParams: any){
    console.log('[handleOptionSelected]', getMoreDataParams)
  }

  handleInputKeydown(event: KeyboardEvent) {
    console.log('[handleInputKeydown]', event)
  }

  handleMultipleSelectionChanged(catalog: string){    
    this.setEditionButtonsState()
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
      if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = false;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
    } else if (mode === toolbarMode.EDITING_WITH_NO_DATA) {
      if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
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
    this.sigmaTypeForm.patchValue({
      name: this.sigmaType.name,
      reference: this.sigmaType.reference,      
      prefix: this.sigmaType.prefix,      
      notes: this.sigmaType.notes,      

    });
  } 

  prepareRecordToSave(newRecord: boolean): any {
    this.sigmaTypeForm.markAllAsTouched();
    const fc = this.sigmaTypeForm.controls;
    return  {
        id: this.sigmaType.id,
        customerId: 1, // TODO: Get from profile
        status: newRecord ? RecordStatus.ACTIVE : this.sigmaType.status,
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.prefix.dirty || fc.prefix.touched || newRecord) && { prefix: fc.prefix.value },      
    }
  }
  


  initForm(): void {
    this.sigmaTypeForm.reset();
    // Default values
    this.sigmaTypeForm.controls.required.setValue(GeneralValues.NO);

    this.storedTranslations = [];
    this.translationChanged = false;
    this.sigmaType = emptySigmaTypeItem;
    this.focusThisField = 'description';
    setTimeout(() => {
      this.catalogEdition.nativeElement.scrollIntoView({            
        behavior: 'smooth',
        block: 'start',
      });   
      this.focusThisField = '';
    }, 200);
  }

  initUniqueField(): void {
    this.sigmaType.id = null;
    this.sigmaType.createdBy = null;
    this.sigmaType.createdAt = null;
    this.sigmaType.updatedBy = null;
    this.sigmaType.updatedAt = null; 
    this.sigmaType.status = RecordStatus.ACTIVE; 
    this.sigmaType.translations.map((t) => {
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
      return $localize`Descripción o nombre dEl tipo de variable`
    } 
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.MANUFACTURERS_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.MANUFACTURERS_CATALOG_EDITION,
      loading,
    ); 
  }

  validateTables(): void {
    
    // It is missing the validation for state and thresholdType because we dont retrieve the complete record but tghe value
  }

  processTranslations$(sigmaTypeId: number): Observable<any> { 
    const differences = this.storedTranslations?.length !== this.sigmaType.translations?.length || this.storedTranslations?.some((st: any) => {
      return this.sigmaType.translations.find((t: any) => {        
        return st.languageId === t.languageId &&
        st.id === t.id &&
        (st.description !== t.description || 
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
       
      }      
      const translationsToAdd = this.sigmaType.translations.map((t: any) => {
        return {
          id: null,
          sigmaTypeId,
          description: t.description,
          reference: t.reference,
          notes: t.notes,
          languageId: t.languageId,
   
          status: RecordStatus.ACTIVE,
        }
      });
      const varToAdd = {
        translations: translationsToAdd,
      }
  
      return combineLatest([ 
        varToAdd.translations?.length > 0 ? this._catalogsService.addSigmaTypeTranslations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteSigmaTypeTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

  setEditionButtonsState() {
    if (!this.sigmaType.id || this.sigmaType.id === null || this.sigmaType.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
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
