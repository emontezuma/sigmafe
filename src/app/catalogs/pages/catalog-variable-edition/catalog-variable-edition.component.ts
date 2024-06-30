import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, originProcess, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, GeneralHardcodedValuesData, emptyGeneralHardcodedValuesData, GeneralCatalogParams, SimpleTable, GeneralMultipleSelcetionItems, HarcodedVariableValueType, yesNoNaByDefaultValue, yesNoByDefaultValue, Attachment } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip, tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import { VariableDetail, VariableItem, VariablePossibleValue, emptyVariableItem } from '../../models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomValidators } from '../../custom-validators';
import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesItem } from '../../models/catalogs-shared.models';

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
  @ViewChild('possibleValue', { static: false }) possibleValue: ElementRef;  

  // Variables ===============
  variable: VariableDetail = emptyVariableItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  uoms$: Observable<any>; 
  recipients$: Observable<any>;
  sensors$: Observable<any>; 
  sigmaTypes$: Observable<any>;
  valueTypes$: Observable<any>;
  resetValueModes$: Observable<any>;
  genYesNoValues$: Observable<any>;
  variableByDefaultDate$: Observable<any>;
  duplicateAttachmentsList$: Observable<any>;  

  molds: GeneralCatalogData = emptyGeneralCatalogData; 
  molds$: Observable<any>;  
  actionPlansToGenerate: GeneralCatalogData = emptyGeneralCatalogData; 
  actionPlansToGenerate$: Observable<any>;  

  valueTypeChanges$: Observable<any>;
  // variableFormChanges$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  variable$: Observable<VariableDetail>;
  translations$: Observable<any>;
  updateVariable$: Observable<any>;
  updateVariableCatalog$: Observable<any>;
  deleteVariableTranslations$: Observable<any>;  
  addVariableTranslations$: Observable<any>;  
  addAttachmentButtonClick: boolean = false;
  
  variableFormChangesSubscription: Subscription;
  
  uoms: GeneralCatalogData = emptyGeneralCatalogData; 
  sensors: GeneralCatalogData = emptyGeneralCatalogData; 
  sigmaTypes: GeneralCatalogData = emptyGeneralCatalogData;
  valueTypes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  resetValueModes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  variableByDefaultDate: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  recipients: GeneralCatalogData = emptyGeneralCatalogData;
  valuesList: VariablePossibleValue[] = []; 
  possibleValuesTableColumns: string[] = [ 'item', 'value', 'byDefault', 'alarmedValue', 'actions' ];
  possibleValuesTable = new MatTableDataSource<VariablePossibleValue>([]);
  possibleValuePositions = [
    { id: 'l', description: $localize`Al final de la lista` },  
    { id: 'f', description: $localize`Al prncipio de la lista` }, 
  ];

  attachmentsTableColumns: string[] = [ 'index', 'icon', 'name', 'actions-attachments' ];
  attachmentsTable = new MatTableDataSource<Attachment>([]);

  editingValue: number = -1;
  
  uploadFiles: Subscription;
  downloadFiles: Subscription;
  
  catalogIcon: string = 'equation';  
  variableAttachmentLabel: string = '';
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  harcodedValuesOrderById: any = JSON.parse(`{ "id": "${'ASC'}" }`);
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
  byDefaultValueType: string = '';
  tmpValueType: string = '';
  multipleSearchDefaultValue: string = '';

  variableForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),
    sigmaType: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    uom: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    recipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    // sensor: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    valueType: new FormControl(emptyGeneralHardcodedValuesItem),
    resetValueMode: new FormControl(emptyGeneralHardcodedValuesItem),
    required: new FormControl(emptyGeneralHardcodedValuesItem),
    allowComments: new FormControl(emptyGeneralHardcodedValuesItem),
    allowNoCapture: new FormControl(emptyGeneralHardcodedValuesItem),
    allowAlarm: new FormControl(emptyGeneralHardcodedValuesItem),
    showChart: new FormControl(emptyGeneralHardcodedValuesItem),
    accumulative: new FormControl(emptyGeneralHardcodedValuesItem),
    automaticActionPlan: new FormControl(emptyGeneralHardcodedValuesItem),
    notifyAlarm: new FormControl(emptyGeneralHardcodedValuesItem),
    notes: new FormControl(''),
    mainImageName: new FormControl(''),    
    reference: new FormControl(''),    
    prefix: new FormControl(''),    
    showNotes: new FormControl(false),
    minimum:  new FormControl(''),
    maximum:  new FormControl(''),
    molds:  new FormControl(''),
    actionPlansToGenerate:  new FormControl(''),
    byDefault:  new FormControl(''),    
    possibleValue: new FormControl(''),
    possibleValues: new FormControl(''),
    possibleValuePosition: new FormControl('l'),
    byDefaultDateType: new FormControl(emptyGeneralHardcodedValuesItem),    
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
    { id: '', description: $localize`No permitir la variable en ningún Molde` },  
    { id: 'y', description: $localize`TODOS los Moldes activos` },  
    { id: 'n', description: $localize`Los Moldes de lista` },  
    { id: 's', description: $localize`Seleccionar TODOS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  actionPlansToGenerateOptions: SimpleTable[] = [
    { id: '', description: $localize`No generar ningún Plan de acción` },  
    { id: 'y', description: $localize`TODOS los Planes de acción activos` },  
    { id: 'n', description: $localize`Los Planes de acción de lista` },  
    { id: 's', description: $localize`Seleccionar TODOS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  valuesByDefault: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 

  moldsCurrentSelection: GeneralMultipleSelcetionItems[] = [];
  actionPlansToGenerateCurrentSelection: GeneralMultipleSelcetionItems[] = [];
  
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
        // this.requestMoldsData(currentPage);
        this.requestActionPlansToGenerateData(currentPage);
        this.requestVariableValueTypesData(currentPage);
        this.requestVariableResetValueModesData(currentPage);
        this.requestGenYesNoValuesData(currentPage);
        this.requestVariableByDefaultDateValuesData(currentPage);        
      })
    );
        
    this.variableFormChangesSubscription = this.variableForm.valueChanges
    .subscribe(() => {
      if (!this.loaded) return;
      this.setEditionButtonsState();      
    });

    this.variableFormChangesSubscription = this.variableForm.controls.automaticActionPlan.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (value === GeneralValues.NO) {
        if (this.variableForm.get('actionPlansToGenerate').enabled) this.variableForm.get('actionPlansToGenerate').disable();
      } else if (value === GeneralValues.YES) { 
        if (this.variableForm.get('actionPlansToGenerate').disabled) this.variableForm.get('actionPlansToGenerate').enable();
      }      
    });

    this.variableFormChangesSubscription = this.variableForm.controls.minimum.valueChanges
    .subscribe((value: any) => {
      if (value && this.variableForm.controls.maximum.value && (+value > +this.variableForm.controls.maximum.value)) {
        this.variableForm.controls.minimum.setErrors({ invalidValue: true });
      } else {
        this.variableForm.controls.minimum.setErrors(null);
      }      
    });

    this.variableFormChangesSubscription = this.variableForm.controls.maximum.valueChanges
    .subscribe((value: any) => {
      if (value && this.variableForm.controls.minimum.value && (+value < +this.variableForm.controls.minimum.value)) {
        this.variableForm.controls.minimum.setErrors({ invalidValue: true });
      } else {
        this.variableForm.controls.minimum.setErrors(null);
      }      
    });

    this.variableFormChangesSubscription = this.variableForm.controls.valueType.valueChanges
    .subscribe((value: any) => {
      if (value === HarcodedVariableValueType.NUMERIC_RANGE) {
        if (this.variableForm.get('minimum').disabled) this.variableForm.get('minimum').enable();
        if (this.variableForm.get('maximum').disabled) this.variableForm.get('maximum').enable();
      } else if (value !== HarcodedVariableValueType.NUMERIC_RANGE) {
        if (this.variableForm.get('minimum').enabled) this.variableForm.get('minimum').disable();
        if (this.variableForm.get('maximum').enabled) this.variableForm.get('maximum').disable();
      }
      if (value === HarcodedVariableValueType.NUMERIC_RANGE || value === HarcodedVariableValueType.NUMBER) {
        this.byDefaultValueType = 'number'
      } else if (value === HarcodedVariableValueType.YES_NO) {
        this.valuesByDefault = {
          ...this.valuesByDefault,
          items: yesNoByDefaultValue,          
        }
        if (!this.variableForm.controls.byDefault.value) {
          this.variableForm.controls.byDefault.setValue('-');
        }        
      } else if (value === HarcodedVariableValueType.YES_NO_NA) {
        this.valuesByDefault = {
          ...this.valuesByDefault,
          items: yesNoNaByDefaultValue,          
        }
        if (!this.variableForm.controls.byDefault.value) {
          this.variableForm.controls.byDefault.setValue('-');
        }
      } else if (value === HarcodedVariableValueType.DATE || value === HarcodedVariableValueType.DATE_AND_TIME) {        
        this.variableForm.controls.byDefaultDateType.setValue(GeneralValues.DASH);        
      } else {
        this.byDefaultValueType = 'text'
        if (this.variableForm.controls.byDefault.value === '-') {
          this.variableForm.controls.byDefault.setValue('');
        }
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
      if (!this.variable.id) {
        this.loaded = true;
        this.initForm();
      }      
    }, 200);         
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
    if (this.downloadFiles) this.downloadFiles.unsubscribe();
    if (this.variableFormChangesSubscription) this.variableFormChangesSubscription.unsubscribe(); 
  }
  
// Functions ================
  requestRecipientsData(currentPage: number, filterStr: string = null) {    
    this.recipients = {
      ...this.recipients,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }
    const skipRecords = this.recipients.items.length;

    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters); 
    this.recipients$ = this._catalogsService.getRecipientsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.recipientsPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.recipients = {
          ...this.recipients,
          loading: false,
          pageInfo: data?.data?.recipientsPaginated?.pageInfo,
          items: this.recipients.items?.concat(mappedItems),
          totalCount: data?.data?.recipientsPaginated?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

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
    const variableParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.MOLDS,
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

  requestActionPlansToGenerateData(currentPage: number, filterStr: string = null) {    
    this.actionPlansToGenerate = {
      ...this.actionPlansToGenerate,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.actionPlansToGenerate.items.length;

    const processId = !!this.variable.id ? this.variable.id : 0;
    const variableParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.VARIABLE_TEMPLATE_ACTION_PLANS,
      processId, 
      takeRecords: this.takeRecords, 
      filter,       
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters);    
    this.actionPlansToGenerate$ = this._catalogsService.getActionPlansToGenerateLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.catalogDetailTemplateActionPlan?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.id,
            valueRight: item.value,
            catalogDetailId: item.catalogDetailId,
          }
        })
        this.actionPlansToGenerate = {
          ...this.actionPlansToGenerate,
          loading: false,
          pageInfo: data?.data?.catalogDetailTemplateActionPlan?.pageInfo,
          items: this.actionPlansToGenerate.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailTemplateActionPlan?.totalCount,
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
        this.duplicateAttachments();
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
                      this.changeInactiveButton(RecordStatus.INACTIVE);
                      this.variable.status = RecordStatus.INACTIVE;
                      const message = $localize`La Variable ha sido inhabilitada`;
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
                      this.variable.status = RecordStatus.ACTIVE;
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
    this.updateVariableCatalog$ = this._catalogsService.updateVariableCatalog$(dataToSave)
    .pipe(
      tap((data: any) => {
        if (data?.data?.createOrUpdateVariable.length > 0) {
          const variableId = data?.data?.createOrUpdateVariable[0].id;
          const files = this.variable.attachments.map((a) => a.id);
          combineLatest([ 
            this.processTranslations$(variableId),
            this.saveCatalogDetails$(variableId),
            this._catalogsService.saveAttachments$(originProcess.CATALOGS_VARIABLES_ATTACHMENTS, variableId, files),
          ])      
          .subscribe((data: any) => {
            this.requestVariableData(variableId);
            setTimeout(() => {              
              let message = $localize`La variable ha sido actualizada`;
              if (newRecord) {                
                message = $localize`La variable ha sido creada satisfactoriamente con el id <strong>${variableId}</strong>`;
                this._location.replaceState(`/catalogs/variables/edit/${variableId}`);
              }
              this._sharedService.showSnackMessage({
                message,
                snackClass: 'snack-accent',
                progressBarColor: 'accent',                
              });
              this.setViewLoading(false);
              this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;
            }, 200);
          })
        }        
      }),
      catchError(() => {
        this.setViewLoading(false);
        return of(null);        
      })
    )    
  }

  saveCatalogDetails$(processId: number): Observable<any> {
    if (this.moldsCurrentSelection.length > 0 || this.actionPlansToGenerateCurrentSelection.length > 0) {
      const moldsToDelete = this.moldsCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      const actionPlansToGenerateToDelete = this.actionPlansToGenerateCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      const ctToDelete = {
        ids: [...moldsToDelete, ...actionPlansToGenerateToDelete],
        customerId: 1, // TODO: Get from profile
      }
      const moldsToAdd = this.moldsCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.VARIABLE_TEMPLATE_ACTION_PLANS,
          processId,
          detailTableName: SystemTables.TEMPLATE_ACTION_PLANS,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      const actionPlansToGenerateToAdd = this.actionPlansToGenerateCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.VARIABLE_TEMPLATE_ACTION_PLANS,
          processId,
          detailTableName: SystemTables.TEMPLATE_ACTION_PLANS,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      const ctToAdd = {
        catalogDetails: [...moldsToAdd, ...actionPlansToGenerateToAdd],
      }

      return combineLatest([ 
        ctToAdd.catalogDetails.length > 0  ? this._catalogsService.addOrUpdateCatalogDetails$(ctToAdd) : of(null), 
        ctToDelete.ids.length > 0 ? this._catalogsService.deleteCatalogDetails$(ctToDelete) :  of(null) 
      ]);
    } else {
      return of(null);
    }
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
    const process = originProcess.CATALOGS_VARIABLES_ATTACHMENTS;

    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.variable$ = this._catalogsService.getVariableDataGql$({ 
      variableId,      
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter,
      process,
      customerId: 1, // TODO: get from user
    }).pipe(
      map(([ variableGqlData, variableGqlTranslationsData, variableGqlAttachments ]) => {
        return this._catalogsService.mapOneVariable({
          variableGqlData,  
          variableGqlTranslationsData,
          variableGqlAttachments,
        })
      }),
      tap((variableData: VariableDetail) => {
        if (!variableData) return;
        this.variable =  variableData;

        this.moldsCurrentSelection = [];
        this.actionPlansToGenerateCurrentSelection = [];

        this.molds.currentPage = 0;   
        this.molds.items = [];
        this.actionPlansToGenerate.currentPage = 0;   
        this.actionPlansToGenerate.items = [];
        // this.requestMoldsData(0);
        this.requestActionPlansToGenerateData(0);
        
        this.translationChanged = false;
        this.imageChanged = false;
        this.storedTranslations = JSON.parse(JSON.stringify(this.variable.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.variable.translations.length > 0 ? $localize`Traducciones (${this.variable.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.variable.translations.length > 0 ? 'accent' : '';   
        this.updateFormFromData();
        this.prepareListOfValues();
        this.changeInactiveButton(this.variable.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = variableData.translations.length > 0 ? $localize`Traducciones (${variableData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = variableData.translations.length > 0 ? 'accent' : '';
        }        
        this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        this.setViewLoading(false);
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);
        this.setAttachmentLabel();
        this.loaded = true;
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
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
      this.requestUomsData(        
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
    else if (getMoreDataParams.catalogName === SystemTables.TEMPLATE_ACTION_PLANS) {
      if (this.actionPlansToGenerate.loading) return;
      if (getMoreDataParams.initArray) {
        this.actionPlansToGenerate.currentPage = 0;   
        this.actionPlansToGenerate.items = [];
      } else if (!this.actionPlansToGenerate.pageInfo.hasNextPage) {
        return;
      } else {
        this.actionPlansToGenerate.currentPage++;
      }
      this.requestActionPlansToGenerateData(        
        this.actionPlansToGenerate.currentPage,
        getMoreDataParams.textToSearch,  
      );    
    } else if (getMoreDataParams.catalogName === SystemTables.RECIPIENTS) {
      if (getMoreDataParams.initArray) {
        this.recipients.currentPage = 0;
        this.recipients.items = [];
      } else if (!this.recipients.pageInfo.hasNextPage) {
        return;
      } else {
        this.recipients.currentPage++;
      }
      this.requestRecipientsData(        
        this.recipients.currentPage,
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
    .set('process', originProcess.CATALOGS_VARIABLES);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.imageChanged = true;
        this.variableForm.controls.mainImageName.setValue(res.fileName);
        this.variable.mainImagePath = res.filePath;
        this.variable.mainImageGuid = res.fileGuid;
        this.variable.mainImage = `${environment.uploadFolders.completePathToFiles}/${res.filePath}`;
        const message = $localize`El archivo ha sido subido satisfactoriamente<br>Guarde la variable para aplicar el cambio`;
        this._sharedService.showSnackMessage({
          message,
          duration: 3000,
          snackClass: 'snack-primary',
          icon: 'check',
        });
        this.setEditionButtonsState();
      }      
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
    if (this.elements.length === 0 || !this.loaded ) return;
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
    this.variableForm.patchValue({
      name: this.variable.name,
      reference: this.variable.reference,      
      prefix: this.variable.prefix,      
      notes: this.variable.notes,      
      uom: this.variable.uom,
      recipient: this.variable.recipient,      
      valueType: this.variable.valueType,
      resetValueMode: this.variable.resetValueMode,
      required: this.variable.required,
      allowAlarm: this.variable.allowAlarm,
      allowNoCapture: this.variable.allowComments,
      allowComments: this.variable.allowComments,
      showChart: this.variable.showChart,      
      notifyAlarm: this.variable.notifyAlarm,
      accumulative: this.variable.accumulative,
      automaticActionPlan: this.variable.automaticActionPlan,    
      byDefault: this.variable.byDefault,    
      byDefaultDateType: this.variable.byDefaultDateType,    
      actionPlansToGenerate: this.variable.actionPlansToGenerate,    
      mainImageName: this.variable.mainImageName,      
      sigmaType: this.variable.sigmaType,
      showNotes: this.variable.showNotes === GeneralValues.YES,
      minimum: this.variable.minimum,
      maximum: this.variable.maximum,      
    });
  } 

  prepareRecordToAdd(newRecord: boolean): any {
    const fc = this.variableForm.controls;
    return  {
        id: this.variable.id,
        customerId: 1, // TODO: Get from profile
        status: newRecord ? RecordStatus.ACTIVE : this.variable.status,
        possibleValues: JSON.stringify(this.valuesList),
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.prefix.dirty || fc.prefix.touched || newRecord) && { prefix: fc.prefix.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.uom.dirty || fc.uom.touched || newRecord) && { uomId: fc.uom.value.id },      
      ...(fc.recipient.dirty || fc.recipient.touched || newRecord) && { recipientId: fc.recipient.value.id },      
      ...(fc.sigmaType.dirty || fc.sigmaType.touched || newRecord) && { sigmaTypeId: fc.sigmaType.value.id },
      ...(fc.valueType.dirty || fc.valueType.touched || newRecord) && { valueType: fc.valueType.value },
      ...(fc.showNotes.dirty || fc.showNotes.touched || newRecord) && { showNotes: fc.showNotes.value ? 'y' : 'n' },
      ...(fc.resetValueMode.dirty || fc.resetValueMode.touched || newRecord) && { resetValueMode: fc.resetValueMode.value },
      ...(fc.allowAlarm.dirty || fc.allowAlarm.touched || newRecord) && { allowAlarm: fc.allowAlarm.value },
      ...(fc.showChart.dirty || fc.showChart.touched || newRecord) && { showChart: fc.showChart.value },
      ...(fc.allowComments.dirty || fc.allowComments.touched || newRecord) && { allowComments: fc.allowComments.value },
      ...(fc.allowNoCapture.dirty || fc.allowNoCapture.touched || newRecord) && { allowNoCapture: fc.allowNoCapture.value },
      ...(fc.required.dirty || fc.required.touched || newRecord) && { required: fc.required.value },
      ...(fc.byDefault.dirty || fc.byDefault.touched || newRecord) && { byDefault: fc.byDefault.value },
      ...(fc.byDefaultDateType.dirty || fc.byDefaultDateType.touched || newRecord) && { byDefaultDateType: fc.byDefaultDateType.value },
      ...(fc.automaticActionPlan.dirty || fc.automaticActionPlan.touched || newRecord) && { automaticActionPlan: fc.automaticActionPlan.value },
      ...(fc.accumulative.dirty || fc.accumulative.touched || newRecord) && { accumulative: fc.accumulative.value },      
      ...(fc.notifyAlarm.dirty || fc.notifyAlarm.touched || newRecord) && { notifyAlarm: fc.notifyAlarm.value },            
      ...(fc.minimum.dirty || fc.minimum.touched || newRecord) && { minimum: fc.minimum.value ? fc.minimum.value : null },
      ...(fc.maximum.dirty || fc.maximum.touched || newRecord) && { maximum: fc.maximum.value ? fc.maximum.value : null },
      ...(fc.actionPlansToGenerate.dirty || fc.actionPlansToGenerate.touched || newRecord) && { actionPlansToGenerate: fc.actionPlansToGenerate.value },
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
      duration: 3000,
      snackClass: 'snack-primary',
      icon: 'check',
    });
    this.setEditionButtonsState();
  }

  initForm(): void {
    this.variableForm.reset();
    this.variable.attachments = [];
    this.actionPlansToGenerateCurrentSelection = [];
    this.multipleSearchDefaultValue = '';
    // Default values
    this.variableForm.controls.required.setValue(GeneralValues.NO);
    this.variableForm.controls.notifyAlarm.setValue(GeneralValues.NO);
    this.variableForm.controls.allowAlarm.setValue(GeneralValues.NO);
    this.variableForm.controls.allowNoCapture.setValue(GeneralValues.NO);        
    this.variableForm.controls.allowComments.setValue(GeneralValues.NO);
    this.variableForm.controls.showChart.setValue(GeneralValues.NO);    
    this.variableForm.controls.valueType.setValue(GeneralValues.FREE_TEXT)
    this.variableForm.controls.resetValueMode.setValue(GeneralValues.N_A);
    this.variableForm.controls.automaticActionPlan.setValue(GeneralValues.NO);
    this.variableForm.controls.byDefault.setValue(GeneralValues.NO);
    this.variableForm.controls.byDefaultDateType.setValue(GeneralValues.DASH);    
    this.variableForm.controls.molds.setValue('');       
    this.variableForm.controls.possibleValuePosition.setValue('l');
    this.variableForm.controls.possibleValue.setValue('');
    this.variableForm.controls.actionPlansToGenerate.setValue('');    
    this.variableForm.controls.minimum.setValue(null);    
    this.variableForm.controls.maximum.setValue(null);    
    this.valuesList = [];
    this.storedTranslations = [];
    this.translationChanged = false;
    this.variable = emptyVariableItem;
    this.focusThisField = 'name';
    // this.requestMoldsData(0);
    this.requestActionPlansToGenerateData(0);
        
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
    } else if (fieldControlName === 'minimum') {
      return $localize`Rango de valores incorrecto`    
    } else if (fieldControlName === 'recipient') {
      return $localize`Recipiente`    
    } else if (fieldControlName === 'possibleValues') {
      return $localize`Agregue al menos un valor a la lista de posibles valores de la variable`    
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
    if (this.variableForm.controls.valueType.value === HarcodedVariableValueType.LIST) {
      if (this.valuesList.length === 0) {
        this.variableForm.controls.possibleValues.setErrors({ inactive: true });   
      } else {
        this.variableForm.controls.possibleValues.setErrors(null);   
      }
    } else {
      this.variableForm.controls.possibleValues.setErrors(null);   
    }
    if (this.variableForm.controls.notifyAlarm.value && this.variableForm.controls.recipient.value.status === RecordStatus.INACTIVE) {
      this.variableForm.controls.recipient.setErrors({ inactive: true });   
    }    
    // It is missing the validation for state and thresholdType because we dont retrieve the complete record but tghe value
  }

  processTranslations$(variableId: number): Observable<any> { 
    const differences = this.storedTranslations.length !== this.variable.translations.length || this.storedTranslations.some((st: any) => {
      return this.variable.translations.find((t: any) => {        
        return st.languageId === t.languageId &&
        st.id === t.id &&
        (st.reference !== t.reference || 
        st.name !== t.name || 
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
          name: t.name,
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

  handleMoveToFirst(id: number) {
    const valueIndex = this.valuesList.findIndex((v: VariablePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.valuesList[valueIndex]));
    this.valuesList.splice(valueIndex, 1);
    this.valuesList.unshift({
      order: 0,
      value: tmpValue.value,
      byDefault: tmpValue.byDefault,
      alarmedValue: tmpValue.alarmedValue,
    })
    let index = 1;
    this.valuesList.forEach((v: VariablePossibleValue) => {
      v.order = index++;
    });
    this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.valuesList);    
    this.setEditionButtonsState();
  }

  handleMoveToUp(id: number) {
    const valueIndex = this.valuesList.findIndex((v: VariablePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.valuesList[valueIndex]));
    const editingItem = this.valuesList[valueIndex - 1];

    if (editingItem) {      
      this.valuesList[valueIndex].value = editingItem.value;
      this.valuesList[valueIndex].byDefault = editingItem.byDefault;
      this.valuesList[valueIndex].alarmedValue = editingItem.alarmedValue;

      editingItem.value = tmpValue.value;
      editingItem.byDefault = tmpValue.byDefault;
      editingItem.alarmedValue = tmpValue.alarmedValue;
      
      this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.valuesList);    
      this.setEditionButtonsState();      
    }
  }

  handleMoveToDown(id: number) {
    const valueIndex = this.valuesList.findIndex((v: VariablePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.valuesList[valueIndex]));
    const editingItem = this.valuesList[valueIndex + 1];
    
    if (editingItem) {      
      this.valuesList[valueIndex].value = editingItem.value;
      this.valuesList[valueIndex].byDefault = editingItem.byDefault;
      this.valuesList[valueIndex].alarmedValue = editingItem.alarmedValue;      

      editingItem.value = tmpValue.value;
      editingItem.byDefault = tmpValue.byDefault;
      editingItem.alarmedValue = tmpValue.alarmedValue;      
      
      this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.valuesList);    
      this.setEditionButtonsState();      
    }
  }

  handleEdit(id: number) {
    this.editingValue = id;
    this.variableForm.controls.possibleValue.setValue(this.valuesList.find((v: VariablePossibleValue) => v.order === id).value);
    this.possibleValuePositions.push(
      { id: 's', description: $localize`Orden original` },       
    )
    if (this.variableForm.controls.possibleValuePosition.enabled) this.variableForm.controls.possibleValuePosition.disable();
    this.variableForm.controls.possibleValuePosition.setValue('s');
  }

  handleRemove(id: number) {
    const valueIndex = this.valuesList.findIndex((v: VariablePossibleValue) => v.order === id);
    this.valuesList.splice(valueIndex, 1);
    let index = 1;
    this.valuesList.forEach((v: VariablePossibleValue) => {
      v.order = index++;
    });
    this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.valuesList);
    if (this.variableForm.controls.possibleValuePosition.disabled) this.variableForm.controls.possibleValuePosition.enable();
    this.setEditionButtonsState();
  }

  handleAlarmed(id: number) {
    const value = this.valuesList.find((v: VariablePossibleValue) => v.order === id);
    value.alarmedValue = !value.alarmedValue;
    this.setEditionButtonsState();
  }

  handleByDefault(id: number) {
    if (this.valuesList.length === 1 && this.valuesList[0].byDefault) {
      this.valuesList[0].byDefault = false;
    } else {
      this.valuesList.forEach((v: VariablePossibleValue) => {
        v.byDefault = v.order === id;
      });    
    }
    
    this.setEditionButtonsState();
  }

  setEditionButtonsState() {
    if (!this.variable.id || this.variable.id === null || this.variable.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }

  handleEditPossibleValue() {
    if (this.editingValue > -1) {
      const editingItem = this.valuesList.find((v: VariablePossibleValue) => v.order === this.editingValue);
      if (editingItem) {
        editingItem.value = this.variableForm.controls.possibleValue.value;
        this.possibleValuePositions.pop();
      }        
    } else {
      if (this.variableForm.controls.possibleValuePosition.value === 'l') {
        this.valuesList.push({
          order: this.valuesList.length + 1,
          value: this.variableForm.controls.possibleValue.value,
          byDefault: false,
          alarmedValue: false,
        })
      } else {
        this.addPossibleValueAtFirst();
      }
      this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.valuesList);      
    }
    this.editingValue = -1;   
    this.variableForm.controls.possibleValue.setValue('');
    this.variableForm.controls.possibleValuePosition.setValue('l');      
    setTimeout(() => {
      if (this.variableForm.controls.possibleValuePosition.disabled) this.variableForm.controls.possibleValuePosition.enable();
      this.possibleValue.nativeElement.focus();      
    }, 100)
  }

  addPossibleValueAtFirst() {
    this.valuesList.unshift({
      order: 0,
      value: this.variableForm.controls.possibleValue.value,
      byDefault: false,
      alarmedValue: false,
    })
    let index = 1;
    this.valuesList.forEach((v: VariablePossibleValue) => {
      v.order = index++;
    })
  }

  handleKeyDown(event: KeyboardEvent) {     
    if (event.key === 'Enter' && this.variableForm.controls.possibleValue.value) {
      event.preventDefault();
      event.stopPropagation();
      this.handleEditPossibleValue();      
    }    
  }

  handleCancelPossibleValue() {
    this.variableForm.controls.possibleValue.setValue('');
    this.variableForm.controls.possibleValuePosition.setValue('l');
    if (this.variableForm.controls.possibleValuePosition.disabled) this.variableForm.controls.possibleValuePosition.enable();
    this.editingValue = -1;
    setTimeout(() => {
      this.possibleValue.nativeElement.focus();    
    }, 100)
  }

  prepareListOfValues() {
    if (this.variable.possibleValues) {
      try {
        this.valuesList = JSON.parse(this.variable.possibleValues);
      } catch (error) {
        this.valuesList = null;
      }          
    } else {
      this.valuesList = null;
    }
    this.possibleValuesTable = new MatTableDataSource<VariablePossibleValue>(this.valuesList);        
  }

  handleAttachmentMoveToFirst(id: number) {
    const valueIndex = this.variable.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.variable.attachments[valueIndex]));
    this.variable.attachments.splice(valueIndex, 1);
    this.variable.attachments.unshift({
      index: 0,
      name: tmpValue.name,
      image: tmpValue.image,
      id: tmpValue.id,
      icon: tmpValue.icon,      
    })
    let index = 0;
    this.variable.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);    
    this.setEditionButtonsState();
  }

  handleAttachmentMoveToLast(id: number) {
    const valueIndex = this.variable.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.variable.attachments[valueIndex]));
    this.variable.attachments.splice(valueIndex, 1);
    this.variable.attachments.push({
      index: 0,
      name: tmpValue.name,
      image: tmpValue.image,
      id: tmpValue.id,
      icon: tmpValue.icon,      
    })
    let index = 0;
    this.variable.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);    
    this.setEditionButtonsState();
  }

  handleAttachmentMoveToUp(id: number) {
    const valueIndex = this.variable.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.variable.attachments[valueIndex]));
    const editingItem = this.variable.attachments[valueIndex - 1];

    if (editingItem) {      
      this.variable.attachments[valueIndex].name = editingItem.name;
      this.variable.attachments[valueIndex].id = editingItem.id;
      this.variable.attachments[valueIndex].icon = editingItem.icon;
      this.variable.attachments[valueIndex].image = editingItem.image;

      editingItem.name = tmpValue.name;
      editingItem.id = tmpValue.id;
      editingItem.icon = tmpValue.icon;
      editingItem.image = tmpValue.image;
      
      this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);    
      this.setEditionButtonsState();      
    }
  }

  handleAttachmentMoveToDown(id: number) {
    const valueIndex = this.variable.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.variable.attachments[valueIndex]));
    const editingItem = this.variable.attachments[valueIndex + 1];
    
    if (editingItem) {      
      this.variable.attachments[valueIndex].name = editingItem.name;
      this.variable.attachments[valueIndex].image = editingItem.image;
      this.variable.attachments[valueIndex].id = editingItem.id;
      this.variable.attachments[valueIndex].icon = editingItem.icon;      

      editingItem.name = tmpValue.name;
      editingItem.id = tmpValue.id;
      editingItem.icon = tmpValue.icon;      
      editingItem.image = tmpValue.image;      
      
      this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);    
      this.setEditionButtonsState();      
    }
  }

  handleAttachmentRemove(id: number) {
    const valueIndex = this.variable.attachments.findIndex((v: Attachment) => v.index === id);
    this.variable.attachments.splice(valueIndex, 1);
    let index = 0;
    this.variable.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);
    this.setAttachmentLabel();
    this.setEditionButtonsState();
  }

  messageMaxAttchment() {
    this.addAttachmentButtonClick = true;    
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`Máximo de adjuntos alcanzado`,  
        topIcon: 'warn-fill',
        defaultButtons: dialogByDefaultButton.ACCEPT,
        buttons: [],
        body: {
          message: $localize`Se ha alcanzado el límite de adjuntos para variables ${this.settingsData?.attachments?.variables ?? 10}.`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {
      this.addAttachmentButtonClick = false;
    });    
  }

  onAttachmentFileSelected(event: any) {
    this.addAttachmentButtonClick = true;    
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/variables`)
    .set('processId', this.variable.id)
    .set('process', originProcess.CATALOGS_VARIABLES_ATTACHMENTS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        const message = $localize`El adjunto ha sido subido satisfactoriamente<br>`;
        this._sharedService.showSnackMessage({
          message,
          duration: 3000,
          snackClass: 'snack-primary',
          icon: 'check',
        });
        this.variable.attachments.push({
          index: this.variable.attachments.length,
          name: res.fileName, 
          id: res.fileGuid, 
          image: `${environment.serverUrl}/files/${res.filePath}`, 
          icon: this._catalogsService.setIconName(res.fileType), 
        })
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);    
        this.setEditionButtonsState();
        this.setAttachmentLabel();
        this.addAttachmentButtonClick = false;
      }      
    });    
  }

  handleRemoveAllAttachments() {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`Eliminar todos los adjuntos`,  
        topIcon: 'garbage-can',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción quitará todos los adjuntoas del registro.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.variable.attachments = [];
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);    
        this.setEditionButtonsState();
        this.setAttachmentLabel();
      }
    });       
  }
    

  setAttachmentLabel() {
    if (this.variable.attachments.length === 0) {
      this.variableAttachmentLabel = $localize`Este registro no tiene adjuntos...`;
    } else {
      this.variableAttachmentLabel = $localize`Este registro tiene ${this.variable.attachments.length} adjunto(s)...`;
    }
  }

  handleAttachmentDownload(id: number) {

    // let a = document.createElement("a")
    // a.download = this.variable.attachments[id].name;
    // a.href = this.variable.attachments[id].image;
    // a.click();
    // a.remove();

   
    
    
    const downloadUrl = `${environment.apiDownloadUrl}`;
    const params = new HttpParams()
    .set('fileName', this.variable.attachments[id].image.replace(`${environment.serverUrl}/files/`, ''))
    this.downloadFiles = this._http.get(downloadUrl, { params, responseType: 'blob' }).subscribe((res: any) => {
      if (res) {
        let url = window.URL.createObjectURL(res);
        let link = document.createElement("a"); 
        link.download = this.variable.attachments[id].name;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();    
      }      
    });
  }

  duplicateAttachments() {
    if (this.variable.attachments.length === 0) return

    const files = this.variable.attachments.map((a) => a.id);
    this.duplicateAttachmentsList$ = this._catalogsService.duplicateAttachmentsList$(originProcess.CATALOGS_VARIABLES_ATTACHMENTS, files)
    .pipe(
      tap((newAttachments) => {
        if (newAttachments.data.duplicateAttachments.length !== this.variable.attachments) {
          const message = $localize`No se pudieron duplicar todos los adjuntos...`;
          this._sharedService.showSnackMessage({
            message,
            snackClass: 'snack-warn',
            progressBarColor: 'warn',
            icon: 'delete',
          });
        }
        let line = 0;
        this.variable.attachments = newAttachments.data.duplicateAttachments.sort((a, b) => a.index - b.index).map(na => {
          return {
            index: line++,
            name: na.fileName, 
            image: `${environment.serverUrl}/files/${na.path}`, 
            id: na.fileId, 
            icon: this._catalogsService.setIconName(na.fileType), 
          }
        });
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.variable.attachments);
        this.setAttachmentLabel();
      })

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
  
  get HarcodedVariableValueType() {
    return HarcodedVariableValueType; 
  }

  get RecordStatus() {
    return RecordStatus; 
  }
  
// End ======================
}
