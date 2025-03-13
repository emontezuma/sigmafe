import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, CapitalizationMethod, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, originProcess, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, MoldDetail, MoldItem, emptyMoldItem, GeneralHardcodedValuesData, emptyGeneralHardcodedValuesData, GeneralCatalogParams, SimpleTable, GeneralMultipleSelcetionItems, HarcodedChecklistPlanGenerationMode } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip, startWith, tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import { MaintenanceHistoricalData, MaintenanceHistoricalDataItem, MoldControlStates, MoldThresoldTypes, emptyMaintenanceHistoricalData } from '../../models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomValidators } from '../../custom-validators';
import { MaintenanceHistoryDialogComponent, GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesItem } from '../../models/catalogs-shared.models';

@Component({
  selector: 'app-catalog-mold-control-edition',
  templateUrl: './catalog-mold-control-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-mold-control-edition.component.scss']
})

export class CatalogMoldControlEditionComponent {
  @ViewChild('moldCatalogEdition') private moldCatalogEdition: ElementRef;
  @ViewChild('startingDate') private startingDate: ElementRef; 
  @ViewChild('manufacturingDate') private manufacturingDate: ElementRef;   
  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;

  // Variables ===============
  mold: MoldDetail = emptyMoldItem;
  scroll$: Observable<any>;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>;   

  providers$: Observable<any>; 
  manufacturers$: Observable<any>; 
  moldTypes$: Observable<any>;
  moldClasses$: Observable<any>;
  checklistTemplatesYellow$: Observable<any>;
  checklistTemplatesRed$: Observable<any>;
  moldThresholdTypes$: Observable<any>;
  labelColors$: Observable<any>;
  states$: Observable<any>;
  partNumbers$: Observable<any>;
  lines$: Observable<any>;
  equipments$: Observable<any>;
  maintenances$: Observable<any>;
  moldThresholdTypeChanges$: Observable<any>;
  duplicateMainImage$: Observable<any>; 
  generationModes$: Observable<any>;
  entities$: Observable<any>;    
  // moldFormChanges$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>; 
  notifyRedChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData;    
  notifyYellowChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData;    
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  mold$: Observable<MoldDetail>;
  translations$: Observable<any>;
  moldDataLoading$: Observable<boolean>;
  updateMold$: Observable<any>;
  updateMoldCatalog$: Observable<any>;
  updateMoldTranslations$: Observable<any>;  
  deleteCatalogDetails$: Observable<any>;  
  addOrUpdateCatalogDetails$: Observable<any>;  
  deleteMoldMaintenanceHistory$: Observable<any>;  
  addMoldTranslations$: Observable<any>;  
  macros$: Observable<any>;    
  notificationChannels$: Observable<any>;
  recipients$: Observable<any>;
  genYesNoValues$: Observable<any>;
  
  moldFormChangesSubscription: Subscription;
  
  providers: GeneralCatalogData = emptyGeneralCatalogData; 
  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  recipients: GeneralCatalogData = emptyGeneralCatalogData;manufacturers: GeneralCatalogData = emptyGeneralCatalogData; 
  moldTypes: GeneralCatalogData = emptyGeneralCatalogData; 
  moldClasses: GeneralCatalogData = emptyGeneralCatalogData; 
  moldThresholdTypes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  labelColors: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  states: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  partNumbers: GeneralCatalogData = emptyGeneralCatalogData; 
  lines: GeneralCatalogData = emptyGeneralCatalogData; 
  equipments: GeneralCatalogData = emptyGeneralCatalogData; 
  maintenances: MaintenanceHistoricalData = emptyMaintenanceHistoricalData; 
  checklistTemplatesYellow: GeneralCatalogData = emptyGeneralCatalogData; 
  checklistTemplatesRed: GeneralCatalogData = emptyGeneralCatalogData; 
  macros: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  generationModes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  entities: GeneralCatalogData = emptyGeneralCatalogData; 

  notifyRedChannelsSelected: number = 0;
  notifyYellowChannelsSelected: number = 0;
  
  uploadFiles: Subscription;
  
  catalogIcon: string = 'treasure_chest';
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  harcodedValuesOrderById: any = JSON.parse(`{ "id": "${'ASC'}" }`);
  orderMaintenance: any = JSON.parse(`{ "data": { "id": "${'DESC'}" } }`);
  macrosValuesOrder: any = JSON.parse(`{ "id": "${'ASC'}" }`);
  storedTranslations: [] = [];
  translationChanged: boolean = false;
  pendingRecord: boolean = false;
  imageChanged: boolean = false;
  submitControlled: boolean = false;
  loadingMaintenance: boolean = false;
  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  moldData: MoldItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';
  entityTable: string = '';
  showMacros: boolean = false;
  multipleSearchEntityDefaultValue: string = '';  

  moldForm = new FormGroup({
    description: new FormControl(
      '', 
      Validators.required,      
    ),
    serialNumber: new FormControl(
      ''
    ),
    startingDate: new FormControl(''),
    provider: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    manufacturer: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    notes: new FormControl(''),
    moldType: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    moldClass: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    manufacturingDate: new FormControl(''),
    thresholdType: new FormControl(emptyGeneralHardcodedValuesItem),
    timeZone: new FormControl(new Date().getTimezoneOffset() * 60),
    thresholdState: new FormControl(''),
    thresholdYellow: new FormControl(''),
    thresholdRed: new FormControl(''),
    thresholdDateYellow: new FormControl(''),
    thresholdDateRed: new FormControl(''),
    partNumber: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    position: new FormControl(''),
    label: new FormControl(emptyGeneralHardcodedValuesItem),
    state: new FormControl(emptyGeneralHardcodedValuesItem),
    mainImageName: new FormControl(''),    
    line: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    equipment: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    reference: new FormControl(''),    
    templatesYellow: new FormControl(''),
    templatesRed: new FormControl(''),
    notifyRedRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    notifyYellowRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    notifyYellowState: new FormControl(emptyGeneralHardcodedValuesItem),
    notifyRedState: new FormControl(emptyGeneralHardcodedValuesItem),
    notifyRedSubject:  new FormControl(''),    
    notifyRedBody:  new FormControl(''),
    notifyYellowSubject:  new FormControl(''),    
    notifyYellowBody:  new FormControl(''),
    generationMode: new FormControl(emptyGeneralHardcodedValuesItem),
    entities: new FormControl('y'),
    
  });

  maintenanceHistoricalTableColumns: string[] = ['item', 'provider', 'operator', 'friendlyState', 'notes', 'range', 'actions'];
  maintenanceHistorical = new MatTableDataSource<MaintenanceHistoricalDataItem>([]);
  pageInfo: PageInfo = {
    currentPage: 0,
    totalRecords:  0,
    totalPages: 0,
    inactiveRecords: 0,
    activeRecords: 0,
  }
  addHistoricalButtonClick: boolean = false;  
  removeHistoricalButtonClick: boolean = false;
  historicalItemsLabel: string = '';

  // Temporal
  tmpDate: number = 112;
  emptyMaintenance = {
    friendlyState: null,
    data: {
      id: null,
      provider: {
        translatedName: null,
      },
      startDate: null,
      finishedDate: null,
      notes: null,
      operatorName: null,      
    },
  } 

  checklistTemplatesOptions: SimpleTable[] = [
    { id: '', description: $localize`No usar Templates de checklist` },  
    { id: 'y', description: $localize`TODOS los Templates de checklist activos` },  
    { id: 'n', description: $localize`Los Templates de checklist de la lista` },  
    { id: 's', description: $localize`Seleccionar TODOS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  entitiesOptions: SimpleTable[] = [
    { id: '', description: $localize`No usar entidades para ningún Plan` },  
    { id: 'y', description: $localize`TODOS las entidades activas` },  
    { id: 'n', description: $localize`Las entidades de lista` },  
    { id: 's', description: $localize`Seleccionar TODOS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  
  checklistYellowTemplatesCurrentSelection: GeneralMultipleSelcetionItems[] = [];
  checklistRedTemplatesCurrentSelection: GeneralMultipleSelcetionItems[] = [];
  entitiesCurrentSelection: GeneralMultipleSelcetionItems[] = [];  
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
    // this.moldForm.get('name').disable();
    this.pageAnimationFinished();
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.MOLDS_CATALOG_EDITION,
      true,
    );
    this.showGoTop$ = this._sharedService.showGoTop.pipe(
      tap((goTop) => {
        if (goTop.status === 'temp') {
          this.onTopStatus = 'active';
          this.moldCatalogEdition.nativeElement.scrollIntoView({            
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
        this.requestChecklistTemplatesYellowData(currentPage);
        this.requestChecklistTemplatesRedData(currentPage);
        this.requestMoldThresholdTypesData(currentPage);
        this.requestLabelColorsData(currentPage);
        this.requestStatesData(currentPage);
        this.requestMacrosData(currentPage);
        this.requestNotifyChannelsData(currentPage);   
        this.requestGenYesNoValuesData(currentPage);
        this.requestGenerationModesValuesData(currentPage);   
        this.requestChecklistEntitiesData(currentPage);                  
      })
    );   
    
    this.moldFormChangesSubscription = this.moldForm.valueChanges
    .subscribe((moldFormChanges: any) => {
      if (this.loaded) {
        this.setEditionButtonsState();
      } else {
        return;
      }
      if (moldFormChanges.thresholdType === GeneralValues.N_A) {
        if (this.moldForm.get('thresholdYellow').enabled) this.moldForm.get('thresholdYellow').disable({ emitEvent: false });
        if (this.moldForm.get('thresholdRed').enabled) this.moldForm.get('thresholdRed').disable({ emitEvent: false });
        if (this.moldForm.get('thresholdDateYellow').enabled) this.moldForm.get('thresholdDateYellow').disable({ emitEvent: false });
        if (this.moldForm.get('thresholdDateRed').enabled) this.moldForm.get('thresholdDateRed').disable({ emitEvent: false });
        if (this.moldForm.get('templatesYellow').enabled) this.moldForm.get('templatesYellow').disable({ emitEvent: false });        
        if (this.moldForm.get('templatesRed').enabled) this.moldForm.get('templatesRed').disable({ emitEvent: false });        
        if (this.moldForm.get('notifyRedState').enabled) this.moldForm.get('notifyRedState').disable({ emitEvent: false });                
        if (this.moldForm.get('notifyYellowState').enabled) this.moldForm.get('notifyYellowState').disable({ emitEvent: false });   
        if (this.moldForm.get('notifyYellowBody').enabled) this.moldForm.get('notifyYellowBody').disable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedBody').enabled) this.moldForm.get('notifyRedBody').disable({ emitEvent: false });  
        if (this.moldForm.get('notifyYellowBody').enabled) this.moldForm.get('notifyYellowBody').disable({ emitEvent: false });   
        if (this.moldForm.get('notifyYellowSubject').enabled) this.moldForm.get('notifyYellowSubject').disable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedSubject').enabled) this.moldForm.get('notifyRedSubject').disable({ emitEvent: false });  
        if (this.moldForm.get('notifyYellowRecipient').enabled) this.moldForm.get('notifyYellowRecipient').disable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedRecipient').enabled) this.moldForm.get('notifyRedRecipient').disable({ emitEvent: false });   
        
      } else if (moldFormChanges.thresholdType === MoldThresoldTypes.HITS) {
        if (this.moldForm.get('thresholdYellow').disabled) this.moldForm.get('thresholdYellow').enable({ emitEvent: false });
        if (this.moldForm.get('thresholdRed').disabled) this.moldForm.get('thresholdRed').enable({ emitEvent: false });
        if (this.moldForm.get('thresholdDateYellow').enabled) this.moldForm.get('thresholdDateYellow').disable({ emitEvent: false });
        if (this.moldForm.get('thresholdDateRed').enabled) this.moldForm.get('thresholdDateRed').disable({ emitEvent: false });
        if (this.moldForm.get('templatesYellow').disabled) this.moldForm.get('templatesYellow').enable({ emitEvent: false });
        if (this.moldForm.get('templatesRed').disabled) this.moldForm.get('templatesRed').enable({ emitEvent: false });
        if (this.moldForm.get('notifyRedState').disabled) this.moldForm.get('notifyRedState').enable({ emitEvent: false });                
        if (this.moldForm.get('notifyYellowState').disabled) this.moldForm.get('notifyYellowState').enable({ emitEvent: false });                 
        if (this.moldForm.get('notifyYellowBody').disabled) this.moldForm.get('notifyYellowBody').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedBody').disabled) this.moldForm.get('notifyRedBody').enable({ emitEvent: false });    
        if (this.moldForm.get('notifyYellowSubject').disabled) this.moldForm.get('notifyYellowSubject').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedSubject').disabled) this.moldForm.get('notifyRedSubject').enable({ emitEvent: false });  
        if (this.moldForm.get('notifyYellowRecipient').disabled) this.moldForm.get('notifyYellowRecipient').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedRecipient').disabled) this.moldForm.get('notifyRedRecipient').enable({ emitEvent: false });          

      } else if (moldFormChanges.thresholdType === MoldThresoldTypes.DAYS) {
        if (this.moldForm.get('thresholdYellow').enabled) this.moldForm.get('thresholdYellow').disable({ emitEvent: false });
        if (this.moldForm.get('thresholdRed').enabled) this.moldForm.get('thresholdRed').disable({ emitEvent: false });
        if (this.moldForm.get('thresholdDateYellow').disabled) this.moldForm.get('thresholdDateYellow').enable({ emitEvent: false });
        if (this.moldForm.get('thresholdDateRed').disabled) this.moldForm.get('thresholdDateRed').enable({ emitEvent: false });
        if (this.moldForm.get('templatesYellow').disabled) this.moldForm.get('templatesYellow').enable({ emitEvent: false });
        if (this.moldForm.get('templatesRed').disabled) this.moldForm.get('templatesRed').enable({ emitEvent: false });
        if (this.moldForm.get('notifyRedState').disabled) this.moldForm.get('notifyRedState').enable({ emitEvent: false });                
        if (this.moldForm.get('notifyYellowState').disabled) this.moldForm.get('notifyYellowState').enable({ emitEvent: false });    
        if (this.moldForm.get('notifyYellowBody').disabled) this.moldForm.get('notifyYellowBody').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedBody').disabled) this.moldForm.get('notifyRedBody').enable({ emitEvent: false });     
        if (this.moldForm.get('notifyYellowSubject').disabled) this.moldForm.get('notifyYellowSubject').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedSubject').disabled) this.moldForm.get('notifyRedSubject').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyYellowRecipient').disabled) this.moldForm.get('notifyYellowRecipient').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedRecipient').disabled) this.moldForm.get('notifyRedRecipient').enable({ emitEvent: false });                      

      } else if (moldFormChanges.thresholdType === MoldThresoldTypes.BOTH) {
        if (this.moldForm.get('thresholdYellow').disabled) this.moldForm.get('thresholdYellow').enable({ emitEvent: false });
        if (this.moldForm.get('thresholdRed').disabled) this.moldForm.get('thresholdRed').enable({ emitEvent: false });
        if (this.moldForm.get('thresholdDateYellow').disabled) this.moldForm.get('thresholdDateYellow').enable({ emitEvent: false });
        if (this.moldForm.get('thresholdDateRed').disabled) this.moldForm.get('thresholdDateRed').enable({ emitEvent: false });
        if (this.moldForm.get('templatesYellow').disabled) this.moldForm.get('templatesYellow').enable({ emitEvent: false });
        if (this.moldForm.get('templatesRed').disabled) this.moldForm.get('templatesRed').enable({ emitEvent: false }); 
        if (this.moldForm.get('notifyRedState').disabled) this.moldForm.get('notifyRedState').enable({ emitEvent: false });                
        if (this.moldForm.get('notifyYellowState').disabled) this.moldForm.get('notifyYellowState').enable({ emitEvent: false });     
        if (this.moldForm.get('notifyYellowBody').disabled) this.moldForm.get('notifyYellowBody').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedBody').disabled) this.moldForm.get('notifyRedBody').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyYellowSubject').disabled) this.moldForm.get('notifyYellowSubject').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedSubject').disabled) this.moldForm.get('notifyRedSubject').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyYellowRecipient').disabled) this.moldForm.get('notifyYellowRecipient').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedRecipient').disabled) this.moldForm.get('notifyRedRecipient').enable({ emitEvent: false });                        

      }
      if (moldFormChanges.thresholdYellow && moldFormChanges.thresholdRed && (+moldFormChanges.thresholdYellow >= +moldFormChanges.thresholdRed)) {
        this.moldForm.controls.thresholdYellow.setErrors({ invalidValue: true });
      } else {
        this.moldForm.controls.thresholdYellow.setErrors(null);
      }
      if (moldFormChanges.thresholdDateYellow && moldFormChanges.thresholdDateRed && (+moldFormChanges.thresholdDateYellow >= +moldFormChanges.thresholdDateRed)) {
        this.moldForm.controls.thresholdDateYellow.setErrors({ invalidValue: true });
      } else {
        this.moldForm.controls.thresholdDateYellow.setErrors(null);
      }
      if (moldFormChanges.notifyRedState !== GeneralValues.YES) {
        if (this.moldForm.get('notifyRedBody').enabled) this.moldForm.get('notifyRedBody').disable({ emitEvent: false });  
        if (this.moldForm.get('notifyRedRecipient').enabled) this.moldForm.get('notifyRedRecipient').disable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedSubject').enabled) this.moldForm.get('notifyRedSubject').disable({ emitEvent: false });
      } else if (moldFormChanges.notifyRedState === GeneralValues.YES) {
        if (this.moldForm.get('notifyRedBody').disabled) this.moldForm.get('notifyRedBody').enable({ emitEvent: false });  
        if (this.moldForm.get('notifyRedRecipient').disabled) this.moldForm.get('notifyRedRecipient').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyRedSubject').disabled) this.moldForm.get('notifyRedSubject').enable({ emitEvent: false });
      }

      if (moldFormChanges.notifyYellowState !== GeneralValues.YES) {
        if (this.moldForm.get('notifyYellowBody').enabled) this.moldForm.get('notifyYellowBody').disable({ emitEvent: false });  
        if (this.moldForm.get('notifyYellowRecipient').enabled) this.moldForm.get('notifyYellowRecipient').disable({ emitEvent: false });   
        if (this.moldForm.get('notifyYellowSubject').enabled) this.moldForm.get('notifyYellowSubject').disable({ emitEvent: false });
      } else if (moldFormChanges.notifyYellowState === GeneralValues.YES) {
        if (this.moldForm.get('notifyYellowBody').disabled) this.moldForm.get('notifyYellowBody').enable({ emitEvent: false });  
        if (this.moldForm.get('notifyYellowRecipient').disabled) this.moldForm.get('notifyYellowRecipient').enable({ emitEvent: false });   
        if (this.moldForm.get('notifyYellowSubject').disabled) this.moldForm.get('notifyYellowSubject').enable({ emitEvent: false });
      }        
    });    
    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.MOLDS_CATALOG_EDITION,
          !animationFinished,
        );         
      }
    ));
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.MOLDS_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestMoldData(+params['id']);
        }
      })
    );    
    this.calcElements();        
    this.moldForm.controls.label.setValue(GeneralValues.N_A);
    this.moldForm.controls.thresholdType.setValue(GeneralValues.N_A);
    this.moldForm.controls.state.setValue(GeneralValues.N_A);
    setTimeout(() => {
      this.focusThisField = 'description';
      if (!this.mold.id) {
        this.loaded = true;
      }
    }, 200);    
    // this.moldForm.reset(this.mold);
  }

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.MOLDS_CATALOG,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_CATALOG,
      false,
    );
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.moldFormChangesSubscription) this.moldFormChangesSubscription.unsubscribe();        
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

  requestGenerationModesValuesData(currentPage: number) {
    this.generationModes = {
      ...this.generationModes,
      currentPage,
      loading: true,
    }        
    this.generationModes$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrderById, SystemTables.CHECKLIST_PLANS_GENERATION_MODES)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.generationModes.items?.concat(data?.data?.hardcodedValues?.items);
        this.generationModes = {
          ...this.generationModes,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  requestChecklistEntitiesData(currentPage: number, filterStr: string = null) {    
    this.entities = {
      ...this.entities,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.entities.items.length;

    const processId = !!this.mold.id ? this.mold.id : 0;
    const moldParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.CHECKLIST_PLANS_TEMPLATES,
      processId, 
      takeRecords: this.takeRecords, 
      filter,   
    }    
    let entityObservable: Observable<any> = null;
    const variables = this._sharedService.setGraphqlGen(moldParameters);
    if (!this.entityTable) {
      this.entityTable = SystemTables.DEPARTMENTS;
      this.moldForm.controls.entities.setValue(HarcodedChecklistPlanGenerationMode.BY_DEPARTMENT);     
    }
    if (this.entityTable === SystemTables.DEPARTMENTS) {
      entityObservable = this._catalogsService.getDepartmentsLazyLoadingDataGql$(variables)
    } else if (this.entityTable === SystemTables.WORKGROUPS) {
      entityObservable = this._catalogsService.getWorkgroupsLazyLoadingDataGql$(variables)
    } else if (this.entityTable === SystemTables.POSITIONS) {
      entityObservable = this._catalogsService.getPositionsLazyLoadingDataGql$(variables)
    } else if (this.entityTable === SystemTables.USERS) {
      entityObservable = this._catalogsService.getUsersLazyLoadingDataGql$(variables)
    }
    this.entities$ = entityObservable
    .pipe(
      tap((data: any) => {
        const customData = data?.data;
        const graphqlDataObjectName = Object.keys(customData)[0];
        const { items } = customData[graphqlDataObjectName];
        const mappedItems = items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName ?? item.name,
            translatedReference: item.translatedReference,
            id: item.id,
            valueRight: item.value,
            catalogDetailId: item.catalogDetailId,
          }
        })
        this.entities = {
          ...this.entities,
          loading: false,
          pageInfo: customData[graphqlDataObjectName]?.pageInfo,
          items: this.entities.items?.concat(mappedItems),
          totalCount: customData[graphqlDataObjectName]?.totalCount,
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

  requestNotifyChannelsData(currentPage: number) {
    this.notifyYellowChannels = {
      ...this.notifyYellowChannels,
      currentPage,
      loading: true,
    }        
    this.notifyRedChannels = {
      ...this.notifyRedChannels,
      currentPage,
      loading: true,
    }            
    this.notificationChannels$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.CHANNELS)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.notifyYellowChannels.items?.concat(data?.data?.hardcodedValues?.items);
        this.notifyYellowChannels = {
          ...this.notifyYellowChannels,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems.map((i) => {
            return {
              ...i,
              selected: false,
            }
          }),
          totalCount: data?.data?.hardcodedValues?.totalCount,
        }
        this.notifyRedChannels = {
          ...this.notifyRedChannels,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems.map((i) => {
            return {
              ...i,
              selected: false,
            }
          }),
          totalCount: data?.data?.hardcodedValues?.totalCount,
        }
        if (this.pendingRecord) {
          this.updateMultiSelections();
          this.pendingRecord = false;
        } 
      }),
      catchError(() => EMPTY)
    )
  }

  requestMoldTypessData(currentPage: number, filterStr: string = null) {
    this.moldTypes = {
      ...this.moldTypes,
      currentPage,
      loading: true,
    } 
    const skipRecords = this.moldTypes.items.length;
    this.moldTypes$ = this.requestGenericsData$(currentPage, skipRecords, SystemTables.MOLD_TYPES, filterStr)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.genericsPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.moldTypes = {
          ...this.moldTypes,
          loading: false,
          pageInfo: data?.data?.genericsPaginated?.pageInfo,
          items: this.moldTypes.items?.concat(mappedItems),
          totalCount: data?.data?.genericsPaginated?.totalCount,
        }
      }),      
      catchError(() => EMPTY)
    )
  }

  requestMoldClassesData(currentPage: number, filterStr: string = null) {
    this.moldClasses = {
      ...this.moldClasses,
      currentPage,
      loading: true,
    }    
    const skipRecords = this.moldClasses.items.length;
    this.moldClasses$ = this.requestGenericsData$(currentPage, skipRecords, SystemTables.MOLD_CLASSES, filterStr)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.genericsPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.moldClasses = {
          ...this.moldClasses,
          loading: false,
          pageInfo: data?.data?.genericsPaginated?.pageInfo,
          items: this.moldClasses.items?.concat(mappedItems),
          totalCount: data?.data?.genericsPaginated?.totalCount,
        }
      }),      
      catchError(() => EMPTY)
    )
  }

  requestMoldThresholdTypesData(currentPage: number) {
    this.moldThresholdTypes = {
      ...this.moldThresholdTypes,
      currentPage,
      loading: true,
    }        
    this.moldThresholdTypes$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.MOLD_CONTROL_STRATEGIES)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.moldThresholdTypes.items?.concat(data?.data?.hardcodedValues?.items);        
        this.moldThresholdTypes = {
          ...this.moldThresholdTypes,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  requestLabelColorsData(currentPage: number) {
    this.labelColors = {
      ...this.labelColors,
      currentPage,
      loading: true,
    }        
    this.labelColors$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.MOLD_LABEL_COLORS)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.labelColors.items?.concat(data?.data?.hardcodedValues?.items);        
        this.labelColors = {
          ...this.labelColors,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  requestStatesData(currentPage: number) {
    this.states = {
      ...this.states,
      currentPage,
      loading: true,
    }        
    this.states$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.MOLD_STATES)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.states.items?.concat(data?.data?.hardcodedValues?.items);        
        this.states = {
          ...this.states,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.MOLDS_CATALOG_EDITION,
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
    if (action.from === ApplicationModules.MOLDS_CATALOG_EDITION && this.elements.length > 0) {
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
          this._location.replaceState('/catalogs/molds/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;          
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;        
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/molds-control');    
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this.duplicateMainImage();
        this._location.replaceState('/catalogs/molds/create');        
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
        }, 750);        
      } else if (action.action === ButtonActions.MACROS) { 
        this.showMacros = !this.showMacros;
        this.elements.find(e => e.action === action.action).class = this.showMacros ? 'accent' : '';
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
        if (!this.mold.id || this.mold.id === null || this.mold.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestMoldData(this.mold.id);
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
        if (this.mold?.id > 0 && this.mold.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR MOLDE`,  
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
                message: $localize`Esta acción inactivará el molde con el Id <strong>${this.mold.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const moldParameters = {
                settingType: 'status',
                id: this.mold.id,
                customerId: this.mold.customerId,
                status: RecordStatus.INACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(moldParameters);
              this.updateMold$ = this._catalogsService.updateMoldStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateMold.length > 0 && data?.data?.createOrUpdateMold[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE);
                      this.mold.status = RecordStatus.INACTIVE;              
                      const message = $localize`El Molde ha sido inhabilitado`;
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
        } else if (this.mold?.id > 0 && this.mold.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR MOLDE`,  
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
                message: $localize`Esta acción reactivará el molde con el Id <strong>${this.mold.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
              const moldParameters = {
                settingType: 'status',
                id: this.mold.id,
                customerId: this.mold.customerId,
                status: RecordStatus.ACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(moldParameters);
              this.updateMold$ = this._catalogsService.updateMoldStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateMold.length > 0 && data?.data?.createOrUpdateMold[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE);
                      this.mold.status = RecordStatus.ACTIVE;              
                      const message = $localize`El Molde ha sido reactivado`;
                      this.mold.status = RecordStatus.ACTIVE;
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
      }
    }
  }

  calcElements() {
    this.elements = [{
      type: 'button',
      caption: $localize`Regresar...`,
      tooltip:  $localize`Regresar a la lista de moldes`,
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
      caption: $localize`Macros`,
      tooltip: $localize`Macros disponibles...`,
      class: '',
      icon: 'transcode',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
      visible: true,
      action: ButtonActions.MACROS,      
    },];
  }

  getScrolling(data: CdkScrollable) {       
    if (data.getElementRef().nativeElement.tagName === 'DIV') {
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
    
  }

  onSubmit() {
    if (!this.submitControlled) return;
    this.submitControlled = false;
    this.validateTables();
    this.moldForm.markAllAsTouched();        
    this.moldForm.updateValueAndValidity();    
    if (this.moldForm.valid) {      
      this.saveRecord();
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.moldForm.controls) {
        if (this.moldForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.moldForm.controls[controlName];            
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
        for (const controlName in this.moldForm.controls) {
          if (this.moldForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.moldForm.controls[controlName];            
            if (typedControl.invalid) {
              if (!fieldFocused) {
                if (controlName === 'startingDate') {
                  setTimeout(() => {
                    this.startingDate.nativeElement.focus();
                  }, 50) ;
                } else if (controlName === 'manufacturingDate') {
                  setTimeout(() => {
                    this.manufacturingDate.nativeElement.focus();
                  }, 50) ;
                } else {
                  this.focusThisField = controlName;
                }
                
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
    const newRecord = !this.mold.id || this.mold.id === null || this.mold.id === 0;
    try {
      const dataToSave = this.prepareRecordToSave(newRecord);  
      this.updateMoldCatalog$ = this._catalogsService.updateMoldCatalog$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateMold.length > 0) {
            const moldId = data?.data?.createOrUpdateMold[0].id;
            combineLatest([ 
              this.processTranslations$(moldId), 
              this.saveCatalogDetails$(moldId) 
            ])
            .subscribe(() => {
              this.requestMoldData(moldId);          
              setTimeout(() => {              
                let message = $localize`El Molde ha sido actualizado`;
                if (newRecord) {                
                  message = $localize`El Molde ha sido creado satisfactoriamente con el id <strong>${moldId}</strong>`;
                  this._location.replaceState(`/catalogs/molds/edit/${moldId}`);
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

  requestProvidersData(currentPage: number, filterStr: string = null) {    
    this.providers = {
      ...this.providers,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);      
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const skipRecords = this.providers.items.length;

    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);
    this.providers$ = this._catalogsService.getProvidersLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {
        const mappedItems = data?.data?.providersPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        });
        this.providers = {
          ...this.providers,
          loading: false,
          pageInfo: data?.data?.providersPaginated?.pageInfo,
          items: this.providers.items?.concat(mappedItems),
          totalCount: data?.data?.providersPaginated?.totalCount,
        }        
      }),
      catchError(() => EMPTY)
    )    
  }

  requestManufacturersData(currentPage: number, filterStr: string = null) {    
    this.manufacturers = {
      ...this.manufacturers,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }
    const skipRecords = this.manufacturers.items.length;

    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);    
    this.manufacturers$ = this._catalogsService.getManufacturersLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.manufacturersPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.manufacturers = {
          ...this.manufacturers,
          loading: false,
          pageInfo: data?.data?.manufacturersPaginated?.pageInfo,
          items: this.manufacturers.items?.concat(mappedItems),
          totalCount: data?.data?.manufacturersPaginated?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestChecklistTemplatesYellowData(currentPage: number, filterStr: string = null) {    
    this.checklistTemplatesYellow = {
      ...this.checklistTemplatesYellow,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.checklistTemplatesYellow.items.length;

    const processId = !!this.mold.id ? this.mold.id : 0;
    const moldParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.CHECKLIST_TEMPLATES_YELLOW,
      processId, 
      takeRecords: this.takeRecords, 
      filter,       
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);    
    this.checklistTemplatesYellow$ = this._catalogsService.getChecklistTemplatesYellowLazyLoadingDataGql$(variables)
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
        this.checklistTemplatesYellow = {
          ...this.checklistTemplatesYellow,
          loading: false,
          pageInfo: data?.data?.catalogDetailChecklistTemplate?.pageInfo,
          items: this.checklistTemplatesYellow.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailChecklistTemplate?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestChecklistTemplatesRedData(currentPage: number, filterStr: string = null) {    
    this.checklistTemplatesRed = {
      ...this.checklistTemplatesRed,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.checklistTemplatesRed.items.length;

    const processId = !!this.mold.id ? this.mold.id : 0;
    const moldParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.CHECKLIST_TEMPLATES_RED,
      processId, 
      takeRecords: this.takeRecords, 
      filter,       
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);    
    this.checklistTemplatesRed$ = this._catalogsService.getChecklistTemplatesRedLazyLoadingDataGql$(variables)
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
        this.checklistTemplatesRed = {
          ...this.checklistTemplatesRed,
          loading: false,
          pageInfo: data?.data?.catalogDetailChecklistTemplate?.pageInfo,
          items: this.checklistTemplatesRed.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailChecklistTemplate?.totalCount,
        }
      }),
      catchError(() => EMPTY)
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
      filter = JSON.parse(` { "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "or": [ { "translatedName": { "contains": "${filterStr}" } }, { "translatedReference": { "contains": "${filterStr}" } } ] } ] }`);      
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }
    const skipRecords = this.partNumbers.items.length;
    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);     
    this.partNumbers$ = this._catalogsService.getPartNumbersLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.partNumbersPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.partNumbers = {
          ...this.partNumbers,
          loading: false,
          pageInfo: data?.data?.partNumbersPaginated?.pageInfo,
          items: this.partNumbers.items?.concat(mappedItems),
          totalCount: data?.data?.partNumbersPaginated?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestLinesData(currentPage: number, filterStr: string = null) {    
    this.lines = {
      ...this.lines,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      const esteValor = `{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`;
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const skipRecords = this.lines.items.length;
    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);     
    this.lines$ = this._catalogsService.getLinesLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.linesPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.lines = {
          ...this.lines,
          loading: false,
          pageInfo: data?.data?.linesPaginated?.pageInfo,
          items: this.lines.items?.concat(mappedItems),
          totalCount: data?.data?.linesPaginated?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestEquipmentsData(currentPage: number, filterStr: string = null) {    
    this.equipments = {
      ...this.equipments,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const skipRecords = this.equipments.items.length;    
    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters); 
    this.equipments$ = this._catalogsService.getEquipmentsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.equipmentsPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.equipments = {
          ...this.equipments,
          loading: false,
          pageInfo: data?.data?.equipmentsPaginated?.pageInfo,
          items: this.equipments.items?.concat(mappedItems),
          totalCount: data?.data?.equipmentsPaginated?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  requestMaintenancesData(currentPage: number, filterStr: string = null) {    
    this.loadingMaintenance = true;
    this.maintenances = {
      items: new Array(12).fill(this.emptyMaintenance),
    }
    this.maintenanceHistorical = new MatTableDataSource<MaintenanceHistoricalDataItem>(this.maintenances.items);
    this.maintenances = {
      ...this.maintenances,
      currentPage,
      loading: true,
    }   
    filterStr = this.mold?.id?.toString(); 
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "moldId": { "eq": ${filterStr} } } }, { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } } ] }`);
    }      
    const skipRecords = 0;
    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.orderMaintenance
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);         
    this.maintenances$ = this._catalogsService.getMaintenancesLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.maintenanceHistoricalsPaginated?.items.map((h) => {
          return {
            ...h.data,
            provider: {
              ...h.data.provider,
              name: h.data.provider.translations?.length > 0 ? h.data.provider.translations[0].name : h.data.provider.name,
              isTranslated: h.data.provider.translations.length > 0 && h.data.provider.translations[0].languageId > 0 ? true : false,
            },
            isTranslated: h.isTranslated,
            friendlyState: h.friendlyState,
          }
        })
        
        this.maintenances = {
          ...this.maintenances,
          loading: false,
          pageInfo: data?.data?.maintenanceHistorical?.pageInfo,          
          items: mappedItems,
          totalCount: data?.data?.maintenanceHistorical?.totalCount,  
        }
        this.historicalItemsLabel = $localize`Hay ${this.maintenances.items?.length} registro(s)`;
        this.maintenanceHistorical = new MatTableDataSource<MaintenanceHistoricalDataItem>(mappedItems);
        this.maintenanceHistorical.paginator = this.paginator;
        setTimeout(() => {
          this.loadingMaintenance = false;
        }, 200)
      }),
      catchError(() => EMPTY)
    )    
  }

  requestMoldData(moldId: number): void { 
    let variables = undefined;
    variables = { moldId };

    // this.requestMaintenancesData(currentPage);

    const skipRecords = 0;
    const filter = JSON.parse(`{ "moldId": { "eq": ${moldId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    // let getData: boolean = false;
    this.setViewLoading(true);
    this.maintenances.items = [];
    this.mold$ = this._catalogsService.getMoldDataGql$({ 
      moldId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
    }).pipe(
      map(([ moldGqlData, moldGqlTranslationsData ]) => {
        // if (!getData) {
        //   getData = true;
        // } else {
        //   return null
        // }
        return this._catalogsService.mapOneMold({
          moldGqlData,  
          moldGqlTranslationsData,
        })
      }),
      tap((moldData: MoldDetail) => {
        if (!moldData) {
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
          this._location.replaceState('/catalogs/molds/create');
          return;
        }
        this.mold =  moldData;
        //
        this.checklistYellowTemplatesCurrentSelection = [];
        this.checklistRedTemplatesCurrentSelection = [];
        this.checklistTemplatesYellow.currentPage = 0;   
        this.checklistTemplatesYellow.items = [];
        this.checklistTemplatesRed.currentPage = 0;   
        this.checklistTemplatesRed.items = [];
        this.requestChecklistTemplatesYellowData(0);
        this.requestChecklistTemplatesRedData(0);
        //
        this.requestMaintenancesData(0);
        this.translationChanged = false;
        this.imageChanged = false;        
        this.storedTranslations = JSON.parse(JSON.stringify(this.mold.translations));
        this.pendingRecord = true;
        this.updateFormFromData();
        this.changeInactiveButton(this.mold.status);        
        this.loaded = true;
        this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        this.setViewLoading(false);
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
    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.order,
    }    
    const variables = this._sharedService.setGraphqlGen(moldParameters);   
    return this._catalogsService.getGenericsLazyLoadingDataGql$(variables).pipe();
  }

  requestMacrosData(currentPage: number) {
    this.macros = {
      ...this.macros,
      currentPage,
      loading: true,
    }        
    this.macros$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.macrosValuesOrder, SystemTables.MOLDS_CATALOGS_MACROS)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.macros.items?.concat(data?.data?.hardcodedValues?.items);        
        this.macros = {
          ...this.macros,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.hardcodedValues?.totalCount,  
        }        
      }),
      catchError(() => EMPTY)
    )
  }
  

  getMoreData(getMoreDataParams: GeneralCatalogParams) {    
    if (getMoreDataParams.catalogName === SystemTables.PROVIDERS) {
      if (getMoreDataParams.initArray) {
        this.providers.currentPage = 0;   
        this.providers.items = [];
      } else if (!this.providers.pageInfo.hasNextPage) {
        return;
      } else {
        this.providers.currentPage++;
      }
      this.requestProvidersData(        
        this.providers.currentPage,
        getMoreDataParams.textToSearch,  
      );    

    } else if (getMoreDataParams.catalogName === SystemTables.MANUFACTURERS) {
      if (getMoreDataParams.initArray) {
        this.manufacturers.currentPage = 0;   
        this.manufacturers.items = [];
      } else if (!this.manufacturers.pageInfo.hasNextPage) {
        return;
      } else {
        this.manufacturers.currentPage++;
      }
      this.requestManufacturersData(        
        this.manufacturers.currentPage,
        getMoreDataParams.textToSearch,  
      ); 

    } else if (getMoreDataParams.catalogName === SystemTables.LINES) {
      if (getMoreDataParams.initArray) {
        this.lines.currentPage = 0;   
        this.lines.items = [];
      } else if (!this.lines.pageInfo.hasNextPage) {
        return;
      } else {
        this.lines.currentPage++;
      }
      this.requestLinesData(        
        this.lines.currentPage,
        getMoreDataParams.textToSearch,  
      );   
      
    } else if (getMoreDataParams.catalogName === SystemTables.EQUIPMENTS) {
      if (getMoreDataParams.initArray) {
        this.equipments.currentPage = 0;   
        this.equipments.items = [];
      } else if (!this.equipments.pageInfo.hasNextPage) {
        return;
      } else {
        this.equipments.currentPage++;
      }
      this.requestEquipmentsData(        
        this.equipments.currentPage,
        getMoreDataParams.textToSearch,  
      );   

    } else if (getMoreDataParams.catalogName === SystemTables.PARTNUMBERS) {
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
      

    } else if (getMoreDataParams.catalogName === SystemTables.MOLD_TYPES) {
      if (getMoreDataParams.initArray) {
        this.moldTypes.currentPage = 0;   
        this.moldTypes.items = [];
      } else if (!this.moldTypes.pageInfo.hasNextPage) {
        return;
      } else {
        this.moldTypes.currentPage++;
      }
      this.requestMoldTypessData(        
        this.moldTypes.currentPage,
        getMoreDataParams.textToSearch,  
      );        
      
    } else if (getMoreDataParams.catalogName === SystemTables.MOLD_CLASSES) {
      if (getMoreDataParams.initArray) {
        this.moldClasses.currentPage = 0;   
        this.moldClasses.items = [];
      } else if (!this.moldClasses.pageInfo.hasNextPage) {
        return;
      } else {
        this.moldClasses.currentPage++;
      }
      this.requestMoldClassesData(        
        this.moldClasses.currentPage,
        getMoreDataParams.textToSearch,  
      );    
    } else if (getMoreDataParams.catalogName === SystemTables.CHECKLIST_TEMPLATES_YELLOW) {
      if (this.checklistTemplatesYellow.loading) return;
      if (getMoreDataParams.initArray) {
        this.checklistTemplatesYellow.currentPage = 0;   
        this.checklistTemplatesYellow.items = [];
      } else if (!this.checklistTemplatesYellow.pageInfo.hasNextPage) {
        return;
      } else {
        this.checklistTemplatesYellow.currentPage++;
      }
      this.requestChecklistTemplatesYellowData(        
        this.checklistTemplatesYellow.currentPage,
        getMoreDataParams.textToSearch,  
      );    
    } else if (getMoreDataParams.catalogName === SystemTables.CHECKLIST_TEMPLATES_RED) {
      if (this.checklistTemplatesRed.loading) return;
      if (getMoreDataParams.initArray) {
        this.checklistTemplatesRed.currentPage = 0;   
        this.checklistTemplatesRed.items = [];
      } else if (!this.checklistTemplatesRed.pageInfo.hasNextPage) {
        return;
      } else {
        this.checklistTemplatesRed.currentPage++;
      }
      this.requestChecklistTemplatesRedData(        
        this.checklistTemplatesRed.currentPage,
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
    } else if (getMoreDataParams.catalogName === this.entityTable) {
      if (this.entities.loading) return;
      if (getMoreDataParams.initArray) {
        this.entities.currentPage = 0;   
        this.entities.items = [];
      } else if (!this.entities.pageInfo.hasNextPage) {
        return;
      } else {
        this.entities.currentPage++;
      }
      this.requestChecklistEntitiesData(        
        this.entities.currentPage,
        getMoreDataParams.textToSearch,  
      );      
    }    
    
  }

  onFileSelected(event: any) {
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/molds`)
    .set('processId', this.mold.id)
    .set('process', originProcess.CATALOGS_MOLDS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.imageChanged = true;
        this.moldForm.controls.mainImageName.setValue(res.fileName);
        this.mold.mainImagePath = res.filePath;
        this.mold.mainImageGuid = res.fileGuid;
        this.mold.mainImage = `${environment.serverUrl}/${environment.uploadFolders.completePathToFiles}/${res.filePath}`;
        const message = $localize`El archivo ha sido subido satisfactoriamente<br>Guarde el molde para aplicar el cambio`;
        this._sharedService.showSnackMessage({
          message,
          duration: 5000,
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

  handleMultipleSelectionChanged(catalog: string){        
    this.setEditionButtonsState();
  }

  handleInputKeydown(event: KeyboardEvent) {
    console.log('[handleInputKeydown]', event)
  }

  handleAddHistoricalButtonClick(id: number) {
    if (this.mold?.id > 0) {
      let dialogTitle = $localize`Agregar un mantenimiento al molde <strong>${this.mold.id}</strong>`;
      if (id !== 0) {
        dialogTitle = $localize`Modificar un mantenimiento al molde <strong>${this.mold.id}</strong>`;
      }
      const dialogResponse = this._dialog.open(MaintenanceHistoryDialogComponent, {
        width: '460px',
        disableClose: true,
        data: {
          duration: 0,          
          title: dialogTitle,
          maintenanceUpdated: false,
          topIcon: 'allow_list2',
          moldId: this.mold.id,
          translations: this.mold.translations,
          id: id === 0 ? null : id,
          buttons: [{
            action: ButtonActions.SAVE,            
            showIcon: true,
            icon: 'save',
            showCaption: true,
            caption: $localize`Registrar`,
            showTooltip: true,
            class: 'primary',
            tooltip: $localize`Registra el mantenimiento`,
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
            action: ButtonActions.CLOSE,
            showIcon: true,
            icon: 'cross',
            showCaption: true,
            caption: $localize`Cerrar`,
            showTooltip: true,            
            tooltip: $localize`Cierra ésta ventana`,
            cancel: true,
          }],          
          showCloseButton: false,
        },
      });
      dialogResponse.afterClosed().subscribe((response) => {     
        if (response.maintenanceUpdated) {
          this.requestMaintenancesData(0);
        }
      });        
    }
  }

  handleUpdateHistoricalButtonClick() {
    this.requestMaintenancesData(0)
  }

  editMaintenance(id: number) {

  }

  removeMaintenance(id: number) {
    
  }

  getMoldStateClass() {
    return this.mold.thresholdState === MoldControlStates.RED ? 'mold-state-label-red' : this.mold.thresholdState === MoldControlStates.YELLOW ? 'mold-state-label-yellow' : 'state-null';
  }

  getMoldStateLabel() {
    return this.mold.thresholdState === MoldControlStates.RED ?    
    $localize`El Molde está <strong>ALARMADO!</strong> desde el <strong>${this._sharedService.capitalization(this._sharedService.formatDate(this.today, 'EEEE d MMM yyyy hh:mm:ss a'), CapitalizationMethod.FIRST_LETTER_PHRASE)}</strong>` :
    this.mold.thresholdState === MoldControlStates.YELLOW ? 
    $localize`El Molde está <strong>Advertido!</strong> desde el <strong>${this._sharedService.capitalization(this._sharedService.formatDate(this.today, 'EEEE d MMM yyyy hh:mm:ss a'), CapitalizationMethod.FIRST_LETTER_PHRASE)}</strong>` : '';
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
    } else if (mode === toolbarMode.EDITING_WITH_NO_DATA) {
      // if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;      
    } else if (mode === toolbarMode.INITIAL_WITH_DATA) {
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;      
    } else if (mode === toolbarMode.INITIAL_WITH_NO_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;      
    }    
  }

  updateFormFromData(): void {    
    this.moldForm.patchValue({
      description: this.mold.description,
      serialNumber: this.mold.serialNumber,      
      reference: this.mold.reference,      
      notes: this.mold.notes,      
      provider: this.mold.provider,
      manufacturer: this.mold.manufacturer,
      line: this.mold.line,
      equipment: this.mold.equipment,
      partNumber: this.mold.partNumber,
      moldClass: this.mold.moldClass,
      moldType: this.mold.moldType,
      position: this.mold.position?.toString(),
      thresholdDateRed: this.mold.thresholdDateRed?.toString(),
      thresholdDateYellow: this.mold.thresholdDateYellow?.toString(),
      thresholdRed: this.mold.thresholdRed?.toString(),
      thresholdYellow: this.mold.thresholdYellow?.toString(),      
      thresholdType: this.mold.thresholdType,      
      thresholdState: this.mold.thresholdState,
      mainImageName: this.mold.mainImageName,
      
      label: this.mold.label,      
      state: this.mold.state,
      startingDate: this.mold.startingDate,
      templatesYellow: this.mold.templatesYellow,
      templatesRed: this.mold.templatesRed,
      
      notifyYellowState: this.mold.notifyYellowState,
      notifyYellowSubject: this.mold.notifyYellowSubject,
      notifyYellowBody:  this.mold.notifyYellowBody,
      notifyYellowRecipient: this.mold.notifyYellowRecipient,
      
      notifyRedState: this.mold.notifyRedState,      
      notifyRedRecipient: this.mold.notifyRedRecipient,            
      notifyRedSubject: this.mold.notifyRedSubject,
      notifyRedBody:  this.mold.notifyRedBody,   
      generationMode: this.mold.generationMode,      
      entities: this.mold.entities,   
    });
    this.changeEntities(this.mold.generationMode);
    this.updateMultiSelections();
  } 

  handleSelectionChange(event: any) {
    if (event && event.value) {
      this.changeEntities(event.value);
    }
    
  }

  changeEntities(selection: string) {    
    this.entityTable = SystemTables.DEPARTMENTS;
    if  (selection.indexOf(HarcodedChecklistPlanGenerationMode.BY_POSITIONS) > -1) {
      this.entityTable = SystemTables.POSITIONS;
    } else if (selection.indexOf(HarcodedChecklistPlanGenerationMode.BY_WORKGROUP) > -1) {
      this.entityTable = SystemTables.WORKGROUPS;
    } else if (selection.indexOf(HarcodedChecklistPlanGenerationMode.BY_USER) > -1) {
      this.entityTable = SystemTables.USERS;
    }    
    this.entities.currentPage = 0;   
    this.entities.items = [];
    this.multipleSearchEntityDefaultValue = '';
    this.requestChecklistEntitiesData(
      this.entities.currentPage,
      '',  
    );  
  }

  updateMultiSelections() {
    if (this.notifyYellowChannels.items.length === 0) return;
    const selectedYellowChannels = this.mold.notifyYellowChannels.split(',');
    for (const item of this.notifyYellowChannels.items) {
      item.selected = selectedYellowChannels.includes(item.value);
    }

    this.notifyYellowChannelsSelected = this.notifyYellowChannels.items.filter(r => r.selected).length;

    const selectedRedChannels = this.mold.notifyRedChannels.split(',');
    for (const item of this.notifyRedChannels.items) {
      item.selected = selectedRedChannels.includes(item.value);
    }

    this.notifyRedChannelsSelected = this.notifyRedChannels.items.filter(r => r.selected).length;    
  }

  prepareRecordToSave(newRecord: boolean): any {
    this.moldForm.markAllAsTouched();
    const fc = this.moldForm.controls;
    let startingDate = null;
    let manufacturingDate = null;
    if (fc.startingDate.value) {
      if (!this._sharedService.isDateValid(this._sharedService.formatDate(fc.startingDate.value))) {
        this.moldForm.controls.startingDate.setErrors({ invalidDate: true });
      } else {
        startingDate = this._sharedService.formatDate(fc.startingDate.value, 'yyyy-MM-dd');
      }
    } else {
      startingDate = null;
    }
    if (fc.manufacturingDate.value) {
      if (!this._sharedService.isDateValid(this._sharedService.formatDate(fc.manufacturingDate.value))) {
        this.moldForm.controls.manufacturingDate.setErrors({ invalidDate: true });
      } else {
        manufacturingDate = this._sharedService.formatDate(fc.manufacturingDate.value, 'yyyy-MM-dd');
      }
    } else {
      manufacturingDate = null;
    }

    const selectedYellowChannels = this.notifyYellowChannels.items.filter((n) => n.selected).map((n) => n.value).join();
    const selectedRedChannels = this.notifyRedChannels.items.filter((n) => n.selected).map((n) => n.value).join();

    return  {
        id: this.mold.id,
        customerId: 1, // TODO: Get from profile
        ...(fc.templatesYellow.dirty || fc.templatesYellow.touched || newRecord) && { templatesYellow: fc.templatesYellow.value  },
        ...(fc.templatesRed.dirty || fc.templatesRed.touched || newRecord) && { templatesRed: fc.templatesRed.value  },
        
        ...(fc.notifyYellowRecipient.dirty || fc.notifyYellowRecipient.touched || newRecord) && { notifyYellowRecipientId: fc.notifyYellowRecipient.value ? fc.notifyYellowRecipient.value.id : null },
        ...(fc.notifyRedRecipient.dirty || fc.notifyRedRecipient.touched || newRecord) && { notifyRedRecipientId: fc.notifyRedRecipient.value ? fc.notifyRedRecipient.value.id : null },
        ...(fc.notifyYellowState.dirty || fc.notifyYellowState.touched || newRecord) && { notifyYellowState: fc.notifyYellowState.value },
        ...(fc.notifyRedState.dirty || fc.notifyRedState.touched || newRecord) && { notifyRedState: fc.notifyRedState.value },
        ...(this.mold?.notifyYellowChannels !== selectedYellowChannels || newRecord) && { notifyYellowChannels: selectedYellowChannels },
        ...(this.mold?.notifyRedChannels !== selectedRedChannels || newRecord) && { notifyRedChannels: selectedRedChannels },
        ...(fc.notifyRedSubject.dirty || fc.notifyRedSubject.touched || newRecord) && { notifyRedSubject: fc.notifyRedSubject.value },
        ...(fc.notifyRedBody.dirty || fc.notifyRedBody.touched || newRecord) && { notifyRedBody: fc.notifyRedBody.value },
        ...(fc.notifyYellowSubject.dirty || fc.notifyYellowSubject.touched || newRecord) && { notifyYellowSubject: fc.notifyYellowSubject.value },
        ...(fc.notifyYellowBody.dirty || fc.notifyYellowBody.touched || newRecord) && { notifyYellowBody: fc.notifyYellowBody.value },


        ...(fc.thresholdType.dirty || fc.thresholdType.touched || newRecord) && { thresholdType: fc.thresholdType.value },
        ...(fc.thresholdYellow.dirty || fc.thresholdYellow.touched || newRecord) && { thresholdYellow: fc.thresholdYellow.value ? +fc.thresholdYellow.value : null },
        ...(fc.thresholdRed.dirty || fc.thresholdRed.touched || newRecord) && { thresholdRed: fc.thresholdRed.value ? +fc.thresholdRed.value : null },
        ...(fc.thresholdDateYellow.dirty || fc.thresholdDateYellow.touched || newRecord) && { thresholdDateYellow: fc.thresholdDateYellow.value ? +fc.thresholdDateYellow.value : null },
        ...(fc.thresholdDateRed.dirty || fc.thresholdDateRed.touched || newRecord) && { thresholdDateRed: fc.thresholdDateRed.value ? +fc.thresholdDateRed.value : null },

        ...(fc.generationMode.dirty || fc.generationMode.touched || newRecord) && { generationMode: fc.generationMode.value },
        ...(fc.entities.dirty || fc.entities.touched || newRecord) && { entities: fc.entities.value },
    }
  }

  removeImage() {
    this.imageChanged = true;
    this.moldForm.controls.mainImageName.setValue('');
    this.mold.mainImagePath = '';
    this.mold.mainImageGuid = '';
    this.mold.mainImage = '';                
    const message = $localize`Se ha quitado la imagen del molde<br>Guarde el molde para aplicar el cambio`;
    this._sharedService.showSnackMessage({
      message,
      duration: 5000,
      snackClass: 'snack-primary',
      icon: 'check',
    });
    this.setEditionButtonsState();
  }

  initForm(): void {
    this.moldForm.reset();
    this.moldForm.controls.label.setValue(GeneralValues.N_A);
    this.moldForm.controls.thresholdType.setValue(GeneralValues.N_A);
    this.moldForm.controls.state.setValue(GeneralValues.N_A);
    this.moldForm.controls.timeZone.setValue(new Date().getTimezoneOffset() * 60);
    this.moldForm.controls.entities.setValue('');    
    this.maintenances.items = [];
    this.storedTranslations = [];
    this.entitiesCurrentSelection = [];  
    this.entities.items = [];
    this.translationChanged = false;
    this.mold = emptyMoldItem;        
    this.checklistRedTemplatesCurrentSelection = [];
    this.checklistYellowTemplatesCurrentSelection = [];
    this.checklistTemplatesYellow.currentPage = 0;   
    this.checklistTemplatesYellow.items = [];
    this.checklistTemplatesRed.currentPage = 0;   
    this.checklistTemplatesRed.items = [];
    this.requestChecklistTemplatesYellowData(0);
    this.requestChecklistTemplatesRedData(0);
    this.requestChecklistEntitiesData(0);     
    this.focusThisField = 'description';
    this.updateMultiSelections();
    setTimeout(() => {
      this.moldCatalogEdition.nativeElement.scrollIntoView({            
        behavior: 'smooth',
        block: 'start',
      });      
      this.focusThisField = '';
    }, 200);        
  }

  initUniqueField(): void {
    this.mold.id = null;
    this.mold.createdBy = null;        
    this.mold.createdAt = null;
    this.mold.updatedBy = null;
    this.mold.updatedAt = null;    
    this.mold.thresholdState = null;    
    this.mold.lastHit = null;    
    this.mold.lastResettingId = null;    
    this.mold.nextMaintenance = null;    
    this.mold.status = RecordStatus.ACTIVE;    
    this.mold.thresholdYellowDateReached = null;    
    this.mold.thresholdRedDateReached = null;    
    this.mold.nextMaintenance = null;    
    this.mold.hits = 0;    
    this.mold.previousHits = 0;  
    this.maintenances.items = [];  
    this.mold.translations.map((t) => {
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
    if (fieldControlName === 'description') {
      return $localize`Descripción o nombre del molde`
    } else if (fieldControlName === 'startingDate') {
      return $localize`Fecha de inicio de operaciones`
    } else if (fieldControlName === 'manufacturingDate') {
      return $localize`Fecha de manufactura del molde`
    } else if (fieldControlName === 'provider') {
      return $localize`Proveedor del molde`
    } else if (fieldControlName === 'manufacturer') {
      return $localize`Fabricante del molde`
    } else if (fieldControlName === 'equipment') {
      return $localize`Máquina o equipo asignado`
    } else if (fieldControlName === 'line') {
      return $localize`Línea asignada`
    } else if (fieldControlName === 'moldType') {
      return $localize`Tipo de molde`
    } else if (fieldControlName === 'moldClass') {
      return $localize`Clase de molde`
    } else if (fieldControlName === 'label') {
      return $localize`Color de la etiqeta`
    } else if (fieldControlName === 'state') {
      return $localize`Estado del molde`
    } else if (fieldControlName === 'partNumber') {
      return $localize`Número de parte`
    } else if (fieldControlName === 'thresholdType') {
      return $localize`Tipo de control`
    } else if (fieldControlName === 'state') {
      return $localize`Estado del molde`
    } else if (fieldControlName === 'thresholdYellow') {
      return $localize`Umbral de golpes para Advertencia`
    } else if (fieldControlName === 'thresholdRed') {
      return $localize`Umbral de golpes para ALARMA`
    } else if (fieldControlName === 'thresholdDateYellow') {
      return $localize`Umbral de número de días para Advertencia`
    } else if (fieldControlName === 'thresholdDateRed') {
      return $localize`Umbral de número de días para ALARMA`
    } else if (fieldControlName === 'recipient') {
      return $localize`Recipiente`
    }
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.MOLDS_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.MOLDS_CATALOG_EDITION,
      loading,
    );         
  }

  validateTables(): void {
    if (this.moldForm.controls.provider.value && this.moldForm.controls.provider.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.provider.setErrors({ inactive: true });      
    } else {
      this.moldForm.controls.provider.setErrors(null);      
    }
    if (this.moldForm.controls.manufacturer.value && this.moldForm.controls.manufacturer.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.manufacturer.setErrors({ inactive: true });      
    } else {
      this.moldForm.controls.manufacturer.setErrors(null);      
    }
    if (this.moldForm.controls.equipment.value && this.moldForm.controls.equipment.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.equipment.setErrors({ inactive: true });      
    } else {
      this.moldForm.controls.equipment.setErrors(null);      
    }
    if (this.moldForm.controls.line.value && this.moldForm.controls.line.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.line.setErrors({ inactive: true });      
    } else {
      this.moldForm.controls.line.setErrors(null);      
    }
    if (this.moldForm.controls.moldClass.value && this.moldForm.controls.moldClass.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.moldClass.setErrors({ inactive: true });      
    } else {
      this.moldForm.controls.moldClass.setErrors(null);      
    }
    if (this.moldForm.controls.moldType.value && this.moldForm.controls.moldType.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.moldType.setErrors({ inactive: true });      
    } else {
      this.moldForm.controls.moldType.setErrors(null);      
    }    
    if (this.moldForm.controls.partNumber.value && this.moldForm.controls.partNumber.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.partNumber.setErrors({ inactive: true });      
    } else {
      this.moldForm.controls.partNumber.setErrors(null);      
    }
    if (this.moldForm.controls.notifyRedState.value === GeneralValues.YES && this.moldForm.controls.notifyRedRecipient.value && this.moldForm.controls.notifyRedRecipient.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.notifyRedRecipient.setErrors({ inactive: true });   
    } else {
      this.moldForm.controls.notifyRedRecipient.setErrors(null);      
    }
    if (this.moldForm.controls.notifyYellowState.value === GeneralValues.YES && this.moldForm.controls.notifyYellowRecipient.value && this.moldForm.controls.notifyYellowRecipient.value.status === RecordStatus.INACTIVE) {
      this.moldForm.controls.notifyYellowRecipient.setErrors({ inactive: true });   
    } else {
      this.moldForm.controls.notifyYellowRecipient.setErrors(null);      
    }
    // It is missing the validation for state and thresholdType because we dont retrieve the complete record but tghe value
  }

  processTranslations$(moldId: number): Observable<any> { 
    const differences = this.storedTranslations?.length !== this.mold.translations?.length || this.storedTranslations?.some((st: any) => {
      return this.mold.translations.find((t: any) => {        
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
      const translationsToAdd = this.mold.translations.map((t: any) => {
        return {
          id: null,
          moldId,
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
        varToAdd.translations?.length > 0 ? this._catalogsService.addMoldTranslations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteMoldTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

  saveCatalogDetails$(processId: number): Observable<any> {
    const newRecord = !this.mold.id || this.mold.id === null || this.mold.id === 0;
    if (this.checklistYellowTemplatesCurrentSelection.length > 0 || this.checklistRedTemplatesCurrentSelection.length > 0 || this.entitiesCurrentSelection.length > 0) {
      const checklistTemplatesYellowToDelete = this.checklistYellowTemplatesCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      const checklistTemplatesRedToDelete = this.checklistRedTemplatesCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      const checklistPlanEntities = this.entitiesCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      
      const ctToDelete = {
        ids: [...checklistTemplatesYellowToDelete, ...checklistTemplatesRedToDelete, ...checklistPlanEntities],
        customerId: 1, // TODO: Get from profile
      }
      const checklistTemplatesYellowToAdd = this.checklistYellowTemplatesCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.CHECKLIST_TEMPLATES_YELLOW,
          processId,
          detailTableName: SystemTables.CHECKLIST_TEMPLATES,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      const checklistTemplatesRedToAdd = this.checklistRedTemplatesCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.CHECKLIST_TEMPLATES_RED,
          processId,
          detailTableName: SystemTables.CHECKLIST_TEMPLATES,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      const checklistPlanEntitiesToAdd = this.entitiesCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.MOLD_TEMPLATE_GM,
          processId,
          detailTableName: this.entityTable,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      
      const ctToAdd = {
        catalogDetails: [...checklistTemplatesYellowToAdd, ...checklistTemplatesRedToAdd, ...checklistPlanEntitiesToAdd],
      }

      return combineLatest([ 
        ctToAdd.catalogDetails.length > 0 ? this._catalogsService.addOrUpdateCatalogDetails$(ctToAdd) : of(null), 
        ctToDelete.ids.length > 0 && !newRecord ? this._catalogsService.deleteCatalogDetails$(ctToDelete) :  of(null) 
      ]);
    } else {
      return of(null);
    }
  }

  handleRemoveAllHistoricalButtonClick(action: string, id: number = 0) {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: id === 0 ? $localize`Eliminar todo el historial` : $localize`Eliminar mantenimiento`,  
        topIcon: 'garbage_can',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: id === 0 ? $localize`Esta acción eliminará todo el historial de mantenimiento de este molde.<br><br><strong>¿Desea continuar?</strong>` : $localize`Esta acción eliminará el historial con item: <strong>${id}</strong>.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        const idToDelete = {
          id,
          deletePhysically: false,
        }
         const historyToDelete = this.maintenances.items.map((t: any) => {
          return {
            id: t.id,
            deletePhysically: false,
          }
        });
        const varToDelete = {
          ids: id === 0 ? historyToDelete : idToDelete,
          customerId: 1, // TODO: Get from profile
        }
        this.deleteMoldMaintenanceHistory$ = this._catalogsService.deleteMoldMaintenanceHistory$(varToDelete)
        .pipe(
          tap(() => {              
            this.requestMaintenancesData(0);
          })        
        )
      } else {
        this._sharedService.actionCancelledByTheUser();
      }
      this.elements.find(e => e.action === action).loading = false;
    });       
  }
  
  handleNotifyChannelsSelectItem(origin: string, formField: FormControl, item: any) {
    if (formField.disabled) return;
    if (formField.value === GeneralValues.YES) {
      item.selected = !item.selected;
      if (origin === 'red') {
        this.notifyRedChannelsSelected = this.notifyRedChannels.items.filter(r => r.selected).length;
      } else if (origin === 'yellow') {
        this.notifyYellowChannelsSelected = this.notifyYellowChannels.items.filter(r => r.selected).length;
      }
      this.setEditionButtonsState();
    }
  }

  setEditionButtonsState() {
    if (!this.mold.id || this.mold.id === null || this.mold.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }

  handleKeyDown(event: KeyboardEvent) { }

  chengeSelection(event: any) { 
  }

  handleChangeSelection(event: any) { 
  }

  duplicateMainImage() {    
    this.duplicateMainImage$ = this._catalogsService.duplicateMainImage$(originProcess.CATALOGS_MOLDS, this.mold.mainImageGuid)
    .pipe(
      tap((newAttachments) => {
        if (newAttachments.duplicated) {       
          this.imageChanged = true;   
          this.mold.mainImageGuid = newAttachments.mainImageGuid;
          this.mold.mainImageName = newAttachments.mainImageName;
          this.mold.mainImagePath = newAttachments.mainImagePath;   

          this.mold.mainImage = `${environment.uploadFolders.completePathToFiles}/${this.mold.mainImagePath}`;
          this.moldForm.controls.mainImageName.setValue(this.mold.mainImageName);
        }        
      })
    );
  }

  get MoldControlStates() {
    return MoldControlStates;
  }

  get SystemTables () {
    return SystemTables;
  }

  get ScreenDefaultValues () {
    return ScreenDefaultValues;
  }

  get RecordStatus() {
    return RecordStatus; 
  }

  get GeneralValues() {
    return GeneralValues; 
  }

// End ======================
}
