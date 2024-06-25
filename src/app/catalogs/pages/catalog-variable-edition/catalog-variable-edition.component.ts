import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, originProcess, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, GeneralHardcodedValuesData, emptyGeneralHardcodedValuesData, GeneralCatalogParams, SimpleTable, GeneralMultipleSelcetionItems } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip, startWith, tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import { GeneralCatalogData, MoldThresoldTypes, VariableDetail, VariableItem, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesItem, emptyVariableItem } from '../../models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomValidators } from '../../custom-validators';
import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-catalog-variable-edition',
  templateUrl: './catalog-variable-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-variable-edition.component.scss']
})
export class CatalogVariableEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;

  // Variables ===============
  variable: VariableDetail = emptyVariableItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  uoms$: Observable<any>; 
  sensors$: Observable<any>; 
  sigmaTypes$: Observable<any>;
  valueTypes$: Observable<any>;
  resetValueModes$: Observable<any>;
  genYesNoValues$: Observable<any>;
  molds: GeneralCatalogData = emptyGeneralCatalogData; 
  molds$: Observable<any>;  
  actionPlans: GeneralCatalogData = emptyGeneralCatalogData; 
  actionPlans$: Observable<any>;  

  valueTypeChanges$: Observable<any>;
  // variableFormChanges$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  variable$: Observable<VariableDetail>;
  translations$: Observable<any>;
  updateVariable$: Observable<any>;
  updateVariableCatalog: Subscription;
  deleteVariableTranslations$: Observable<any>;  
  addVariableTranslations$: Observable<any>;  
  
  variableFormChangesSubscription: Subscription;
  
  uoms: GeneralCatalogData = emptyGeneralCatalogData; 
  sensors: GeneralCatalogData = emptyGeneralCatalogData; 
  sigmaTypes: GeneralCatalogData = emptyGeneralCatalogData;
  valueTypes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  resetValueModes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  
  uploadFiles: Subscription;
  
  catalogIcon: string = "equation";  
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
  variableData: VariableItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';

  variableForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),
    sigmaType: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    uom: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    sensor: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    valueType: new FormControl(emptyGeneralHardcodedValuesItem),
    resetValueMode: new FormControl(emptyGeneralHardcodedValuesItem),
    required: new FormControl(emptyGeneralHardcodedValuesItem),
    allowComments: new FormControl({
      ...emptyGeneralHardcodedValuesItem,
      value: GeneralValues.NO
    }),
    allowNoCapture: new FormControl({
      ...emptyGeneralHardcodedValuesItem,
      value: GeneralValues.NO
    }),
    showChart: new FormControl({
      ...emptyGeneralHardcodedValuesItem,
      value: GeneralValues.NO
    }),
    allowAlarm: new FormControl({
      ...emptyGeneralHardcodedValuesItem,
      value: GeneralValues.NO
    }),
    cumulative: new FormControl({
      ...emptyGeneralHardcodedValuesItem,
      value: GeneralValues.NO
    }),
    automaticActionPlan: new FormControl({
      ...emptyGeneralHardcodedValuesItem,
      value: GeneralValues.NO
    }),
    notifyAlarm: new FormControl({
      ...emptyGeneralHardcodedValuesItem,
      value: GeneralValues.NO
    }),
    notes: new FormControl(''),
    mainImageName: new FormControl(''),    
    reference: new FormControl(''),    
    prefix: new FormControl(''),    
    showNotes: new FormControl(false),
    minimum:  new FormControl(''),
    maximum:  new FormControl(''),
    molds:  new FormControl(''),
    actionPlans:  new FormControl(''),
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
    { id: '', description: $localize`No usar en Moldes` },  
    { id: 'y', description: $localize`TODOS los Moldes activos` },  
    { id: 'n', description: $localize`Los Moldes de lista` },  
    { id: 's', description: $localize`Seleccionar TODOS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  moldsCurrentSelection: GeneralMultipleSelcetionItems[] = [];
  actionPlansCurrentSelection: GeneralMultipleSelcetionItems[] = [];
  
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
    // this.variableForm.get('name').disable();
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.VARIABLES_CATALOG_EDITION,
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
        // this.requestProvidersData(currentPage);   
        // this.requestManufacturersData(currentPage);
        // this.requestPartNumbersData(currentPage);
        // this.requestLinesData(currentPage);
        // this.requestEquipmentsData(currentPage);
        // this.requestMoldTypessData(currentPage);
        // this.requestMoldClassesData(currentPage);
        this.requestMoldsData(currentPage);
        this.requestActionPlansData(currentPage);
        this.requestVariableValueTypesData(currentPage);
        this.requestVariableResetValueModesData(currentPage);
        this.requestGenYesNoValuesData(currentPage);
      })
    );
    this.valueTypeChanges$ = this.variableForm.controls.valueType.valueChanges.pipe(
      startWith(''),
      tap(valueTypeChanges => {
        if (valueTypeChanges === GeneralValues.N_A) {
          this.variableForm.get('thresholdYellow').disable();
          this.variableForm.get('thresholdRed').disable();
          this.variableForm.get('thresholdDateYellow').disable();
          this.variableForm.get('thresholdDateRed').disable();
        } else if (valueTypeChanges === MoldThresoldTypes.HITS) {
          this.variableForm.get('thresholdYellow').enable();
          this.variableForm.get('thresholdRed').enable();
          this.variableForm.get('thresholdDateYellow').disable();
          this.variableForm.get('thresholdDateRed').disable();
        } else if (valueTypeChanges === MoldThresoldTypes.DAYS) {
          this.variableForm.get('thresholdYellow').disable();
          this.variableForm.get('thresholdRed').disable();
          this.variableForm.get('thresholdDateYellow').enable();
          this.variableForm.get('thresholdDateRed').enable();
        } else if (valueTypeChanges === MoldThresoldTypes.BOTH) {
          this.variableForm.get('thresholdYellow').enable();
          this.variableForm.get('thresholdRed').enable();
          this.variableForm.get('thresholdDateYellow').enable();
          this.variableForm.get('thresholdDateRed').enable();
        }
      })
    );
    this.valueTypeChanges$ = this.variableForm.controls.allowAlarm.valueChanges.pipe(
      startWith(''),
      tap(valueTypeChanges => {
        if (valueTypeChanges === GeneralValues.NO) {
          this.variableForm.get('notifyAlarm').disable();          
        } else {
          this.variableForm.get('notifyAlarm').enable();          
        }
      })
    );
    this.variableFormChangesSubscription = this.variableForm.valueChanges.subscribe((variableFormChanges: any) => {
      if (!this.loaded) return;
      if (!this.variable.id || this.variable.id === null || this.variable.id === 0) {
        this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
      } else {
        this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
      }      
    }); 
    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.VARIABLES_CATALOG_EDITION,
          !animationFinished,
        ); 
      }
    ));
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.VARIABLES_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestVariableData(+params['id']);
        }
      })
    ); 
    this.calcElements();
    this.variableForm.controls.valueType.setValue(GeneralValues.N_A); 
    this.variableForm.controls.resetValueMode.setValue(GeneralValues.N_A); 
    setTimeout(() => {
      this.focusThisField = 'name';
      this.loaded = true;
    }, 200); 
    // this.variableForm.reset(this.mold);
  }

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.VARIABLES_CATALOG,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.VARIABLES_CATALOG,
      false,
    );
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.variableFormChangesSubscription) this.variableFormChangesSubscription.unsubscribe(); 
  }
  
// Functions ================
  requestVariableValueTypesData(currentPage: number) {
    this.valueTypes = {
      ...this.valueTypes,
      currentPage,
      loading: true,
    }        
    this.valueTypes$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.VARIABLE_VALUE_TYPES)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.valueTypes.items?.concat(data?.data?.hardcodedValues?.items);
        this.valueTypes = {
          ...this.valueTypes,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  requestVariableResetValueModesData(currentPage: number) {
    this.resetValueModes = {
      ...this.resetValueModes,
      currentPage,
      loading: true,
    }        
    this.resetValueModes$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.RESET_VALUE_MODES)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.resetValueModes.items?.concat(data?.data?.hardcodedValues?.items);
        this.resetValueModes = {
          ...this.resetValueModes,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
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

    const processId = !!this.variable.id ? this.variable.id : 0;
    const moldParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.CHECKLIST_TEMPLATES_YELLOW,
      processId, 
      takeRecords: this.takeRecords, 
      filter,       
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);    
    this.molds$ = this._catalogsService.getMoldsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.catalogDetailChecklistTemplate?.items.map((item) => {
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
          pageInfo: data?.data?.catalogDetailChecklistTemplate?.pageInfo,
          items: this.molds.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailChecklistTemplate?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestActionPlansData(currentPage: number, filterStr: string = null) {    
    this.actionPlans = {
      ...this.actionPlans,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.actionPlans.items.length;

    const processId = !!this.variable.id ? this.variable.id : 0;
    const moldParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.CHECKLIST_TEMPLATES_YELLOW,
      processId, 
      takeRecords: this.takeRecords, 
      filter,       
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);    
    this.actionPlans$ = this._catalogsService.getActionPlansLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.catalogDetailChecklistTemplate?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.id,
            valueRight: item.value,
            catalogDetailId: item.catalogDetailId,
          }
        })
        this.actionPlans = {
          ...this.actionPlans,
          loading: false,
          pageInfo: data?.data?.catalogDetailChecklistTemplate?.pageInfo,
          items: this.actionPlans.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailChecklistTemplate?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.VARIABLES_CATALOG_EDITION,
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
    if (action.from === ApplicationModules.VARIABLES_CATALOG_EDITION && this.elements.length > 0) {
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
              topIcon: 'warn-fill',
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
          this._location.replaceState('/catalogs/variables/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/variables'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this._location.replaceState('/catalogs/variables/create');
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
        if (!this.variable.id || this.variable.id === null || this.variable.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestVariableData(this.variable.id);
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
        if (this.variable?.id > 0 && this.variable.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR VARIABLE`,  
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
                message: $localize`Esta acción inactivará la variable con el Id <strong>${this.variable.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const variableParameters = {
                settingType: 'status',
                id: this.variable.id,
                customerId: this.variable.customerId,
                status: RecordStatus.INACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(variableParameters);
              this.updateVariable$ = this._catalogsService.updateVariableStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateVariable.length > 0 && data?.data?.createOrUpdateVariable[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE)
                      const message = $localize`La Variable ha sido inhabilitado`;
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
        } else if (this.variable?.id > 0 && this.variable.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR VARIABLE`,  
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
                message: $localize`Esta acción reactivará la variable con el Id <strong>${this.variable.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const variableParameters = {
                settingType: 'status',
                id: this.variable.id,
                customerId: this.variable.customerId,
                status: RecordStatus.ACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(variableParameters);
              this.updateVariable$ = this._catalogsService.updateVariableStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateVariable.length > 0 && data?.data?.createOrUpdateVariable[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE)
                      const message = $localize`La Variable ha sido reactivado`;
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
        if (this.variable?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones de la variable <strong>${this.variable.id}</strong>`,
              topIcon: 'world',
              translations: this.variable.translations,
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
                icon: 'garbage-can',
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
                message: $localize`Esta acción inactivará la variable ${this.variable.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.variable.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.variable.translations.length > 0 ? $localize`Traducciones (${this.variable.translations.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.variable.translations.length > 0 ? 'accent' : '';   
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
      tooltip:  $localize`Regresar a la lista de variables`,
      icon: 'arrow-left',
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
      disabled: this.variable?.status !== RecordStatus.ACTIVE,
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
      disabled: !!!this.variable.id,
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
    this.variableForm.markAllAsTouched();
    this.variableForm.updateValueAndValidity(); 
    if (this.variableForm.valid) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.variableForm.controls) {
        if (this.variableForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.variableForm.controls[controlName]; 
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
          topIcon: 'warn-fill',
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
        for (const controlName in this.variableForm.controls) {
          if (this.variableForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.variableForm.controls[controlName]; 
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
    const newRecord = !this.variable.id || this.variable.id === null || this.variable.id === 0;
    const dataToSave = this.prepareRecordToAdd(newRecord);
    this.updateVariableCatalog = this._catalogsService.updateVariableCatalog$(dataToSave)
    .subscribe((data: any) => {
      const variableId = data?.data?.createOrUpdateMold[0].id;
      if (variableId > 0) {        
        this.processTranslations$(variableId)
        .subscribe(() => {
          this.requestVariableData(variableId);
          setTimeout(() => {              
            let message = $localize`La variable ha sido actualizado`;
            if (newRecord) {                
              message = $localize`La variable ha sido creado satisfactoriamente con el id <strong>${this.variable.id}</strong>`;
              this._location.replaceState(`/catalogs/variables/edit/${this.variable.id}`);
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
    });
  }

  requestUomsData(currentPage: number, filterStr: string = null) {    
    this.uoms = {
      ...this.uoms,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);   
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const skipRecords = this.uoms.items.length;

    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters);
    this.uoms$ = this._catalogsService.getUomsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {
        const mappedItems = data?.data?.uomsPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        });
        this.uoms = {
          ...this.uoms,
          loading: false,
          pageInfo: data?.data?.uomsPaginated?.pageInfo,
          items: this.uoms.items?.concat(mappedItems),
          totalCount: data?.data?.uomsPaginated?.totalCount,
        }        
      }),
      catchError(() => EMPTY)
    )    
  }

  requestSensorsData(currentPage: number, filterStr: string = null) {    
    this.sensors = {
      ...this.sensors,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);   
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const skipRecords = this.sensors.items.length;

    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters);
    this.sensors$ = this._catalogsService.getSensorsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {
        const mappedItems = data?.data?.sensorsPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        });
        this.sensors = {
          ...this.sensors,
          loading: false,
          pageInfo: data?.data?.sensorsPaginated?.pageInfo,
          items: this.sensors.items?.concat(mappedItems),
          totalCount: data?.data?.sensorsPaginated?.totalCount,
        }        
      }),
      catchError(() => EMPTY)
    )    
  }

  requestSigmaTypesData(currentPage: number, filterStr: string = null) {    
    this.sigmaTypes = {
      ...this.sigmaTypes,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }
    const skipRecords = this.sigmaTypes.items.length;

    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters); 
    this.sigmaTypes$ = this._catalogsService.getSigmaTypesLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.sigmaTypesPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.sigmaTypes = {
          ...this.sigmaTypes,
          loading: false,
          pageInfo: data?.data?.sigmaTypesPaginated?.pageInfo,
          items: this.sigmaTypes.items?.concat(mappedItems),
          totalCount: data?.data?.sigmaTypesPaginated?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestVariableData(variableId: number): void { 
    let variables = undefined;
    variables = { variableId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "variableId": { "eq": ${variableId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.variable$ = this._catalogsService.getVariableDataGql$({ 
      variableId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
    }).pipe(
      map(([ variableGqlData, variableGqlTranslationsData ]) => {
        return this._catalogsService.mapOneVariable({
          variableGqlData,  
          variableGqlTranslationsData,
        })
      }),
      tap((variableData: VariableDetail) => {
        if (!variableData) return;
        this.variable =  variableData;
        this.translationChanged = false;
        this.imageChanged = false;
        this.storedTranslations = JSON.parse(JSON.stringify(this.variable.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.variable.translations.length > 0 ? $localize`Traducciones (${this.variable.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.variable.translations.length > 0 ? 'accent' : '';   
        this.updateFormFromData();
        this.changeInactiveButton(this.variable.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = variableData.translations.length > 0 ? $localize`Traducciones (${variableData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = variableData.translations.length > 0 ? 'accent' : '';
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
    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order,
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters);
    return this._catalogsService.getGenericsLazyLoadingDataGql$(variables).pipe();
  }

  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === SystemTables.UOMS) {
      if (getMoreDataParams.initArray) {
        this.uoms.currentPage = 0;
        this.uoms.items = [];
      } else if (!this.uoms.pageInfo.hasNextPage) {
        return;
      } else {
        this.uoms.currentPage++;
      }
      this.requestSensorsData(        
        this.uoms.currentPage,
        getMoreDataParams.textToSearch,  
      ); 

    } else if (getMoreDataParams.catalogName === SystemTables.SIGMA_TYPES) {
      if (getMoreDataParams.initArray) {
        this.sigmaTypes.currentPage = 0;
        this.sigmaTypes.items = [];
      } else if (!this.sigmaTypes.pageInfo.hasNextPage) {
        return;
      } else {
        this.sigmaTypes.currentPage++;
      }
      this.requestSigmaTypesData(        
        this.sigmaTypes.currentPage,
        getMoreDataParams.textToSearch,  
      ); 
    } if (getMoreDataParams.catalogName === SystemTables.SENSORS) {
      if (getMoreDataParams.initArray) {
        this.sensors.currentPage = 0;
        this.sensors.items = [];
      } else if (!this.sensors.pageInfo.hasNextPage) {
        return;
      } else {
        this.sensors.currentPage++;
      }
      this.requestSensorsData(        
        this.sensors.currentPage,
        getMoreDataParams.textToSearch,  
      ); 

    } else if (getMoreDataParams.catalogName === SystemTables.MOLDS) {
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
    }      
    else if (getMoreDataParams.catalogName === SystemTables.ACTION_PLANS) {
      if (this.actionPlans.loading) return;
      if (getMoreDataParams.initArray) {
        this.actionPlans.currentPage = 0;   
        this.actionPlans.items = [];
      } else if (!this.actionPlans.pageInfo.hasNextPage) {
        return;
      } else {
        this.actionPlans.currentPage++;
      }
      this.requestMoldsData(        
        this.actionPlans.currentPage,
        getMoreDataParams.textToSearch,  
      );    
    }      
    
  }

  onFileSelected(event: any) {
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/variables`)
    .set('processId', this.variable.id)
    .set('process', originProcess.CATALOGS_MOLDS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.imageChanged = true;
        this.variableForm.controls.mainImageName.setValue(res.fileName);
        this.variable.mainImagePath = res.filePath;
        this.variable.mainImageGuid = res.fileGuid;
        this.variable.mainImage = environment.serverUrl + '/' + res.filePath.replace(res.fileName, `${res.fileGuid}${res.fileExtension}`)                
        const message = $localize`El archivo ha sido subido satisfactoriamente<br>Guarde la variable para aplicar el cambio`;
        this._sharedService.showSnackMessage({
          message,
          duration: 5000,
          snackClass: 'snack-primary',
          icon: 'check',
        });
        if (!this.variable.id || this.variable.id === null || this.variable.id === 0) {
          this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
        } else {
          this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
        }
      }      
    });
  }

  handleOptionSelected(getMoreDataParams: any){
    console.log('[handleOptionSelected]', getMoreDataParams)
  }

  handleInputKeydown(event: KeyboardEvent) {
    console.log('[handleInputKeydown]', event)
  }

  handleMultipleSelectionChanged(catalog: string){    
    if (!this.variable.id || this.variable.id === null || this.variable.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
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
      if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = false;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = false;
    } else if (mode === toolbarMode.INITIAL_WITH_NO_DATA) {
      if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = true;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
    }    
  }

  updateFormFromData(): void {    
    this.variableForm.patchValue({
      name: this.variable.name,
      reference: this.variable.reference,      
      prefix: this.variable.prefix,      
      notes: this.variable.notes,      
      uom: this.variable.uom,
      valueType: this.variable.valueType,
      resetValueMode: this.variable.resetValueMode,
      required: this.variable.required,
      sigmaType: this.variable.sigmaType,
      showNotes: this.variable.showNotes,
    });
  } 

  prepareRecordToAdd(newRecord: boolean): any {
    const fc = this.variableForm.controls;
    return  {
        id: this.variable.id,
        customerId: 1, // TODO: Get from profile
        status: newRecord ? RecordStatus.ACTIVE : this.variable.status,
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.uom.dirty || fc.uom.touched || newRecord) && { uomId: fc.uom.value.id },      
      ...(fc.sigmaType.dirty || fc.sigmaType.touched || newRecord) && { sigmaTypeId: fc.sigmaType.value.id },
      ...(fc.valueType.dirty || fc.valueType.touched || newRecord) && { valueType: fc.valueType.value },
      ...(fc.showNotes.dirty || fc.showNotes.touched || newRecord) && { showNotes: fc.showNotes.value ? 'Y' : 'N' },
      ...(fc.resetValueMode.dirty || fc.resetValueMode.touched || newRecord) && { resetValueMode: fc.resetValueMode.value },      
      ...(fc.showNotes.dirty || fc.showNotes.touched || newRecord) && { showNotes: fc.showNotes.value },      
      ...(fc.resetValueMode.dirty || fc.resetValueMode.touched || newRecord) && { resetValueMode: fc.resetValueMode.value },      
      ...(fc.resetValueMode.dirty || fc.resetValueMode.touched || newRecord) && { resetValueMode: fc.resetValueMode.value },      
      ...(this.imageChanged) && { 
        mainImageName: fc.mainImageName.value,
        mainImagePath: this.variable.mainImagePath,
        mainImageGuid: this.variable.mainImageGuid, },
    }
  }
  
  removeImage() {
    this.imageChanged = true;
    this.variableForm.controls.mainImageName.setValue('');
    this.variable.mainImagePath = '';
    this.variable.mainImageGuid = '';
    this.variable.mainImage = '';     
    const message = $localize`Se ha quitado la imagen de la variable<br>Guarde la variable para aplicar el cambio`;
    this._sharedService.showSnackMessage({
      message,
      duration: 5000,
      snackClass: 'snack-primary',
      icon: 'check',
    });
    if (!this.variable.id || this.variable.id === null || this.variable.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }

  initForm(): void {
    this.variableForm.reset();
    // Default values
    this.variableForm.controls.required.setValue(GeneralValues.NO);
    this.variableForm.controls.valueType.setValue(GeneralValues.FREE_TEXT)
    this.variableForm.controls.resetValueMode.setValue(GeneralValues.N_A)
    this.storedTranslations = [];
    this.translationChanged = false;
    this.variable = emptyVariableItem;
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
    this.variable.id = null;
    this.variable.createdBy = null;
    this.variable.createdAt = null;
    this.variable.updatedBy = null;
    this.variable.updatedAt = null; 
    this.variable.status = RecordStatus.ACTIVE; 
    this.variable.translations.map((t) => {
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
      return $localize`Descripción o nombre de la variable`
    } else if (fieldControlName === 'uom') {
      return $localize`Unidad de medida`
    } else if (fieldControlName === 'sigmaType') {
      return $localize`Tipo de variable`
    } else if (fieldControlName === 'valueType') {
      return $localize`Tipo de valor`
    } else if (fieldControlName === 'resetValueMode') {
      return $localize`Modo de reseteo de la variable`    
    }
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.VARIABLES_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.VARIABLES_CATALOG_EDITION,
      loading,
    ); 
  }

  validateTables(): void {
    if (this.variableForm.controls.uom.value && this.variableForm.controls.uom.value.status === RecordStatus.INACTIVE) {
      this.variableForm.controls.uom.setErrors({ inactive: true });   
    }    
    // It is missing the validation for state and thresholdType because we dont retrieve the complete record but tghe value
  }

  processTranslations$(variableId: number): Observable<any> { 
    const differences = this.storedTranslations.length !== this.variable.translations.length || this.storedTranslations.some((st: any) => {
      return this.variable.translations.find((t: any) => {        
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
        customerId: 1, // TODO: Get from profile
      }      
      const translationsToAdd = this.variable.translations.map((t: any) => {
        return {
          id: null,
          variableId,
          description: t.description,
          reference: t.reference,
          notes: t.notes,
          languageId: t.languageId,
          customerId: 1, // TODO: Get from profile
          status: RecordStatus.ACTIVE,
        }
      });
      const varToAdd = {
        translations: translationsToAdd,
      }
  
      return combineLatest([ 
        varToAdd.translations.length > 0 ? this._catalogsService.addVariableTransations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteVariableTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
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

// End ======================
}
