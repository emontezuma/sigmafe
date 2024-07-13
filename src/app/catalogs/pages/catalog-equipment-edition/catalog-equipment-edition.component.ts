import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, originProcess, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, GeneralCatalogParams } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip,  tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import { EquipmentDetail, EquipmentItem, emptyEquipmentItem } from '../../models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem } from '../../models/catalogs-shared.models';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-catalog-equipment-edition',
  templateUrl: './catalog-equipment-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-equipment-edition.component.scss']
})
export class CatalogEquipmentEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;

  // Equipments ===============
  equipment: EquipmentDetail = emptyEquipmentItem;
  scroll$: Observable<any>;JSON: any;
;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  plants$: Observable<any>; 
  plants: GeneralCatalogData = emptyGeneralCatalogData; 
 
  

  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  equipment$: Observable<EquipmentDetail>;
  translations$: Observable<any>;
  updateEquipment$: Observable<any>;
  updateEquipmentCatalog$: Observable<any>;
  deleteEquipmentTranslations$: Observable<any>;  
  addEquipmentTranslations$: Observable<any>;  
  
  equipmentFormChangesSubscription: Subscription;
  
  uploadFiles: Subscription;
  
  catalogIcon: string = "organizational_chart";  
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);

  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  storedTranslations: [];
  translationChanged: boolean = false
  imageChanged: boolean = false
  submitControlled: boolean = false
  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  equipmentData: EquipmentItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';

  equipmentForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),   
    notes: new FormControl(''),
    mainImageName: new FormControl(''),    
    reference: new FormControl(''),    
    prefix: new FormControl(''), 
    plant: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
       
    
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
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
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
    this.equipmentFormChangesSubscription = this.equipmentForm.valueChanges.subscribe((equipmentFormChanges: any) => {
      if (!this.loaded) return;
      this.setEditionButtonsState();
    }); 
    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
          !animationFinished,
        ); 
      }
    ));    
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.EQUIPMENTS_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestEquipmentData(+params['id']);
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
      from: ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      false,
    );
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.equipmentFormChangesSubscription) this.equipmentFormChangesSubscription.unsubscribe(); 
  }
  
// Functions ================

  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
          show: true,
          showSpinner: false,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'right',
        });
      }, 500);
    }
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.from === ApplicationModules.EQUIPMENTS_CATALOG_EDITION && this.elements.length > 0) {
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
          this._location.replaceState('/catalogs/equipments/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/equipments'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this._location.replaceState('/catalogs/equipments/create');
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
        if (!this.equipment.id || this.equipment.id === null || this.equipment.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestEquipmentData(this.equipment.id);
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
        if (this.equipment?.id > 0 && this.equipment.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR EQUIPO`,  
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
                message: $localize`Esta acción inactivará El departamento con el Id <strong>${this.equipment.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const equipmentParameters = {
                settingType: 'status',
                id: this.equipment.id,
                customerId: this.equipment.customerId,
                              
                plantId: this.equipment.plantId,
                status: RecordStatus.INACTIVE,
              }
              const equipments = this._sharedService.setGraphqlGen(equipmentParameters);
              this.updateEquipment$ = this._catalogsService.updateEquipmentStatus$(equipments)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateEquipment.length > 0 && data?.data?.createOrUpdateEquipment[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE)
                      const message = $localize`El departamento ha sido inhabilitada`;
                      this.equipment.status = RecordStatus.INACTIVE;
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
        } else if (this.equipment?.id > 0 && this.equipment.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR EQUIPO`,  
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
                message: $localize`Esta acción reactivará el departamento con el Id <strong>${this.equipment.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const equipmentParameters = {
                settingType: 'status',
                id: this.equipment.id,
                customerId: this.equipment.customerId,
                
                plantId: this.equipment.plantId,
                status: RecordStatus.ACTIVE,
              }
              const equipments = this._sharedService.setGraphqlGen(equipmentParameters);
              this.updateEquipment$ = this._catalogsService.updateEquipmentStatus$(equipments)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateEquipment.length > 0 && data?.data?.createOrUpdateEquipment[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE)
                      const message = $localize`El departamento ha sido reactivada`;
                      this.equipment.status = RecordStatus.ACTIVE;
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
        if (this.equipment?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones del departamento <strong>${this.equipment.id}</strong>`,
              topIcon: 'world',
              translations: this.equipment.translations,
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
                message: $localize`Esta acción inactivará al departamento ${this.equipment.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.equipment.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.equipment.translations.length > 0 ? $localize`Traducciones (${this.equipment.translations.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.equipment.translations.length > 0 ? 'accent' : '';   
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
      tooltip:  $localize`Regresar a la lista de departamentos`,
      icon: 'arrow_left',
      class: 'primary',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      alignment: 'left',
      showCaption: true,
      loading: false,
      disabled: false,
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
      disabled: true,
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
      disabled: true,
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
      disabled: true,
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
      disabled: true,
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
      disabled: true,
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
      disabled: this.equipment?.status !== RecordStatus.ACTIVE,
      action: ButtonActions.INACTIVATE,
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
      disabled: true,
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
      disabled: !!!this.equipment.id,
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
    this.equipmentForm.markAllAsTouched();
    this.equipmentForm.updateValueAndValidity(); 
    if (this.equipmentForm.valid) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.equipmentForm.controls) {
        if (this.equipmentForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.equipmentForm.controls[controlName]; 
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
        for (const controlName in this.equipmentForm.controls) {
          if (this.equipmentForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.equipmentForm.controls[controlName]; 
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
    const newRecord = !this.equipment.id || this.equipment.id === null || this.equipment.id === 0;

    try {
      const dataToSave = this.prepareRecordToSave(newRecord);
      this.updateEquipmentCatalog$ = this._catalogsService.updateEquipmentCatalog$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateEquipment.length > 0) {
            const equipmentId = data?.data?.createOrUpdateEquipment[0].id;          
            this.processTranslations$(equipmentId).subscribe(() => {
              this.requestEquipmentData(equipmentId);
              setTimeout(() => {              
                let message = $localize`El departamento ha sido actualizado`;
                if (newRecord) {                
                  message = $localize`El departamento ha sido creado satisfactoriamente con el id <strong>${this.equipment.id}</strong>`;
                  this._location.replaceState(`/catalogs/equipments/edit/${equipmentId}`);
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

  requestEquipmentData(equipmentId: number): void { 
    let equipments = undefined;
    equipments = { equipmentId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "equipmentId": { "eq": ${equipmentId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.equipment$ = this._catalogsService.getEquipmentDataGql$({ 
      equipmentId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
    }).pipe(
      map(([ equipmentGqlData, equipmentGqlTranslationsData ]) => {
        return this._catalogsService.mapOneEquipment({
          equipmentGqlData,  
          equipmentGqlTranslationsData,
        })
      }),
      tap((equipmentData: EquipmentDetail) => {
        if (!equipmentData) return;
        console.log("here")
        this.equipment =  equipmentData;
        this.translationChanged = false;
        this.imageChanged = false;
        this.storedTranslations = JSON.parse(JSON.stringify(this.equipment.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.equipment.translations.length > 0 ? $localize`Traducciones (${this.equipment.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.equipment.translations.length > 0 ? 'accent' : '';   
        this.updateFormFromData();
        this.changeInactiveButton(this.equipment.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = equipmentData.translations.length > 0 ? $localize`Traducciones (${equipmentData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = equipmentData.translations.length > 0 ? 'accent' : '';
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

  algo(ev) {
  console.log(JSON.stringify(ev))
}

  onFileSelected(event: any) {
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/equipments`)
    .set('processId', this.equipment.id)
    .set('process', originProcess.CATALOGS_MOLDS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.imageChanged = true;
        this.equipmentForm.controls.mainImageName.setValue(res.fileName);
        this.equipment.mainImagePath = res.filePath;
        this.equipment.mainImageGuid = res.fileGuid;
        this.equipment.mainImage = `${environment.uploadFolders.completePathToFiles}/${res.filePath}`;
        const message = $localize`El archivo ha sido subido satisfactoriamente<br>Guarde El departamento para aplicar el cambio`;
        this._sharedService.showSnackMessage({
          message,
          duration: 5000,
          snackClass: 'snack-primary',
          icon: 'check',
        });
        this.setEditionButtonsState();      }      
    });
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
    this.equipmentForm.patchValue({
      name: this.equipment.name,
      reference: this.equipment.reference,      
      mainImageName: this.equipment.mainImageName,
      prefix: this.equipment.prefix,      
      notes: this.equipment.notes,      
      plant: this.equipment.plant,
      
    });
  } 

  prepareRecordToSave(newRecord: boolean): any {
    const fc = this.equipmentForm.controls;
    return  {
      id: this.equipment.id,
      customerId: 1, // TODO: Get from profile      
        status: newRecord ? RecordStatus.ACTIVE : this.equipment.status,
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.prefix.dirty || fc.prefix.touched || newRecord) && { prefix: fc.prefix.value },
      ...(fc.plant.dirty || fc.plant.touched || newRecord) && { plantId: fc.plant.value ? fc.plant.value.id : null },      
      
      

      ...(this.imageChanged) && { 
        mainImageName: fc.mainImageName.value,
        mainImagePath: this.equipment.mainImagePath,
        mainImageGuid: this.equipment.mainImageGuid, },
    }
  }

  setEditionButtonsState() {
    if (!this.equipment.id || this.equipment.id === null || this.equipment.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }
  
  removeImage() {
    this.imageChanged = true;
    this.equipmentForm.controls.mainImageName.setValue('');
    this.equipment.mainImagePath = '';
    this.equipment.mainImageGuid = '';
    this.equipment.mainImage = '';     
    const message = $localize`Se ha quitado la imagen del departamento<br>Guarde El departamento para aplicar el cambio`;
    this._sharedService.showSnackMessage({
      message,
      duration: 5000,
      snackClass: 'snack-primary',
      icon: 'check',
    });
    this.setEditionButtonsState();    
  }

  initForm(): void {
    this.equipmentForm.reset();
    // Default values

    this.storedTranslations = [];
    this.translationChanged = false;
    this.equipment = emptyEquipmentItem;
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
    this.equipment.id = null;
    this.equipment.createdBy = null;
    this.equipment.createdAt = null;
    this.equipment.updatedBy = null;
    this.equipment.updatedAt = null; 
    this.equipment.status = RecordStatus.ACTIVE; 
    this.equipment.translations.map((t) => {
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
      return $localize`Descripción o nombre del departamento`    
    } else if (fieldControlName === 'plant') {
      return $localize`Planta asociada al departamento`;
    }   
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
      loading,
    ); 
  }

  validateTables(): void {
    if (!this.equipmentForm.controls.plant.value || !this.equipmentForm.controls.plant.value.id) {
      this.equipmentForm.controls.plant.setErrors({ required: true });   
    } else if (this.equipmentForm.controls.plant.value.status === RecordStatus.INACTIVE) {
      this.equipmentForm.controls.plant.setErrors({ inactive: true });   
    } else {
      this.equipmentForm.controls.plant.setErrors(null);   
    }
   
  }

  processTranslations$(equipmentId: number): Observable<any> { 
    const differences = this.storedTranslations.length !== this.equipment.translations.length || this.storedTranslations.some((st: any) => {
      return this.equipment.translations.find((t: any) => {        
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
        plantId: this.equipment.plantId, // TODO: Get from profile
      }      
      const translationsToAdd = this.equipment.translations.map((t: any) => {
        return {
          id: null,
          equipmentId,
          name: t.name,
          reference: t.reference,
          notes: t.notes,
          languageId: t.languageId,
          plantId: this.equipment.plantId, // TODO: Get from profile
          status: RecordStatus.ACTIVE,
        }
      });
      const varToAdd = {
        translations: translationsToAdd,
      }
  
      return combineLatest([ 
        varToAdd.translations.length > 0 ? this._catalogsService.addEquipmentTransations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteEquipmentTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

 
  

  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === SystemTables.PLANTS) {
      if (getMoreDataParams.initArray) {
        this.plants.currentPage = 0;
        this.plants.items = [];
      } else if (!this.plants.pageInfo.hasNextPage) {
        return;
      } else {
        this.plants.currentPage++;
      }
      this.requestPlantsData(        
        this.plants.currentPage,
        getMoreDataParams.textToSearch,  
      ); 
    } 
   
        
  }

  requestPlantsData(currentPage: number, filterStr: string = null) {    
    this.plants = {
      ...this.plants,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);   
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const skipRecords = this.plants.items.length;

    const plantParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(plantParameters);
    this.plants$ = this._catalogsService.getPlantsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {
        const mappedItems = data?.data?.plantsPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        });
        this.plants = {
          ...this.plants,
          loading: false,
          pageInfo: data?.data?.plantsPaginated?.pageInfo,
          items: this.plants.items?.concat(mappedItems),
          totalCount: data?.data?.plantsPaginated?.totalCount,
        }        
      }),
      catchError(() => EMPTY)
    )    
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
