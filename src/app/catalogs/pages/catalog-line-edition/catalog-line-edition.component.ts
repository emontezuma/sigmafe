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
import { LineDetail, LineItem, emptyLineItem } from '../../models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem } from '../../models/catalogs-shared.models';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-catalog-line-edition',
  templateUrl: './catalog-line-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-line-edition.component.scss']
})
export class CatalogLineEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;

  // Lines ===============
  line: LineDetail = emptyLineItem;
  scroll$: Observable<any>;JSON: any;
;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>;
  duplicateMainImage$: Observable<any>; 
  valueTypeChanges$: Observable<any>;

  plants$: Observable<any>; 
  plants: GeneralCatalogData = emptyGeneralCatalogData; 
 
  

  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  line$: Observable<LineDetail>;
  translations$: Observable<any>;
  updateLine$: Observable<any>;
  updateLineCatalog$: Observable<any>;
  deleteLineTranslations$: Observable<any>;  
  addLineTranslations$: Observable<any>;  
  
  lineFormChangesSubscription: Subscription;
  
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
  lineData: LineItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';

  lineForm = new FormGroup({
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
      ApplicationModules.LINES_CATALOG_EDITION,
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
    this.lineFormChangesSubscription = this.lineForm.valueChanges.subscribe((lineFormChanges: any) => {
      if (!this.loaded) return;
      this.setEditionButtonsState();
    }); 
    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.LINES_CATALOG_EDITION,
          !animationFinished,
        ); 
      }
    ));    
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.LINES_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestLineData(+params['id']);
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
      from: ApplicationModules.LINES_CATALOG_EDITION,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.LINES_CATALOG_EDITION,
      false,
    );
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.lineFormChangesSubscription) this.lineFormChangesSubscription.unsubscribe(); 
  }
  
// Functions ================

  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.LINES_CATALOG_EDITION,
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
    if (action.from === ApplicationModules.LINES_CATALOG_EDITION && this.elements.length > 0) {
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
          this._location.replaceState('/catalogs/lines/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/lines'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this.duplicateMainImage();
        this._location.replaceState('/catalogs/lines/create');
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
        if (!this.line.id || this.line.id === null || this.line.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestLineData(this.line.id);
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
        if (this.line?.id > 0 && this.line.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR LINEA`,  
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
                message: $localize`Esta acción inactivará la linea con el Id <strong>${this.line.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const lineParameters = {
                settingType: 'status',
                id: this.line.id,
                customerId: this.line.customerId,
                              
                plantId: this.line.plantId,
                status: RecordStatus.INACTIVE,
              }
              const lines = this._sharedService.setGraphqlGen(lineParameters);
              this.updateLine$ = this._catalogsService.updateLineStatus$(lines)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateLine.length > 0 && data?.data?.createOrUpdateLine[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE)
                      const message = $localize`La linea ha sido inhabilitada`;
                      this.line.status = RecordStatus.INACTIVE;
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
        } else if (this.line?.id > 0 && this.line.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR LINEA`,  
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
                message: $localize`Esta acción reactivará la linea con el Id <strong>${this.line.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const lineParameters = {
                settingType: 'status',
                id: this.line.id,
                customerId: this.line.customerId,
                
                plantId: this.line.plantId,
                status: RecordStatus.ACTIVE,
              }
              const lines = this._sharedService.setGraphqlGen(lineParameters);
              this.updateLine$ = this._catalogsService.updateLineStatus$(lines)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateLine.length > 0 && data?.data?.createOrUpdateLine[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE)
                      const message = $localize`La linea ha sido reactivada`;
                      this.line.status = RecordStatus.ACTIVE;
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
        if (this.line?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones de la linea <strong>${this.line.id}</strong>`,
              topIcon: 'world',
              translations: this.line.translations,
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
                message: $localize`Esta acción inactivará a la linea ${this.line.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.line.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.line.translations.length > 0 ? $localize`Traducciones (${this.line.translations.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.line.translations.length > 0 ? 'accent' : '';   
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
      tooltip:  $localize`Regresar a la lista de lineas`,
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
      disabled: this.line?.status !== RecordStatus.ACTIVE,
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
      disabled: !!!this.line.id,
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
    this.lineForm.markAllAsTouched();
    this.lineForm.updateValueAndValidity(); 
    if (this.lineForm.valid) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.lineForm.controls) {
        if (this.lineForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.lineForm.controls[controlName]; 
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
        for (const controlName in this.lineForm.controls) {
          if (this.lineForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.lineForm.controls[controlName]; 
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
    const newRecord = !this.line.id || this.line.id === null || this.line.id === 0;

    try {
      const dataToSave = this.prepareRecordToSave(newRecord);
      this.updateLineCatalog$ = this._catalogsService.updateLineCatalog$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateLine.length > 0) {
            const lineId = data?.data?.createOrUpdateLine[0].id;          
            this.processTranslations$(lineId).subscribe(() => {
              this.requestLineData(lineId);
              setTimeout(() => {              
                let message = $localize`La linea ha sido actualizado`;
                if (newRecord) {                
                  message = $localize`La linea ha sido creado satisfactoriamente con el id <strong>${this.line.id}</strong>`;
                  this._location.replaceState(`/catalogs/lines/edit/${lineId}`);
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

  requestLineData(lineId: number): void { 
    let lines = undefined;
    lines = { lineId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "lineId": { "eq": ${lineId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.line$ = this._catalogsService.getLineDataGql$({ 
      lineId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
    }).pipe(
      map(([ lineGqlData, lineGqlTranslationsData ]) => {
        return this._catalogsService.mapOneLine({
          lineGqlData,  
          lineGqlTranslationsData,
        })
      }),
      tap((lineData: LineDetail) => {
        if (!lineData) return;
        this.line =  lineData;
        console.log(lineData)
        this.translationChanged = false;
        this.imageChanged = false;
        this.storedTranslations = JSON.parse(JSON.stringify(this.line.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.line.translations.length > 0 ? $localize`Traducciones (${this.line.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.line.translations.length > 0 ? 'accent' : '';   
        this.updateFormFromData();
        this.changeInactiveButton(this.line.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = lineData.translations.length > 0 ? $localize`Traducciones (${lineData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = lineData.translations.length > 0 ? 'accent' : '';
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
    .set('destFolder', `${environment.uploadFolders.catalogs}/lines`)
    .set('processId', this.line.id)
    .set('process', originProcess.CATALOGS_MOLDS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.imageChanged = true;
        this.lineForm.controls.mainImageName.setValue(res.fileName);
        this.line.mainImagePath = res.filePath;
        this.line.mainImageGuid = res.fileGuid;
        this.line.mainImage = `${environment.uploadFolders.completePathToFiles}/${res.filePath}`;
        const message = $localize`El archivo ha sido subido satisfactoriamente<br>Guarde La linea para aplicar el cambio`;
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
    this.lineForm.patchValue({
      name: this.line.name,
      reference: this.line.reference,      
      mainImageName: this.line.mainImageName,
      prefix: this.line.prefix,      
      notes: this.line.notes,      
      plant: this.line.plant,
      
    });
  } 

  prepareRecordToSave(newRecord: boolean): any {
    const fc = this.lineForm.controls;
    return  {
      id: this.line.id,
      customerId: 1, // TODO: Get from profile      
        status: newRecord ? RecordStatus.ACTIVE : this.line.status,
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.prefix.dirty || fc.prefix.touched || newRecord) && { prefix: fc.prefix.value },
      ...(fc.plant.dirty || fc.plant.touched || newRecord) && { plantId: fc.plant.value ? fc.plant.value.id : null },      
      
      

      ...(this.imageChanged) && { 
        mainImageName: fc.mainImageName.value,
        mainImagePath: this.line.mainImagePath,
        mainImageGuid: this.line.mainImageGuid, },
    }
  }

  setEditionButtonsState() {
    if (!this.line.id || this.line.id === null || this.line.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }
  
  removeImage() {
    this.imageChanged = true;
    this.lineForm.controls.mainImageName.setValue('');
    this.line.mainImagePath = '';
    this.line.mainImageGuid = '';
    this.line.mainImage = '';     
    const message = $localize`Se ha quitado la imagen de la linea<br>Guarde La linea para aplicar el cambio`;
    this._sharedService.showSnackMessage({
      message,
      duration: 5000,
      snackClass: 'snack-primary',
      icon: 'check',
    });
    this.setEditionButtonsState();    
  }

  initForm(): void {
    this.lineForm.reset();
    // Default values

    this.storedTranslations = [];
    this.translationChanged = false;
    this.line = emptyLineItem;
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
    this.line.id = null;
    this.line.createdBy = null;
    this.line.createdAt = null;
    this.line.updatedBy = null;
    this.line.updatedAt = null; 
    this.line.status = RecordStatus.ACTIVE; 
    this.line.translations.map((t) => {
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
      return $localize`Descripción o nombre de la linea`    
    } else if (fieldControlName === 'plant') {
      return $localize`Planta asociada a la linea`;
    }   
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.LINES_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.LINES_CATALOG_EDITION,
      loading,
    ); 
  }

  validateTables(): void {
    if (!this.lineForm.controls.plant.value || !this.lineForm.controls.plant.value.id) {
      this.lineForm.controls.plant.setErrors({ required: true });   
    } else if (this.lineForm.controls.plant.value.status === RecordStatus.INACTIVE) {
      this.lineForm.controls.plant.setErrors({ inactive: true });   
    } else {
      this.lineForm.controls.plant.setErrors(null);   
    }
   
  }

  processTranslations$(lineId: number): Observable<any> { 
    const differences = this.storedTranslations.length !== this.line.translations.length || this.storedTranslations.some((st: any) => {
      return this.line.translations.find((t: any) => {        
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
        plantId: this.line.plantId, // TODO: Get from profile
      }      
      const translationsToAdd = this.line.translations.map((t: any) => {
        return {
          id: null,
          lineId,
          name: t.name,
          reference: t.reference,
          notes: t.notes,
          languageId: t.languageId,
          plantId: this.line.plantId, // TODO: Get from profile
          status: RecordStatus.ACTIVE,
        }
      });
      const varToAdd = {
        translations: translationsToAdd,
      }
  
      return combineLatest([ 
        varToAdd.translations.length > 0 ? this._catalogsService.addLineTranslations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteLineTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

  duplicateMainImage() {    
    this.duplicateMainImage$ = this._catalogsService.duplicateMainImage$(originProcess.CATALOGS_VARIABLES, this.line.mainImageGuid)
    .pipe(
      tap((newAttachments) => {
        if (newAttachments.duplicated) {       
          this.imageChanged = true;   
          this.line.mainImageGuid = newAttachments.mainImageGuid;
          this.line.mainImageName = newAttachments.mainImageName;
          this.line.mainImagePath = newAttachments.mainImagePath;   

          this.line.mainImage = `${environment.uploadFolders.completePathToFiles}/${this.line.mainImagePath}`;
          this.lineForm.controls.mainImageName.setValue(this.line.mainImageName);
        }        
      })
    );
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
