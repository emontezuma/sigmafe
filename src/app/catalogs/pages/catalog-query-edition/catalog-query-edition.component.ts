import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, originProcess, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, GeneralCatalogParams, GeneralHardcodedValuesData, emptyGeneralHardcodedValuesData, GeneralMultipleSelcetionItems, SimpleTable } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, filter, map, of, skip,  tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';

import { HttpClient } from '@angular/common/http';

import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralHardcodedValuesItem } from '../../models/catalogs-shared.models';
import { emptyQueryItem, QueryDetail, QueryItem } from '../../models';

@Component({
  selector: 'app-catalog-query-edition',
  templateUrl: './catalog-query-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-query-edition.component.scss']
})
export class CatalogQueryEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;

  // Queries ===============
  query: QueryDetail = emptyQueryItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  plants$: Observable<any>; 
  plants: GeneralCatalogData = emptyGeneralCatalogData; 

  recipients$: Observable<any>; 

  recipients: GeneralCatalogData = emptyGeneralCatalogData; 

  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  query$: Observable<QueryDetail>;
  translations$: Observable<any>;
  updateQuery$: Observable<any>;
  updateQueryCatalog$: Observable<any>;
  deleteQueryTranslations$: Observable<any>;  
  addQueryTranslations$: Observable<any>;  
  fileData$: Subscription;
  
  queryFormChangesSubscription: Subscription;
  
  uploadFiles: Subscription;
  
  catalogIcon: string = "grouped_tasks";  
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
  queryData: QueryItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';
  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  genPeriodsTimeValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  genAlarmedValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  genStatesValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  
  queryForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),   
    notes: new FormControl(''),
  
    byDefault: new FormControl(emptyGeneralHardcodedValuesItem),
    public: new FormControl(emptyGeneralHardcodedValuesItem),
    alarmed: new FormControl(emptyGeneralHardcodedValuesItem),
    checklistState: new FormControl(emptyGeneralHardcodedValuesItem),
    molds:  new FormControl(''),
    variables:  new FormControl(''),
    partNumbers:  new FormControl(''),
    periodTime: new FormControl(emptyGeneralHardcodedValuesItem),
    fromDate:  new FormControl(''),
    toDate:  new FormControl(''),
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

  moldsOptions: SimpleTable[] = [
    { id: '', description: $localize`No filtrar moldes en esta cosulta` },  
    { id: 'y', description: $localize`TODOS los Moldes activos` },  
    { id: 'n', description: $localize`Los Moldes de lista` },  
    { id: 's', description: $localize`Seleccionar TODOS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  moldsCurrentSelection: GeneralMultipleSelcetionItems[] = [];  

  molds: GeneralCatalogData = emptyGeneralCatalogData; 
  molds$: Observable<any>;    
  multipleSearchDefaultValue: string = '';  

  variablesOptions: SimpleTable[] = [
    { id: '', description: $localize`No filtrar Variables en esta cosulta` },  
    { id: 'y', description: $localize`TODAS las Variables activos` },  
    { id: 'n', description: $localize`Las Variables de lista` },  
    { id: 's', description: $localize`Seleccionar TODAS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  variablesCurrentSelection: GeneralMultipleSelcetionItems[] = [];  

  variables: GeneralCatalogData = emptyGeneralCatalogData; 
  variables$: Observable<any>;  
  checklistLinesReport$: Observable<any>;  
  
  partNumbersOptions: SimpleTable[] = [
    { id: '', description: $localize`No filtrar Números de parte en esta cosulta` },  
    { id: 'y', description: $localize`TODOS los Números de parte activos` },  
    { id: 'n', description: $localize`Los Números de parte de lista` },  
    { id: 's', description: $localize`Seleccionar TODOS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  partNumbersCurrentSelection: GeneralMultipleSelcetionItems[] = [];  

  partNumbers: GeneralCatalogData = emptyGeneralCatalogData; 
  partNumbers$: Observable<any>;  

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
        this.requestMoldsData(currentPage);
        this.requestVariablesData(currentPage);
        this.requestPartNumbersData(currentPage);  
      })
    );
    this.queryFormChangesSubscription = this.queryForm.valueChanges.subscribe((queryFormChanges: any) => {
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
          this.requestQueryData(+params['id']);
        }
      })
    ); 
    this._router.events.pipe(
      filter((event) => event instanceof NavigationStart)
      ).subscribe((event) => {
      let alfa = 1;
    });
    this.calcElements();
    this.fillDataYesNo();
    this.fillPeriodsTime();
    this.fillDataYesNoAll();
    this.fillDataStates();
   
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
    if (this.queryFormChangesSubscription) this.queryFormChangesSubscription.unsubscribe(); 
  }
  
// Functions ================

  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.EQUIPMENTS_CATALOG_EDITION,
          show: true,
          buttonsToLeft: 2,
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
          this._location.replaceState('/catalogs/queries/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/queries'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
      
        this._location.replaceState('/catalogs/queries/create');
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
      } else if (action.action === ButtonActions.EXECUTE) {        
        this.elements.find(e => e.action === action.action).loading = true;
        this.submitControlled = true;
        const variables = {
          queryId: this.query.id,          
          customerId: 1,  // TODO: Get from profile
        }
        this.checklistLinesReport$ = this._catalogsService.getChecklistLinesReportToCsv$(variables)
        .pipe(
          tap((report) => {
            if (!report?.data?.exportChecklistReportToCsv?.exportedFilename) {
              const message = $localize`No hay datos con los parámetros seleccionados`;
              this._sharedService.showSnackMessage({
                message,
                snackClass: 'snack-warn',
                progressBarColor: 'warn',
                icon: 'grouped_tasks',
              });
            } else {
              this.fileData$ = this._catalogsService.getAllCsvData$(report?.data?.exportChecklistReportToCsv?.exportedFilename)
              .subscribe((data: any) => { 
                this.downloadFile(data, report?.data?.exportChecklistReportToCsv?.downloadFilename);
                const message = $localize`El   reporte se ha generado`;
                this._sharedService.showSnackMessage({
                  message,
                  snackClass: 'snack-primary',
                  progressBarColor: 'primary',
                  icon: 'grouped_tasks',
                });
              })
            }
          }),        
          catchError((error) => {
            const message = $localize`Error al ejecutar el reporte`;
            this._sharedService.showSnackMessage({
              message,
              snackClass: 'snack-warn',
              progressBarColor: 'warn',
              icon: 'grouped_tasks',
            });
            return EMPTY;
          })
        )
        setTimeout(() => {          
          this.elements.find(e => e.action === action.action).loading = false;
        }, 200);

        
      } else if (action.action === ButtonActions.CANCEL) {         
        this.elements.find(e => e.action === action.action).loading = true;
        let noData = true;
        if (!this.query.id || this.query.id === null || this.query.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestQueryData(this.query.id);
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
        if (this.query?.id > 0 && this.query.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR POSICION`,  
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
                message: $localize`Esta acción inactivará La consulta con el Id <strong>${this.query.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const queryParameters = {
                settingType: 'status',
                id: this.query.id,
                customerId: this.query.customerId,
                status: RecordStatus.INACTIVE,
              }
              const queries = this._sharedService.setGraphqlGen(queryParameters);
              this.updateQuery$ = this._catalogsService.updateQueryStatus$(queries)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateQuery.length > 0 && data?.data?.createOrUpdateQuery[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE)
                      const message = $localize`La consulta ha sido inhabilitada`;
                      this.query.status = RecordStatus.INACTIVE;
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
        } else if (this.query?.id > 0 && this.query.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR POSICION`,  
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
                message: $localize`Esta acción reactivará la consulta con el Id <strong>${this.query.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const queryParameters = {
                settingType: 'status',
                id: this.query.id,
                customerId: this.query.customerId,
                status: RecordStatus.ACTIVE,
              }
              const queries = this._sharedService.setGraphqlGen(queryParameters);
              this.updateQuery$ = this._catalogsService.updateQueryStatus$(queries)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateQuery.length > 0 && data?.data?.createOrUpdateQuery[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE)
                      const message = $localize`La consulta ha sido reactivada`;
                      this.query.status = RecordStatus.ACTIVE;
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
        if (this.query?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones de la consulta <strong>${this.query.id}</strong>`,
              topIcon: 'world',
              translations: this.query.translations,
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
                message: $localize`Esta acción inactivará a la consulta ${this.query.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.query.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.query.translations?.length > 0 ? $localize`Traducciones (${this.query.translations.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.query.translations?.length > 0 ? 'accent' : '';   
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
      visible: true,
      action: ButtonActions.BACK,
      },{
      type: 'button',
      caption: $localize`Ejecutar`,
      tooltip: $localize`Guarda los cambios y ejecuta la consulta...`,
      class: '',
      icon: 'grouped_tasks',
      iconSize: '24px',
      alignment: 'left',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
      visible: true,
      elementType: 'submit',
      action: ButtonActions.EXECUTE,
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
      disabled: this.query?.status !== RecordStatus.ACTIVE,
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
      disabled: !!!this.query.id,
      action: ButtonActions.TRANSLATIONS,      
    },];
  }

  fillDataYesNo() {
    this.genYesNoValues = {
      ...this.genYesNoValues,
      items: [{
        id: 1,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Si',      
        value: 'y',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 2,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'No',      
        value: 'n',
        disabled: false,
        status: 'active',
        selected: false,
      }],
    }
  }

  fillDataYesNoAll() {
    this.genAlarmedValues = {
      ...this.genAlarmedValues,
      items: [{
        id: 1,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'No filtrar',      
        value: '',
        disabled: false,
        status: 'active',
        selected: false,            
      },{
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Si',      
        value: 'y',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 3,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'No',      
        value: 'n',
        disabled: false,
        status: 'active',
        selected: false,
      }],
    }
  }

  fillDataStates() {
    this.genStatesValues = {
      ...this.genStatesValues,
      items: [{
        id: 1,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Cerrados',      
        value: 'closed',
        disabled: false,
        status: 'active',
        selected: false,            
      },{
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Rechazados',      
        value: 'rejected',
        disabled: false,
        status: 'active',
        selected: false,    
      }],
    }
  }

  fillPeriodsTime() {
    this.genPeriodsTimeValues = {
      ...this.genPeriodsTimeValues,
      items: [{
        id: 1,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Específico',      
        value: 'specific',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 2,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Año actual',      
        value: 'current-year',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 3,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Mes actual',      
        value: 'current-month',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 4,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Semana actual',
        value: 'current-week',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 5,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Día actual',
        value: 'current-day',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 6,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Año previo',      
        value: 'previous-year',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 7,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Mes previo',      
        value: 'previous-month',
        disabled: false,
        status: 'active',
        selected: false,
      },{
        id: 8,
        languageId: 1,
        mainImagePath: '',
        friendlyText: 'Semana previa',
        value: 'previuous-week',
        disabled: false,
        status: 'active',
        selected: false,
      }],
    }
    
  }

  downloadFile(data: any, fileName: string): void {
    var blob = new Blob(["\uFEFF" + data], {
      type: "text/csv;charset=utf-8",
    }),
    url = window.URL.createObjectURL(blob);
    let link = document.createElement("a"); 
    fileName = fileName.replace(/\n/g, "");
    fileName = fileName.replace(/\r/g, "");
    link.download = fileName;
    link.href = url;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
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
    this.queryForm.markAllAsTouched();
    this.queryForm.updateValueAndValidity(); 
    if (this.queryForm.valid) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.queryForm.controls) {
        if (this.queryForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.queryForm.controls[controlName]; 
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
        for (const controlName in this.queryForm.controls) {
          if (this.queryForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.queryForm.controls[controlName]; 
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
    if (this.query?.id > 0 && this.query.id > 0 && (this.query.userId !== this._sharedService.getUserProfile()?.id || !this._sharedService.getUserProfile)) {
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
            message: $localize`No puede actualizar una consulta de otro usuario. Copiéla y guardela separadamente.`,
          },
          showCloseButton: true,
        },
      }); 
      dialogResponse.afterClosed().subscribe((response) => {
        this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;
      });    
      return;
    }
    this.setViewLoading(true);
    const newRecord = !this.query.id || this.query.id === null || this.query.id === 0;

    try {
      const dataToSave = this.prepareRecordToSave(newRecord);

      this.updateQueryCatalog$ = this._catalogsService.updateQueryCatalog$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateUserDefinedQuery.length > 0) {
            const queryId = data?.data?.createOrUpdateUserDefinedQuery[0].id;   
            
            this.saveCatalogDetails$(queryId).subscribe(() => {
              this.requestQueryData(queryId);
              setTimeout(() => {              
                let message = $localize`La consulta ha sido actualizado`;
                if (newRecord) {                
                  message = $localize`La consulta ha sido creado satisfactoriamente con el id <strong>${this.query.id}</strong>`;
                  this._location.replaceState(`/catalogs/queries/edit/${queryId}`);
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

  requestQueryData(queryId: number): void { 
    let queries = undefined;
    queries = { queryId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "queryId": { "eq": ${queryId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.query$ = this._catalogsService.getQueryDataGql$({ 
      queryId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
    }).pipe(
      map(([ queryGqlData, queryGqlTranslationsData ]) => {
        return this._catalogsService.mapOneQuery({
          queryGqlData,  
          queryGqlTranslationsData,
        })
      }),
      tap((queryData: QueryDetail) => {
        if (!queryData) {
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
          this._location.replaceState('/catalogs/queries/create');
          return;
        }
        this.query =  queryData;
        this.translationChanged = false;
        this.moldsCurrentSelection = [];
        this.molds = emptyGeneralCatalogData; 
        this.partNumbers = emptyGeneralCatalogData; 
        this.variables = emptyGeneralCatalogData; 
        this.partNumbersCurrentSelection = [];
        this.variablesCurrentSelection = [];
        this.storedTranslations = JSON.parse(JSON.stringify(this.query.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.query.translations?.length > 0 ? $localize`Traducciones (${this.query.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.query.translations?.length > 0 ? 'accent' : '';   
        this.requestMoldsData(0);
        this.requestVariablesData(0);
        this.requestPartNumbersData(0);
        this.updateFormFromData();
        this.changeInactiveButton(this.query.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = queryData.translations?.length > 0 ? $localize`Traducciones (${queryData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = queryData.translations?.length > 0 ? 'accent' : '';
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
    this.queryForm.patchValue({
      name: this.query.name,
      byDefault: this.query.byDefault,      
      public: this.query.public,      
      checklistState: this.query.checklistState,      
      variables: this.query.variables,      
      molds: this.query.molds,      
      partNumbers: this.query.partNumbers,      
      periodTime: this.query.periodTime,
      toDate: this.query.toDate,
      fromDate: this.query.fromDate,
      alarmed: this.query.alarmed,
    });
  } 

  prepareRecordToSave(newRecord: boolean): any {
    let toDateToSave = null;
    if (this.queryForm.controls.toDate.value) {
      toDateToSave = this._sharedService.formatDate(
        (this.queryForm.controls.toDate.value ? this.queryForm.controls.toDate.value : new Date()),
        'yyyy/MM/dd'
      );            
    }
    let fromDateToSave = null;
    if (this.queryForm.controls.fromDate.value) {
      fromDateToSave = this._sharedService.formatDate(
        (this.queryForm.controls.fromDate.value ? this.queryForm.controls.fromDate.value : new Date()),
        'yyyy/MM/dd'
      );            
    }
    this.queryForm.markAllAsTouched();
    const fc = this.queryForm.controls;
    return  {
      id: this.query.id,
      customerId: 1, // TODO: Get from profile      
      status: newRecord ? RecordStatus.ACTIVE : this.query.status,
      toDate: toDateToSave,
      fromDate: fromDateToSave,
       ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.alarmed.dirty || fc.alarmed.touched || newRecord) && { alarmed: fc.alarmed.value },
      ...(fc.byDefault.dirty || fc.byDefault.touched || newRecord) && { byDefault: fc.byDefault.value },
      ...(fc.public.dirty || fc.public.touched || newRecord) && { public: fc.public.value },
      ...(fc.checklistState.dirty || fc.checklistState.touched || newRecord) && { checklistState: fc.checklistState.value },
      ...(fc.periodTime.dirty || fc.periodTime.touched || newRecord) && { periodTime: fc.periodTime.value },
      ...(fc.molds.dirty || fc.molds.touched || newRecord) && { molds: fc.molds.value },
      ...(fc.variables.dirty || fc.variables.touched || newRecord) && { variables: fc.variables.value },
      ...(fc.partNumbers.dirty || fc.partNumbers.touched || newRecord) && { partNumbers: fc.partNumbers.value }, 
    }
  }

  setEditionButtonsState() {
    if (!this.query.id || this.query.id === null || this.query.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }
  
 

  initForm(): void {    
    this.queryForm.reset();
    // Default values
    
    this.translationChanged = false;
    this.query = emptyQueryItem;    
    
    this.focusThisField = 'name';
    setTimeout(() => {
      this.queryForm.patchValue({
        byDefault: this.query.byDefault,
        public: this.query.public,      
        checklistState: this.query.checklistState,
        name: this.query.name,
        molds: this.query.molds,
        partNumbers: this.query.partNumbers,
        variables: this.query.variables,
        alarmed: this.query.alarmed,
        periodTime: this.query.periodTime,
        toDate: this.query.toDate,
        fromDate: this.query.fromDate,
      });
      this.catalogEdition.nativeElement.scrollIntoView({            
        behavior: 'smooth',
        block: 'start',
      });   
      this.focusThisField = '';
    }, 200);
  }

  initUniqueField(): void {
    this.query.id = null;
    this.query.createdBy = null;
    this.query.createdAt = null;
    this.query.updatedBy = null;
    this.query.updatedAt = null; 
    this.query.status = RecordStatus.ACTIVE; 
    this.query.translations.map((t) => {
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
      return $localize`Descripción o nombre de la consulta`    
    } else if (fieldControlName === 'plant') {
      return $localize`Planta asociada a la consulta`;
    } else if (fieldControlName === 'recipient') {
      return $localize`Recipiente asociado a la consulta`;
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
    
  }

   saveCatalogDetails$(processId: number): Observable<any> {
    const newRecord = !this.query.id || this.query.id === null || this.query.id === 0;
    if (this.moldsCurrentSelection.length > 0 || this.variablesCurrentSelection.length > 0 || this.partNumbersCurrentSelection.length > 0) {
      const moldsToDelete = this.moldsCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      const variablesToDelete = this.variablesCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      const partNumbersToDelete = this.partNumbersCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      
      const ctToDelete = {
        ids: [...moldsToDelete, ...variablesToDelete, ...partNumbersToDelete],
        customerId: 1, // TODO: Get from profile
      }
      const moldsToAdd = this.moldsCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.REPORTS,
          processId,
          detailTableName: SystemTables.MOLDS,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      const variablesToAdd = this.variablesCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.REPORTS,
          processId,
          detailTableName: SystemTables.VARIABLES,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      const pártNumbersToAdd = this.partNumbersCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.REPORTS,
          processId,
          detailTableName: SystemTables.PARTNUMBERS_QUERY,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      
      const ctToAdd = {
        catalogDetails: [...moldsToAdd, ...variablesToAdd, ...pártNumbersToAdd],
      }

      return combineLatest([ 
        ctToAdd.catalogDetails.length > 0 ? this._catalogsService.addOrUpdateCatalogDetails$(ctToAdd) : of(null), 
        ctToDelete.ids.length > 0 && !newRecord ? this._catalogsService.deleteCatalogDetails$(ctToDelete) :  of(null) 
      ]);
    } else {
      return of(null);
    }
  }

  handleMultipleSelectionChanged(catalog: string){    
    this.setEditionButtonsState();
  }

  requestMoldsData(currentPage: number, filterStr: string = null) {    
    this.molds = {
      ...this.molds,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.molds.items.length;

    const processId = !!this.query.id ? this.query.id : 0;
    const variableParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.REPORTS,
      processId, 
      takeRecords: this.takeRecords, 
      filter,       
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters);    
    this.molds$ = this._catalogsService.getMoldsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.catalogDetailMold?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.id,
            valueRight: item.value,
            catalogDetailId: item.catalogDetailId,
          }
        })
        this.molds = {
          ...this.molds,
          loading: false,
          pageInfo: data?.data?.catalogDetailMold?.pageInfo,
          items: this.molds.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailMold?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestVariablesData(currentPage: number, filterStr: string = null) {    
    this.variables = {
      ...this.variables,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.variables.items.length;

    const processId = !!this.query.id ? this.query.id : 0;
    const variableParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.REPORTS,
      processId, 
      takeRecords: this.takeRecords, 
      filter,       
    }
    const variables = this._sharedService.setGraphqlGen(variableParameters);    
    this.variables$ = this._catalogsService.getVariablesCatalogDetailsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.catalogDetailVariable?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.id,
            valueRight: item.value,
            catalogDetailId: item.catalogDetailId,
          }
        })
        this.variables = {
          ...this.variables,
          loading: false,
          pageInfo: data?.data?.catalogDetailVariable?.pageInfo,
          items: this.variables.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailVariable?.totalCount,
        }
      }),
      catchError((error) => {
        console.log(error);
        return EMPTY
    })

    )    
  }

 requestPartNumbersData(currentPage: number, filterStr: string = null) {    
    this.partNumbers = {
      ...this.partNumbers,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.partNumbers.items.length;

    const processId = !!this.query.id ? this.query.id : 0;
    const variableParameters = {
      settingType: 'multiSelection',
      skipRecords,  
      process: SystemTables.REPORTS,
      processId, 
      takeRecords: this.takeRecords, 
      filter,       
    }
    const variables = this._sharedService.setGraphqlGen(variableParameters);    
    this.partNumbers$ = this._catalogsService.getPartNumberCatalogDetailsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.catalogDetailPartNumber?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.id,
            valueRight: item.value,
            catalogDetailId: item.catalogDetailId,
          }
        })
        this.partNumbers = {
          ...this.partNumbers,
          loading: false,
          pageInfo: data?.data?.catalogDetailPartNumber?.pageInfo,
          items: this.partNumbers.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailPartNumber?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }
    
  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === SystemTables.MOLDS) {
      if (this.molds.loading) return;
      if (getMoreDataParams.initArray) {
        this.molds.currentPage = 0;   
        this.molds.items = [];
      } else if (!this.molds.pageInfo.hasNextPage) {
        return;
      } else {
        this.molds.currentPage++;
      }
      this.requestMoldsData(        
        this.molds.currentPage,
        getMoreDataParams.textToSearch,  
      );            
    } else if (getMoreDataParams.catalogName === SystemTables.PARTNUMBERS) {
      if (this.partNumbers.loading) return;
      if (getMoreDataParams.initArray) {
        this.partNumbers.currentPage = 0;   
        this.partNumbers.items = [];
      } else if (!this.partNumbers.pageInfo.hasNextPage) {
        return;
      } else {
        this.partNumbers.currentPage++;
      }
      this.requestPartNumbersData(        
        this.partNumbers.currentPage,
        getMoreDataParams.textToSearch,  
      );
    } else if (getMoreDataParams.catalogName === SystemTables.VARIABLES) {
      if (this.variables.loading) return;
      if (getMoreDataParams.initArray) {
        this.variables.currentPage = 0;   
        this.variables.items = [];
      } else if (!this.variables.pageInfo.hasNextPage) {
        return;
      } else {
        this.variables.currentPage++;
      }
      this.requestVariablesData(        
        this.variables.currentPage,
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
