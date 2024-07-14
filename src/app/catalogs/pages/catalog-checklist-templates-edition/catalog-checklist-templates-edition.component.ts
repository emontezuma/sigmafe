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
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip, switchMap, tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import { ChecklistTemplateDetail, ChecklistTemplateItem, ChecklistTemplateLine, VariableDetail, emptyChecklistTemplateItem } from '../../models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomValidators } from '../../custom-validators';
import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesItem } from '../../models/catalogs-shared.models';
import { VariableSelectionDialogComponent } from '../../components';

@Component({
  selector: 'app-catalog-checklist-templates-edition',
  templateUrl: './catalog-checklist-templates-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-checklist-templates-edition.component.scss']
})
export class CatalogChecklistTemplatesEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;
  @ViewChild('possibleValue', { static: false }) possibleValue: ElementRef;  

  // ChecklistTemplates ===============
  checklistTemplate: ChecklistTemplateDetail = emptyChecklistTemplateItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  templateTypes$: Observable<any>; 
  sensors$: Observable<any>; 
  genYesNoValues$: Observable<any>;
  notificationModes$: Observable<any>;
  notificationChannels$: Observable<any>;
  duplicateAttachmentsList$: Observable<any>;
  duplicateMainImage$: Observable<any>; 
  macros$: Observable<any>;    
  recipients$: Observable<any>;
  variable$: Observable<any>;
  approvers$: Observable<any>; 
  states$: Observable<any>;

  moldsCurrentSelection: GeneralMultipleSelcetionItems[] = [];  
  molds: GeneralCatalogData = emptyGeneralCatalogData; 
  molds$: Observable<any>;    
  recipients: GeneralCatalogData = emptyGeneralCatalogData;
  variable: VariableDetail;
  pendingRecord: number = 0;

  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  checklistTemplate$: Observable<any>;
  translations$: Observable<any>;
  updateChecklistTemplate$: Observable<any>;
  checklistDetailAttachments$: Observable<any>;  
  updateChecklistTemplateCatalog$: Observable<any>;
  deleteChecklistTemplateTranslations$: Observable<any>;  
  addChecklistTemplateTranslations$: Observable<any>;  
  updateChecklistTemplateLine$: Observable<any>;  
  
  checklistTemplateFormChangesSubscription: Subscription;
  checklistTemplateFieldFormChangesSubscription: Subscription;

  templateTypes: GeneralCatalogData = emptyGeneralCatalogData;   
  macros: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  expiringNotificationMode: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  expiringChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  anticipationNotificationMode: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  anticipationChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  generationNotificationMode: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  generationChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  approvalNotificationMode: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  approvalRequestChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  alarmNotificationMode: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  alarmNotificationChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData;   
  states: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 

  approvers: GeneralCatalogData = emptyGeneralCatalogData; 

  expiringChannelsSelected: number = 0;
  expiringNotificationModeSelected: number = 0;
  
  anticipationNotificationModeSelected: number = 0;
  anticipationChannelsSelected: number = 0;
  
  approvalNotificationModeSelected: number = 0;
  approvalRequestChannelsSelected: number = 0;
  
  generationNotificationModeSelected: number = 0;
  generationChannelsSelected: number = 0;
  
  alarmNotificationModeSelected: number = 0;
  alarmNotificationChannelsSelected: number = 0;

  statesSelected: number = 0;
  updatingCount: number = 0;

  checklistTemplateLines: ChecklistTemplateLine[] = [];
  checklistTemplateLineForms: any[];
  
  attachmentsTableColumns: string[] = [ 'index', 'icon', 'name', 'actions-attachments' ];
  attachmentsTable = new MatTableDataSource<Attachment>([]);
  addAttachmentButtonClick: boolean = false;
  addVariableButtonClick: boolean = false;
  checklistTemplateAttachmentLabel: string = '';
  
  editingValue: number = -1;
  
  uploadFiles: Subscription;
  downloadFiles: Subscription;
  
  catalogIcon: string = "brochure";  
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  macrosValuesOrder: any = JSON.parse(`{ "id": "${'ASC'}" }`);
  harcodedValuesOrderById: any = JSON.parse(`{ "id": "${'ASC'}" }`);
  linesOrder: any = JSON.parse(`{ "line": "${'ASC'}" }`);
  approversOrder: any = JSON.parse(`{ "data": { "name": "${'ASC'}" } }`);
  storedTranslations: [];
  storedLines: ChecklistTemplateLine[] = [];  
  translationChanged: boolean = false
  imageChanged: boolean = false
  submitControlled: boolean = false
  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false, false, false];
  generalPanelOpenState: boolean[] = [false, false, false, false, false];
  formPanelOpenState: boolean[] = [];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  variableData: ChecklistTemplateItem;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';
  byDefaultValueType: string = '';
  tmpValueType: string = '';
  multipleSearchDefaultValue: string = '';  

  checklistTemplateForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),
    templateType: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    allowDiscard: new FormControl(emptyGeneralHardcodedValuesItem),
    allowRejection: new FormControl(emptyGeneralHardcodedValuesItem),
    allowManualMode: new FormControl(emptyGeneralHardcodedValuesItem),
    allowPartialSaving: new FormControl(emptyGeneralHardcodedValuesItem),
    allowApprovalByGroup: new FormControl(emptyGeneralHardcodedValuesItem),
    allowExpiring: new FormControl(emptyGeneralHardcodedValuesItem),
    allowAlarm: new FormControl(emptyGeneralHardcodedValuesItem),
    requiresApproval: new FormControl(emptyGeneralHardcodedValuesItem),
    cancelOpenChecklists: new FormControl(emptyGeneralHardcodedValuesItem),
    allowReassignment: new FormControl(emptyGeneralHardcodedValuesItem),
    requiresActivation: new FormControl(emptyGeneralHardcodedValuesItem),
    allowRestarting: new FormControl(emptyGeneralHardcodedValuesItem),
    moldStates: new FormControl(''),
    
    expiringMessageSubject:  new FormControl(''),    
    expiringMessageBody:  new FormControl(''),
    expiringNotificationMode:  new FormControl(''),
    expiringChannels:  new FormControl(''),
    notifyExpiring: new FormControl(emptyGeneralHardcodedValuesItem),
    
    notifyAlarm: new FormControl(emptyGeneralHardcodedValuesItem),
    alarmNotificationMode:  new FormControl(''),
    alarmNotificationChannels:  new FormControl(''),
    alarmNotificationMessageSubject:  new FormControl(''),
    alarmNotificationMessageBody:  new FormControl(''),
    
    approvalNotificationMode:  new FormControl(''),
    approvalRequestChannels:  new FormControl(''),
    approvalRequestMessageSubject:  new FormControl(''),
    approvalRequestMessageBody:  new FormControl(''),
    notifyApproval: new FormControl(emptyGeneralHardcodedValuesItem),
    
    anticipationMessageSubject:  new FormControl(''),
    anticipationNotificationMode:  new FormControl(''),
    anticipationChannels:  new FormControl(''),
    anticipationMessageBody:  new FormControl(''),
    notifyAnticipation: new FormControl(emptyGeneralHardcodedValuesItem),
    anticipationSeconds: new FormControl(0),    
    
    notifyGeneration: new FormControl(emptyGeneralHardcodedValuesItem),
    generationNotificationMode:  new FormControl(''),
    generationChannels:  new FormControl(''),    
    generationMessageSubject:  new FormControl(''),
    generationMessageBody:  new FormControl(''),    
    molds:  new FormControl(''),
    notes: new FormControl(''),
    mainImageName: new FormControl(''),    
    reference: new FormControl(''),    
    prefix: new FormControl(''),        
    expiringRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    approvalRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    alarmRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    anticipationRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    generationRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    timeToFill: new FormControl(0),   
    approver: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),       
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
  editing: boolean = false;
  showMacros: boolean = false;
  movedVariable: number = -1;

  moldsOptions: SimpleTable[] = [
    { id: '', description: $localize`No usar esta plantilla de checklist para ningún Molde` },  
    { id: 'y', description: $localize`TODOS los Moldes activos` },  
    { id: 'n', description: $localize`Los Moldes de lista` },  
    { id: 's', description: $localize`Seleccionar TODOS los items de la lista` },  
    { id: 'u', description: $localize`Deseleccionar TODOS los items de la lista` },  
  ];

  valuesByDefault: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 

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
    // this.checklistTemplateForm.get('name').disable();
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION,
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
        this.requesttemplateTypessData(currentPage);
        this.requestMacrosData(currentPage);
        this.requestGenYesNoValuesData(currentPage);        
        this.requestNotifyModesData(currentPage);        
        this.requestNotifyChannelsData(currentPage);        
        this.requestStatesData(currentPage);
        this.requestMoldsData(currentPage);        
      })
    );
        
    this.checklistTemplateFormChangesSubscription = this.checklistTemplateForm.valueChanges
    .subscribe(() => {
      if (!this.loaded) return;
      this.setEditionButtonsState();      
    });
    
    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION,
          !animationFinished,
        ); 
      }
    ));

    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));

    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.editing = true;
          this.requestChecklistTemplateData(+params['id']);
        }
      })
    ); 

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyExpiring.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('expiringMessageBody').enabled) this.checklistTemplateForm.get('expiringMessageBody').disable({ emitEvent: false });
        if (this.checklistTemplateForm.get('expiringMessageSubject').enabled) this.checklistTemplateForm.get('expiringMessageSubject').disable({ emitEvent: false });
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('expiringMessageBody').disabled) this.checklistTemplateForm.get('expiringMessageBody').enable({ emitEvent: false });
        if (this.checklistTemplateForm.get('expiringMessageSubject').disabled) this.checklistTemplateForm.get('expiringMessageSubject').enable({ emitEvent: false });
      }      
    });

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyAlarm.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('alarmNotificationMessageBody').enabled) this.checklistTemplateForm.get('alarmNotificationMessageBody').disable({ emitEvent: false });
        if (this.checklistTemplateForm.get('alarmNotificationMessageSubject').enabled) this.checklistTemplateForm.get('alarmNotificationMessageSubject').disable({ emitEvent: false });
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('alarmNotificationMessageBody').disabled) this.checklistTemplateForm.get('alarmNotificationMessageBody').enable({ emitEvent: false });
        if (this.checklistTemplateForm.get('alarmNotificationMessageSubject').disabled) this.checklistTemplateForm.get('alarmNotificationMessageSubject').enable({ emitEvent: false });
      }      
    });

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyAnticipation.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('anticipationMessageBody').enabled) this.checklistTemplateForm.get('anticipationMessageBody').disable({ emitEvent: false });
        if (this.checklistTemplateForm.get('anticipationMessageSubject').enabled) this.checklistTemplateForm.get('anticipationMessageSubject').disable({ emitEvent: false });
        if (this.checklistTemplateForm.get('anticipationSeconds').enabled) this.checklistTemplateForm.get('anticipationSeconds').disable({ emitEvent: false });
        
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('anticipationMessageBody').disabled) this.checklistTemplateForm.get('anticipationMessageBody').enable({ emitEvent: false });
        if (this.checklistTemplateForm.get('anticipationMessageSubject').disabled) this.checklistTemplateForm.get('anticipationMessageSubject').enable({ emitEvent: false });
        if (this.checklistTemplateForm.get('anticipationSeconds').disabled) this.checklistTemplateForm.get('anticipationSeconds').enable({ emitEvent: false });        
      }      
    });

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyApproval.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('approvalRequestMessageBody').enabled) this.checklistTemplateForm.get('approvalRequestMessageBody').disable({ emitEvent: false });
        if (this.checklistTemplateForm.get('approvalRequestMessageSubject').enabled) this.checklistTemplateForm.get('approvalRequestMessageSubject').disable({ emitEvent: false });
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('approvalRequestMessageBody').disabled) this.checklistTemplateForm.get('approvalRequestMessageBody').enable({ emitEvent: false });
        if (this.checklistTemplateForm.get('approvalRequestMessageSubject').disabled) this.checklistTemplateForm.get('approvalRequestMessageSubject').enable({ emitEvent: false });
      }      
    });

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyGeneration.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('generationMessageBody').enabled) this.checklistTemplateForm.get('generationMessageBody').disable({ emitEvent: false });
        if (this.checklistTemplateForm.get('generationMessageSubject').enabled) this.checklistTemplateForm.get('generationMessageSubject').disable({ emitEvent: false });
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('generationMessageBody').disabled) this.checklistTemplateForm.get('generationMessageBody').enable({ emitEvent: false });
        if (this.checklistTemplateForm.get('generationMessageSubject').disabled) this.checklistTemplateForm.get('generationMessageSubject').enable({ emitEvent: false });
      }      
    });

    this.calcElements();
    setTimeout(() => {
      this.focusThisField = 'name';
      if (!this.checklistTemplate.id) {
        this.loaded = !this.editing || this.loaded;
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
    if (this.checklistTemplateFormChangesSubscription) this.checklistTemplateFormChangesSubscription.unsubscribe(); 
    if (this.checklistTemplateFieldFormChangesSubscription) this.checklistTemplateFieldFormChangesSubscription.unsubscribe();     
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

  requesttemplateTypessData(currentPage: number, filterStr: string = null) {
    this.templateTypes = {
      ...this.templateTypes,
      currentPage,
      loading: true,
    } 
    const skipRecords = this.templateTypes.items.length;
    this.templateTypes$ = this.requestGenericsData$(currentPage, skipRecords, SystemTables.CHECKLIST_TEMPLATE_TYPES, filterStr)
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
        this.templateTypes = {
          ...this.templateTypes,
          loading: false,
          pageInfo: data?.data?.genericsPaginated?.pageInfo,
          items: this.templateTypes.items?.concat(mappedItems),
          totalCount: data?.data?.genericsPaginated?.totalCount,
        }
      }),      
      catchError(() => EMPTY)
    )
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

  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION,
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
    if (action.from === ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION && this.elements.length > 0) {
      if (action.action === ButtonActions.NEW) {        
        this.elements.find(e => e.action === action.action).loading = true;
        if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) {
          this.showErrorDialog('save-before', ButtonActions.NEW);          
        } else {
          this._location.replaceState('/catalogs/checklist-templates/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/checklist-templates'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this.duplicateMainImage();
        this.duplicateAttachments();
        this.markLinesAsNew();
        this._location.replaceState('/catalogs/checklist-templates/create');
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
        if (!this.checklistTemplate.id || this.checklistTemplate.id === null || this.checklistTemplate.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestChecklistTemplateData(this.checklistTemplate.id);
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
        if (this.checklistTemplate?.id > 0 && this.checklistTemplate.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR PLANTILLA DE CHECKLIST`,  
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
                action: ButtonActions.CANCEL,
                showIcon: true,
                icon: 'cancel',
                showCaption: true,
                caption: $localize`Cancelar`,
                showTooltip: true,            
                tooltip: $localize`Cancela la acción`,
                default: false,
              }],
              body: {
                message: $localize`Esta acción inactivará la plantilla checklist con el Id <strong>${this.checklistTemplate.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === ButtonActions.CANCEL) {
              setTimeout(() => {
                this._sharedService.actionCancelledByTheUser();
                this.elements.find(e => e.action === action.action).loading = false;
              }, 200); 
            } else {
              this.elements.find(e => e.action === action.action).loading = true;
              const variableParameters = {
                settingType: 'status',
                id: this.checklistTemplate.id,
                customerId: this.checklistTemplate.customerId,
                status: RecordStatus.INACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(variableParameters);
              this.updateChecklistTemplate$ = this._catalogsService.updateChecklistTemplateStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateChecklistTemplate.length > 0 && data?.data?.createOrUpdateChecklistTemplate[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE);
                      this.checklistTemplate.status = RecordStatus.INACTIVE;
                      const message = $localize`La Plantilla de checklist ha sido inhabilitada`;
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
        } else if (this.checklistTemplate?.id > 0 && this.checklistTemplate.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR PLANTILLA DE CHECKLIST`,  
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
                action: ButtonActions.CANCEL,
                showIcon: true,
                icon: 'cancel',
                showCaption: true,
                caption: $localize`Cancelar`,
                showTooltip: true,            
                tooltip: $localize`Cancela la acción`,
                default: false,
              }],
              body: {
                message: $localize`Esta acción reactivará la plantilla de checklist con el Id <strong>${this.checklistTemplate.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: true,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.action === ButtonActions.CANCEL) {
              setTimeout(() => {
                this._sharedService.actionCancelledByTheUser();
                this.elements.find(e => e.action === action.action).loading = false;
              }, 200); 
            } else {
              this.elements.find(e => e.action === action.action).loading = true;
              const variableParameters = {
                settingType: 'status',
                id: this.checklistTemplate.id,
                customerId: this.checklistTemplate.customerId,
                status: RecordStatus.ACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(variableParameters);
              this.updateChecklistTemplate$ = this._catalogsService.updateChecklistTemplateStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateChecklistTemplate.length > 0 && data?.data?.createOrUpdateChecklistTemplate[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {
                      this.checklistTemplate.status = RecordStatus.ACTIVE;
                      this.changeInactiveButton(RecordStatus.ACTIVE)
                      const message = $localize`La Plantilla de checklist ha sido reactivado`;
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
      } else if (action.action === ButtonActions.MACROS) { 
        this.showMacros = !this.showMacros;
        this.elements.find(e => e.action === action.action).class = this.showMacros ? 'accent' : '';
      } else if (action.action === ButtonActions.TRANSLATIONS) { 
        if (this.checklistTemplate?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones de la plantila de checklist <strong>${this.checklistTemplate.id}</strong>`,
              topIcon: 'world',
              translations: this.checklistTemplate.translations,
              fromChecklistTemplate: true,
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
                message: $localize`Esta acción inactivará el template de checklist ${this.checklistTemplate.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.checklistTemplate.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.checklistTemplate.translations.length > 0 ? $localize`Traducciones (${this.checklistTemplate.translations.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.checklistTemplate.translations.length > 0 ? 'accent' : '';   
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
      tooltip:  $localize`Regresar a la lista de plantillas de checklist`,
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
      disabled: this.checklistTemplate?.status !== RecordStatus.ACTIVE,
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
      disabled: !!!this.checklistTemplate.id,
      action: ButtonActions.TRANSLATIONS,      
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
      action: ButtonActions.MACROS,      
    },];
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

  requestNotifyModesData(currentPage: number) {
    this.expiringNotificationMode = {
      ...this.expiringNotificationMode,
      currentPage,
      loading: true,
    }
    this.anticipationNotificationMode = {
      ...this.anticipationNotificationMode,
      currentPage,
      loading: true,
    }
    this.approvalNotificationMode = {
      ...this.approvalNotificationMode,
      currentPage,
      loading: true,
    }
    this.alarmNotificationMode = {
      ...this.alarmNotificationMode,
      currentPage,
      loading: true,
    }
    this.generationNotificationMode = {
      ...this.generationNotificationMode,
      currentPage,
      loading: true,
    }        
    this.notificationModes$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.macrosValuesOrder, SystemTables.CHECKLIST_TEMPLATE_NOTIFYING)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.expiringNotificationMode.items?.concat(data?.data?.hardcodedValues?.items);
        this.expiringNotificationMode = {
          ...this.expiringNotificationMode,
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
        this.anticipationNotificationMode = {
          ...this.anticipationNotificationMode,
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
        this.approvalNotificationMode = {
          ...this.approvalNotificationMode,
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
        this.alarmNotificationMode = {
          ...this.alarmNotificationMode,
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
        this.generationNotificationMode = {
          ...this.generationNotificationMode,
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
        if (this.pendingRecord < 2) {
          this.updateMultiSelections('all');
          this.pendingRecord++;
        } 
      }),
      catchError(() => EMPTY)
    )
  }
  
  requestNotifyChannelsData(currentPage: number) {
    this.expiringChannels = {
      ...this.expiringChannels,
      currentPage,
      loading: true,
    }        
    this.anticipationChannels = {
      ...this.anticipationChannels,
      currentPage,
      loading: true,
    }        
    this.approvalRequestChannels = {
      ...this.approvalRequestChannels,
      currentPage,
      loading: true,
    }        
    this.alarmNotificationChannels = {
      ...this.alarmNotificationChannels,
      currentPage,
      loading: true,
    }        
    this.generationChannels = {
      ...this.generationChannels,
      currentPage,
      loading: true,
    }        
    this.notificationChannels$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrder, SystemTables.CHANNELS)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.expiringChannels.items?.concat(data?.data?.hardcodedValues?.items);
        this.expiringChannels = {
          ...this.expiringChannels,
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
        this.anticipationChannels = {
          ...this.anticipationChannels,
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
        this.approvalRequestChannels = {
          ...this.approvalRequestChannels,
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
        this.generationChannels = {
          ...this.generationChannels,
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
        this.alarmNotificationChannels = {
          ...this.alarmNotificationChannels,
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
        if (this.pendingRecord < 2) {
          this.updateMultiSelections('all');
          this.pendingRecord++;
        }    
      }),
      catchError(() => EMPTY)
    )
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
    if (this.checklistTemplateLines.length === 0) {
      this.elements.find(e => e.action === ButtonActions.SAVE).loading = true;
      this.showErrorDialog('no-lines', ButtonActions.SAVE);
      return;
    }    
    for (const line of this.checklistTemplateLines) {      
      const lineValidation = {
        ...line,
        validate: true,
      }
      this._catalogsService.updateCheklistTemplateLineData(line.line, lineValidation);
    }
    // this.checklistTemplateForm.markAllAsTouched();
    this.checklistTemplateForm.updateValueAndValidity(); 
    if (this.checklistTemplateForm.valid && !this.checklistTemplateLines.find((line) => line.error)) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.checklistTemplateForm.controls) {
        if (this.checklistTemplateForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.checklistTemplateForm.controls[controlName]; 
          if (typedControl.invalid) {
            fieldsMissingCounter++;
            fieldsMissing += `<strong>${fieldsMissingCounter}.</strong> ${this.getFieldDescription(controlName)}<br>`;
          }
        }
      }
      for (const line of this.checklistTemplateLines) {
        if (line.error) {
          fieldsMissingCounter++;
          fieldsMissing += $localize`<strong>${fieldsMissingCounter}.</strong> La variable <strong>${line.name} / línea ${line.order + 1}</strong> tiene errores<br>`;
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
        for (const controlName in this.checklistTemplateForm.controls) {
          if (this.checklistTemplateForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.checklistTemplateForm.controls[controlName]; 
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
    const newRecord = !this.checklistTemplate.id || this.checklistTemplate.id === null || this.checklistTemplate.id === 0;
    let checklistTemplateId = 0;
    try {
      const dataToSave = this.prepareRecordToSave(newRecord);
      this.updateChecklistTemplateCatalog$ = this._catalogsService.updateChecklistTemplateCatalog$(dataToSave)
      .pipe(
        switchMap((data: any) => {
          if (data?.data?.createOrUpdateChecklistTemplate.length > 0) {
            checklistTemplateId = data?.data?.createOrUpdateChecklistTemplate[0].id;
            const files = this.checklistTemplate.attachments.map((a) => a.id);
            return combineLatest([ 
              this.processTranslations$(checklistTemplateId), 
              this.saveCatalogDetails$(checklistTemplateId),          
              this.processDetails$(checklistTemplateId),                        
              this._catalogsService.saveAttachments$(originProcess.CATALOGS_CHECKLIST_TEMPLATE_HEADER_ATTACHMENTS, checklistTemplateId, files),              
            ])
          } else {
            return of([])
          }
        }),
        switchMap((data: any) => {  
          const attachmentsObservablesArray: Observable<any>[] = [];
          if (data && data?.length > 1) {
            const linesUpdateData = data[2];
            if (linesUpdateData && linesUpdateData?.length > 1) {
              const linesAddedData = linesUpdateData[0]?.data?.createOrUpdateChecklistTemplateDetail;
              if (linesAddedData && linesAddedData.length > 0) {
                let index = 0;                
                for (const line of this.checklistTemplateLines) {      
                  line.line = linesAddedData[index].line;
                  line.id = linesAddedData[index].id;
                  line.customerId = linesAddedData[index].customerId;
                  line.order = index;                  
                  const files = line.attachments.map((a) => a.id);
                  if (files?.length > 0) {
                    attachmentsObservablesArray.push(this._catalogsService.saveAttachments$(originProcess.CATALOGS_CHECKLIST_TEMPLATE_LINES_ATTACHMENTS, linesAddedData[index].id, files),              );
                  }
                  index++;
                }
              }
            }
          }
          if (attachmentsObservablesArray.length > 0) {
            return combineLatest(attachmentsObservablesArray);
          } else {
            return of([]);
          }
        }),
        tap((data: any) => {
          this.requestChecklistTemplateData(checklistTemplateId);
          setTimeout(() => {              
            let message = $localize`La plantilla de checklist ha sido actualizada`;
            if (newRecord) {                
              message = $localize`La plantilla de checklist ha sido creada satisfactoriamente con el id <strong>${checklistTemplateId}</strong>`;
              this._location.replaceState(`/catalogs/checklist-templates/edit/${checklistTemplateId}`);
            }
            this._sharedService.showSnackMessage({
              message,
              snackClass: 'snack-accent',
              progressBarColor: 'accent',                
            });
            this.setViewLoading(false);
            this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;
          }, 200);
        }),
        catchError((error) => {          
          const message = $localize`Se generó un error al procesar el registro. Error: ${error}`;
          this._sharedService.showSnackMessage({
            message,
            duration: 5000,
            snackClass: 'snack-warn',
            icon: 'check',
          }); 
          this.setViewLoading(false);
          this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;    
          return of(null);        
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

  processDetails$(processId: number): Observable<any> {
    const linesToDelete = [];      
    const linesToAdd = [];
    for (const line of this.storedLines) {
      const lineToRemove = this.checklistTemplateLines.find((l) => l.id === line.id );
      if (!lineToRemove) {
        linesToDelete.push({
          id: line.id,
          deletePhysically: true,
        });
      }
    }      
    const varToDelete = {
      ids: linesToDelete,
      customerId: 1, // TODO: Get from profile
    }      

    let i = 0;
    const sortedDetail = this.checklistTemplateLines.sort((a, b) => a.order - b.order)
    
    for (const line of sortedDetail) {            
      const newRecord: boolean = !line.id || line.id === null || line.id === 0;
        
      const lineData = {
        id: line.id,              
        line: i,
        checklistTemplateId: processId,
        customerId: 1, // TODO: Get from profile        
        recipientId: line.recipientId,
        variableId: line.variableId,
        required: line.required,
        allowComments: line.allowComments,
        allowNoCapture: line.allowNoCapture,
        allowAlarm: line.allowAlarm,
        showChart: line.showChart,
        showParameters: line.showParameters ? line.showParameters : GeneralValues.NO,
        showLastValue: line.showLastValue ? line.showLastValue : GeneralValues.NO,
        notifyAlarm: line.notifyAlarm,

        useVariableAttachments: line.useVariableAttachments ? line.useVariableAttachments : GeneralValues.NO,
        notes: line.notes,
        byDefault: line.byDefault,
        showNotes: line.showNotes ? GeneralValues.YES : GeneralValues.NO,
        maximum: line.maximum,
        minimum: line.minimum,
        possibleValues: JSON.stringify(line.valuesList),
      }
    
      linesToAdd.push(lineData);
      i++;
    }
    return combineLatest([ 
      linesToAdd.length > 0 ? this._catalogsService.updateChecklistTemplatLines$({ checklistTemplateDetail: linesToAdd }) : of(null),
      varToDelete.ids.length > 0 ? this._catalogsService.deleteChecklistTemplateDetails$(varToDelete) : of(null) 
    ]);  
  }

  saveCatalogDetails$(processId: number): Observable<any> {
    if (this.moldsCurrentSelection.length > 0) {
      const moldsToDelete = this.moldsCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      const ctToDelete = {
        ids: [...moldsToDelete],
        customerId: 1, // TODO: Get from profile
      }
      const moldsToAdd = this.moldsCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.CHECKLIST_TEMPLATE_MOLDS,
          processId,
          detailTableName: SystemTables.MOLDS,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      const ctToAdd = {
        catalogDetails: [...moldsToAdd],
      }

      return combineLatest([ 
        ctToAdd.catalogDetails.length > 0  ? this._catalogsService.addOrUpdateCatalogDetails$(ctToAdd) : of(null), 
        ctToDelete.ids.length > 0 ? this._catalogsService.deleteCatalogDetails$(ctToDelete) :  of(null) 
      ]);
    } else {
      return of(null);
    }
  }

  requestMacrosData(currentPage: number) {
    this.macros = {
      ...this.macros,
      currentPage,
      loading: true,
    }        
    this.macros$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.macrosValuesOrder, SystemTables.CHECKLIST_TEMPLATE_MACROS)
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
  
  requestChecklistTemplateData(checklistTemplateId: number): void { 
    let variables = undefined;
    variables = { checklistTemplateId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "checklistTemplateId": { "eq": ${checklistTemplateId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    const process = originProcess.CATALOGS_CHECKLIST_TEMPLATE_HEADER_ATTACHMENTS;
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.checklistTemplate$ = this._catalogsService.getChecklistTemplateDataGql$({ 
      checklistTemplateId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
      process,
      customerId: 1, // TODO
      orderForDetails: this.linesOrder,
    }).pipe(
      map(([ checklistTemplateGqlData, checklistTemplateGqlTranslationsData, checklistTemplateGqlAttachments, checklistTemplateGqlLines ]) => {
        return this._catalogsService.mapOneChecklistTemplate({
          checklistTemplateGqlData,  
          checklistTemplateGqlTranslationsData,
          checklistTemplateGqlAttachments,
          checklistTemplateGqlLines,
        })
      }),
      tap((checklistTemplateData: ChecklistTemplateDetail) => {
        if (!checklistTemplateData) return;
        this.checklistTemplate =  checklistTemplateData;
        this.checklistTemplateLines =  checklistTemplateData.lines;                
        this.checklistTemplateLineForms = this.checklistTemplateLines.map((l) => {
          return null;
        })
        this.storedLines = JSON.parse(JSON.stringify(this.checklistTemplateLines));
      }),
      switchMap((checklistTemplateData: ChecklistTemplateDetail) => {
        const attachmentsObservablesArray: Observable<any>[] = [];
        for (const line of checklistTemplateData?.lines) {
          attachmentsObservablesArray.push(this.mapChecklistTemplatesDetailAttachments$(line['id']));
        }
        if (attachmentsObservablesArray.length > 0) {
          return combineLatest(attachmentsObservablesArray);
        } else {
          return of([]);
        }
      }),
      tap((attachments: any) => {
        // this.mapLines(attachments);
        for (const [index, line] of this.checklistTemplateLines.entries()) {
          line.attachments = attachments[index]?.data?.uploadedFiles?.items?.map((a) => {
            return {
              index: a.line,
              name: a.fileName, 
              id: a.fileId, 
              image: `${environment.serverUrl}/files/${a.path}`, 
              icon: this._catalogsService.setIconName(a.fileType), 
            }            
          });
          this.updatingCount++
        }
        this.moldsCurrentSelection = [];
        this.translationChanged = false;
        this.imageChanged = false;
        this.storedTranslations = JSON.parse(JSON.stringify(this.checklistTemplate.translations));        
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.checklistTemplate.translations.length > 0 ? $localize`Traducciones (${this.checklistTemplate.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.checklistTemplate.translations.length > 0 ? 'accent' : '';   
        this.pendingRecord = 0;        
        this.updateFormFromData();
        this.changeInactiveButton(this.checklistTemplate.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = this.checklistTemplate.translations.length > 0 ? $localize`Traducciones (${this.checklistTemplate.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = this.checklistTemplate.translations.length > 0 ? 'accent' : '';
        }        
        this.molds.items = [];
        this.requestMoldsData(0);
        this.loaded = true;
        setTimeout(() => {
          this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        }, 1000);        
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklistTemplate.attachments);        
        this.setAttachmentLabel();
        this.setViewLoading(false);        
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
  }  

  mapChecklistTemplatesDetailAttachments$(processId: number): Observable<any> {
    return this._catalogsService.getAttachmentsDataGql$({
      processId,
      process: originProcess.CATALOGS_CHECKLIST_TEMPLATE_LINES_ATTACHMENTS,
      customerId: 1, //TODO get Customer from user profile
    });
  }
    
  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === SystemTables.CHECKLIST_TEMPLATE_TYPES) {
      if (getMoreDataParams.initArray) {
        this.templateTypes.currentPage = 0;
        this.templateTypes.items = [];
      } else if (!this.templateTypes.pageInfo.hasNextPage) {
        return;
      } else {
        this.templateTypes.currentPage++;
      }
      this.requesttemplateTypessData(        
        this.templateTypes.currentPage,
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
    } else if (getMoreDataParams.catalogName === SystemTables.USERS) {
      if (getMoreDataParams.initArray) {
        this.approvers.currentPage = 0;
        this.approvers.items = [];
      } else if (!this.approvers.pageInfo.hasNextPage) {
        return;
      } else {
        this.approvers.currentPage++;
      }
      this.requestApproversData(        
        this.approvers.currentPage,
        getMoreDataParams.textToSearch,  
      ); 
    }     
  }

  onFileSelected(event: any) {
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/checklist-templates`)
    .set('processId', this.checklistTemplate.id)
    .set('process', originProcess.CATALOGS_CHECKLIST_TEMPLATES);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.imageChanged = true;
        this.checklistTemplateForm.controls.mainImageName.setValue(res.fileName);
        this.checklistTemplate.mainImagePath = res.filePath;
        this.checklistTemplate.mainImageGuid = res.fileGuid;
        this.checklistTemplate.mainImage = `${environment.uploadFolders.completePathToFiles}/${res.filePath}`;
        const message = $localize`El archivo ha sido subido satisfactoriamente<br>Guarde la plantilla de checklist para aplicar el cambio`;
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
    if (this.elements.length === 0 || !this.loaded) return;
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
    this.checklistTemplateForm.patchValue({
      name: this.checklistTemplate.name,
      reference: this.checklistTemplate.reference,      
      prefix: this.checklistTemplate.prefix,      
      notes: this.checklistTemplate.notes,      
      templateType: this.checklistTemplate.templateType,
      molds: this.checklistTemplate.molds,    
      allowDiscard: this.checklistTemplate.allowDiscard,
      mainImageName: this.checklistTemplate.mainImageName,            
      approver: this.checklistTemplate.approver,      
      timeToFill: this.checklistTemplate.timeToFill,

      allowRejection: this.checklistTemplate.allowRejection,
      allowManualMode: this.checklistTemplate.allowManualMode,
      allowPartialSaving: this.checklistTemplate.allowPartialSaving,
      allowApprovalByGroup: this.checklistTemplate.allowApprovalByGroup,
      allowExpiring: this.checklistTemplate.allowExpiring,
      allowAlarm: this.checklistTemplate.allowAlarm,
      requiresApproval: this.checklistTemplate.requiresApproval,
      cancelOpenChecklists: this.checklistTemplate.cancelOpenChecklists,
      allowReassignment: this.checklistTemplate.allowReassignment,
      requiresActivation: this.checklistTemplate.requiresActivation,
      allowRestarting: this.checklistTemplate.allowRestarting,
      
      expiringMessageSubject: this.checklistTemplate.expiringMessageSubject,
      expiringMessageBody: this.checklistTemplate.expiringMessageBody,
      expiringNotificationMode: this.checklistTemplate.expiringNotificationMode,
      expiringChannels: this.checklistTemplate.expiringChannels,
      notifyExpiring: this.checklistTemplate.notifyExpiring,
      
      notifyAlarm: this.checklistTemplate.notifyAlarm,
      alarmNotificationMode: this.checklistTemplate.alarmNotificationMode,
      alarmNotificationChannels: this.checklistTemplate.alarmNotificationChannels,
      alarmNotificationMessageSubject: this.checklistTemplate.alarmNotificationMessageSubject,
      alarmNotificationMessageBody: this.checklistTemplate.alarmNotificationMessageBody,
      
      approvalNotificationMode: this.checklistTemplate.approvalNotificationMode,
      approvalRequestChannels: this.checklistTemplate.approvalRequestChannels,
      approvalRequestMessageSubject: this.checklistTemplate.approvalRequestMessageSubject,
      approvalRequestMessageBody: this.checklistTemplate.approvalRequestMessageBody,
      notifyApproval: this.checklistTemplate.notifyApproval,
      
      anticipationMessageSubject: this.checklistTemplate.anticipationMessageSubject,
      anticipationNotificationMode: this.checklistTemplate.anticipationNotificationMode,
      anticipationChannels: this.checklistTemplate.anticipationChannels,
      anticipationMessageBody: this.checklistTemplate.anticipationMessageBody,
      notifyAnticipation: this.checklistTemplate.notifyAnticipation,
      anticipationSeconds: this.checklistTemplate.anticipationSeconds,
      
      notifyGeneration: this.checklistTemplate.notifyGeneration,
      generationNotificationMode: this.checklistTemplate.generationNotificationMode,
      generationChannels: this.checklistTemplate.generationChannels,
      generationMessageSubject: this.checklistTemplate.generationMessageSubject,
      generationMessageBody: this.checklistTemplate.generationMessageBody,      
      moldStates: this.checklistTemplate.moldStates,
      expiringRecipient: this.checklistTemplate.expiringRecipient,
      approvalRecipient: this.checklistTemplate.approvalRecipient,
      alarmRecipient: this.checklistTemplate.alarmRecipient,
      anticipationRecipient: this.checklistTemplate.anticipationRecipient,
      generationRecipient: this.checklistTemplate.generationRecipient,
      
    });
    this.updateMultiSelections('all');
  } 

  prepareRecordToSave(newRecord: boolean): any {
    const fc = this.checklistTemplateForm.controls;

    const expiringNotificationMode = this.expiringNotificationMode.items.filter((n) => n.selected).map((n) => n.value).join();
    const expiringChannels = this.expiringChannels.items.filter((n) => n.selected).map((n) => n.value).join();
    const anticipationNotificationMode = this.anticipationNotificationMode.items.filter((n) => n.selected).map((n) => n.value).join();
    const anticipationChannels = this.anticipationChannels.items.filter((n) => n.selected).map((n) => n.value).join();
    const generationNotificationMode = this.generationNotificationMode.items.filter((n) => n.selected).map((n) => n.value).join();
    const generationChannels = this.generationChannels.items.filter((n) => n.selected).map((n) => n.value).join();
    const approvalNotificationMode = this.approvalNotificationMode.items.filter((n) => n.selected).map((n) => n.value).join();
    const approvalRequestChannels = this.approvalRequestChannels.items.filter((n) => n.selected).map((n) => n.value).join();
    const alarmNotificationMode = this.alarmNotificationMode.items.filter((n) => n.selected).map((n) => n.value).join();
    const alarmNotificationChannels = this.alarmNotificationChannels.items.filter((n) => n.selected).map((n) => n.value).join();  
    const states = this.states.items.filter((n) => n.selected).map((n) => n.value).join();

    return  {
        id: this.checklistTemplate.id,
        customerId: 1, // TODO: Get from profile
        status: newRecord ? RecordStatus.ACTIVE : this.checklistTemplate.status,        
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.prefix.dirty || fc.prefix.touched || newRecord) && { prefix: fc.prefix.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.templateType.dirty || fc.templateType.touched || newRecord) && { templateTypeId: fc.templateType.value ? fc.templateType.value.id : null },
      ...(fc.timeToFill.dirty || fc.timeToFill.touched || newRecord) && { timeToFill: fc.timeToFill.value ? +fc.timeToFill.value : null },
      ...(fc.approver.dirty || fc.approver.touched || newRecord) && { approverId: fc.approver.value ? fc.approver.value.id : null },            

      ...(fc.allowDiscard.dirty || fc.allowDiscard.touched || newRecord) && { allowDiscard: fc.allowDiscard.value },
      ...(fc.allowRejection.dirty || fc.allowRejection.touched || newRecord) && { allowRejection: fc.allowRejection.value },
      ...(fc.allowManualMode.dirty || fc.allowManualMode.touched || newRecord) && { allowManualMode: fc.allowManualMode.value },
      ...(fc.allowPartialSaving.dirty || fc.allowPartialSaving.touched || newRecord) && { allowPartialSaving: fc.allowPartialSaving.value },
      ...(fc.allowApprovalByGroup.dirty || fc.allowApprovalByGroup.touched || newRecord) && { allowApprovalByGroup: fc.allowApprovalByGroup.value },
      ...(fc.allowExpiring.dirty || fc.allowExpiring.touched || newRecord) && { allowExpiring: fc.allowExpiring.value },
      ...(fc.allowAlarm.dirty || fc.allowAlarm.touched || newRecord) && { allowAlarm: fc.allowAlarm.value },
      ...(fc.requiresApproval.dirty || fc.requiresApproval.touched || newRecord) && { requiresApproval: fc.requiresApproval.value },
      ...(fc.cancelOpenChecklists.dirty || fc.cancelOpenChecklists.touched || newRecord) && { cancelOpenChecklists: fc.cancelOpenChecklists.value },
      ...(fc.requiresApproval.dirty || fc.requiresApproval.touched || newRecord) && { requiresApproval: fc.requiresApproval.value },
      ...(fc.notifyExpiring.dirty || fc.notifyExpiring.touched || newRecord) && { notifyExpiring: fc.notifyExpiring.value },
      ...(fc.notifyAlarm.dirty || fc.notifyAlarm.touched || newRecord) && { notifyAlarm: fc.notifyAlarm.value },
      ...(fc.notifyAnticipation.dirty || fc.notifyAnticipation.touched || newRecord) && { notifyAnticipation: fc.notifyAnticipation.value },
      ...(fc.anticipationSeconds.dirty || fc.anticipationSeconds.touched || newRecord) && { anticipationSeconds: fc.anticipationSeconds.value ? +fc.anticipationSeconds.value : null },
      ...(fc.notifyApproval.dirty || fc.notifyApproval.touched || newRecord) && { notifyApproval: fc.notifyApproval.value },
      ...(fc.notifyGeneration.dirty || fc.notifyGeneration.touched || newRecord) && { notifyGeneration: fc.notifyGeneration.value },
      ...(fc.allowReassignment.dirty || fc.allowReassignment.touched || newRecord) && { allowReassignment: fc.allowReassignment.value },
      ...(fc.requiresActivation.dirty || fc.requiresActivation.touched || newRecord) && { requiresActivation: fc.requiresActivation.value },
      ...(fc.allowRestarting.dirty || fc.allowRestarting.touched || newRecord) && { allowRestarting: fc.allowRestarting.value },
      
      ...(fc.expiringMessageSubject.dirty || fc.expiringMessageSubject.touched || newRecord) && { expiringMessageSubject: fc.expiringMessageSubject.value },
      ...(fc.expiringMessageBody.dirty || fc.expiringMessageBody.touched || newRecord) && { expiringMessageBody: fc.expiringMessageBody.value },      
      ...(fc.expiringRecipient.dirty || fc.expiringRecipient.touched || newRecord) && { expiringRecipientId: fc.expiringRecipient.value ? fc.expiringRecipient.value.id : null },      
      
      ...(this.checklistTemplate?.expiringChannels !== expiringChannels || newRecord) && { expiringChannels },      
      ...(this.checklistTemplate?.expiringNotificationMode !== expiringNotificationMode || newRecord) && { expiringNotificationMode },
      

      ...(this.checklistTemplate?.moldStates !== states || newRecord) && { moldStates: states },
      ...(fc.molds.dirty || fc.molds.touched || newRecord) && { molds: fc.molds.value },
      
      
      ...(fc.alarmNotificationMessageSubject.dirty || fc.alarmNotificationMessageSubject.touched || newRecord) && { alarmNotificationMessageSubject: fc.alarmNotificationMessageSubject.value },
      ...(fc.alarmNotificationMessageBody.dirty || fc.alarmNotificationMessageBody.touched || newRecord) && { alarmNotificationMessageBody: fc.alarmNotificationMessageBody.value },
      ...(fc.alarmRecipient.dirty || fc.alarmRecipient.touched || newRecord) && { alarmRecipientId: fc.alarmRecipient.value ? fc.alarmRecipient.value.id : null },      

      ...(this.checklistTemplate?.alarmNotificationMode !== alarmNotificationMode || newRecord) && { alarmNotificationMode },      
      ...(this.checklistTemplate?.alarmNotificationChannels !== alarmNotificationChannels || newRecord) && { alarmNotificationChannels },
      
      
      ...(fc.anticipationMessageSubject.dirty || fc.anticipationMessageSubject.touched || newRecord) && { anticipationMessageSubject: fc.anticipationMessageSubject.value },
      ...(fc.anticipationMessageBody.dirty || fc.anticipationMessageBody.touched || newRecord) && { anticipationMessageBody: fc.anticipationMessageBody.value },
      ...(fc.anticipationRecipient.dirty || fc.anticipationRecipient.touched || newRecord) && { anticipationRecipientId: fc.anticipationRecipient.value ? fc.anticipationRecipient.value.id : null },      

      ...(this.checklistTemplate?.anticipationNotificationMode !== anticipationNotificationMode || newRecord) && { anticipationNotificationMode },      
      ...(this.checklistTemplate?.anticipationChannels !== anticipationChannels || newRecord) && { anticipationChannels },
      
      
      ...(fc.generationMessageSubject.dirty || fc.generationMessageSubject.touched || newRecord) && { generationMessageSubject: fc.generationMessageSubject.value },
      ...(fc.generationMessageBody.dirty || fc.generationMessageBody.touched || newRecord) && { generationMessageBody: fc.generationMessageBody.value },
      ...(fc.generationRecipient.dirty || fc.generationRecipient.touched || newRecord) && { generationRecipientId: fc.generationRecipient.value ? fc.generationRecipient.value.id : null },      

      ...(this.checklistTemplate?.generationNotificationMode !== generationNotificationMode || newRecord) && { generationNotificationMode },      
      ...(this.checklistTemplate?.generationChannels !== generationChannels || newRecord) && { generationChannels },
      
      ...(fc.approvalRequestMessageSubject.dirty || fc.approvalRequestMessageSubject.touched || newRecord) && { approvalRequestMessageSubject: fc.approvalRequestMessageSubject.value },
      ...(fc.approvalRequestMessageBody.dirty || fc.approvalRequestMessageBody.touched || newRecord) && { approvalRequestMessageBody: fc.approvalRequestMessageBody.value },
      ...(fc.approvalRecipient.dirty || fc.approvalRecipient.touched || newRecord) && { approvalRecipientId: fc.approvalRecipient.value ? fc.approvalRecipient.value.id : null },      
      
      ...(this.checklistTemplate?.approvalNotificationMode !== approvalNotificationMode || newRecord) && { approvalNotificationMode },      
      ...(this.checklistTemplate?.approvalRequestChannels !== approvalRequestChannels || newRecord) && { approvalRequestChannels },
      
     
      ...(this.imageChanged) && { 
        mainImageName: fc.mainImageName?.value,
        mainImagePath: this.checklistTemplate.mainImagePath,
        mainImageGuid: this.checklistTemplate.mainImageGuid, },
    }
  }
  
  removeImage() {
    this.imageChanged = true;
    this.checklistTemplateForm.controls.mainImageName.setValue('');
    this.checklistTemplate.mainImagePath = '';
    this.checklistTemplate.mainImageGuid = '';
    this.checklistTemplate.mainImage = '';     
    const message = $localize`Se ha quitado la imagen de la plantilla de checklist<br>Guardel la plantilla de checklist para aplicar el cambio`;
    this._sharedService.showSnackMessage({
      message,
      duration: 5000,
      snackClass: 'snack-primary',
      icon: 'check',
    });
    this.setEditionButtonsState();
  }

  
  initForm(): void {
    this.checklistTemplateForm.reset();    
    this.checklistTemplateForm.controls.molds.setValue('');       
    this.multipleSearchDefaultValue = '';
    this.storedTranslations = [];
    this.storedLines = [];
    this.translationChanged = false;
    this.checklistTemplate = emptyChecklistTemplateItem;
    this.checklistTemplateLines = [];
    this.checklistTemplateLineForms = [];

    // Default values
    this.checklistTemplateForm.controls.timeToFill.setValue(null);
    this.checklistTemplateForm.controls.anticipationSeconds.setValue(null);    
    this.checklistTemplateForm.controls.allowAlarm.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.allowDiscard.setValue(GeneralValues.NO);        
    this.checklistTemplateForm.controls.allowRejection.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.allowManualMode.setValue(GeneralValues.NO);    
    this.checklistTemplateForm.controls.allowPartialSaving.setValue(GeneralValues.NO);        
    this.checklistTemplateForm.controls.allowApprovalByGroup.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.allowExpiring.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.allowAlarm.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.requiresApproval.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.notifyExpiring.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.cancelOpenChecklists.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.notifyAlarm.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.notifyAnticipation.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.notifyApproval.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.notifyGeneration.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.allowReassignment.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.requiresActivation.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.allowReassignment.setValue(GeneralValues.NO);
    this.checklistTemplateForm.controls.allowRestarting.setValue(GeneralValues.NO);
        
    this.focusThisField = 'name';
    this.molds.items = [];
    this.requestMoldsData(0);
    this.moldsCurrentSelection = [];  
    
    this.updateMultiSelections('all');
        
    setTimeout(() => {
      this.catalogEdition.nativeElement.scrollIntoView({            
        behavior: 'smooth',
        block: 'start',
      });   
      this.focusThisField = '';
    }, 200);
  }

  updateMultiSelections(channel: string) {
    if (channel === 'all' || channel === 'expiring') {
      const selectedChannels = this.checklistTemplate.expiringChannels?.split(',');
      for (const item of this.expiringChannels.items) {
        item.selected = selectedChannels.includes(item.value);
      }
      this.expiringChannelsSelected = this.expiringChannels.items.filter(r => r.selected).length;

      const selectedModes = this.checklistTemplate.expiringNotificationMode?.split(',');
      for (const item of this.expiringNotificationMode.items) {
        item.selected = selectedModes.includes(item.value);
      }
      this.expiringNotificationModeSelected = this.expiringNotificationMode.items.filter(r => r.selected).length;
    }

    if (channel === 'all' || channel === 'alarm') {
      const selectedChannels = this.checklistTemplate.alarmNotificationChannels?.split(',');
      for (const item of this.alarmNotificationChannels.items) {
        item.selected = selectedChannels.includes(item.value);
      }
      this.alarmNotificationChannelsSelected = this.alarmNotificationChannels.items.filter(r => r.selected).length;

      const selectedModes = this.checklistTemplate.alarmNotificationMode?.split(',');
      for (const item of this.alarmNotificationMode.items) {
        item.selected = selectedModes.includes(item.value);
      }
      this.alarmNotificationModeSelected = this.alarmNotificationMode.items.filter(r => r.selected).length;
    }
    if (channel === 'all' || channel === 'approval') {
      const selectedChannels = this.checklistTemplate.approvalRequestChannels?.split(',');
      for (const item of this.approvalRequestChannels.items) {
        item.selected = selectedChannels.includes(item.value);
      }
      this.approvalRequestChannelsSelected = this.approvalNotificationMode.items.filter(r => r.selected).length;

      const selectedModes = this.checklistTemplate.approvalNotificationMode?.split(',');
      for (const item of this.approvalNotificationMode.items) {
        item.selected = selectedModes.includes(item.value);
      }
      this.approvalNotificationModeSelected = this.approvalNotificationMode.items.filter(r => r.selected).length;
    }
    if (channel === 'all' || channel === 'generation') {
      const selectedChannels = this.checklistTemplate.generationChannels?.split(',');
      for (const item of this.generationChannels.items) {
        item.selected = selectedChannels.includes(item.value);
      }
      this.generationChannelsSelected = this.generationChannels.items.filter(r => r.selected).length;

      const selectedModes = this.checklistTemplate.generationNotificationMode?.split(',');
      for (const item of this.generationNotificationMode.items) {
        item.selected = selectedModes.includes(item.value);
      }
      this.generationNotificationModeSelected = this.generationNotificationMode.items.filter(r => r.selected).length;
    }
    if (channel === 'all' || channel === 'anticipation') {
      const selectedChannels = this.checklistTemplate.anticipationChannels?.split(',');
      for (const item of this.anticipationChannels.items) {
        item.selected = selectedChannels.includes(item.value);
      }
      this.anticipationChannelsSelected = this.anticipationChannels.items.filter(r => r.selected).length;

      const selectedModes = this.checklistTemplate.anticipationNotificationMode?.split(',');
      for (const item of this.anticipationNotificationMode.items) {
        item.selected = selectedModes.includes(item.value);
      }
      this.anticipationNotificationModeSelected = this.anticipationNotificationMode.items.filter(r => r.selected).length;
    }

    if (channel === 'all' || channel === 'states') {
      const selectedStates = this.checklistTemplate.moldStates?.split(',');
      for (const item of this.states.items) {
        item.selected = selectedStates.includes(item.value);
      }
      this.statesSelected = this.states.items.filter(r => r.selected).length;
      if (!this.checklistTemplate.moldStates) {
        const elvis =1;
      }
      
    }
  }

  initUniqueField(): void {
    this.checklistTemplate.id = null;
    this.checklistTemplate.createdBy = null;
    this.checklistTemplate.createdAt = null;
    this.checklistTemplate.updatedBy = null;
    this.checklistTemplate.updatedAt = null; 
    this.checklistTemplate.status = RecordStatus.ACTIVE; 
    this.checklistTemplate.translations.map((t) => {
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
      return $localize`Descripción o nombre de la la plantilla de checklist`
    } else if (fieldControlName === 'templateType') {
      return $localize`Tipo de plantilla`
    } else if (fieldControlName === 'recipient') {
      return $localize`Recipiente`
    } else if (fieldControlName === 'approver') {
      return $localize`Aprobador`;
    }        
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION,
      loading,
    ); 
  }

  validateTables(): void {
    if (this.checklistTemplateForm.controls.templateType.value && this.checklistTemplateForm.controls.templateType.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.templateType.setErrors({ inactive: true });   
    } else {
      this.checklistTemplateForm.controls.templateType.setErrors(null);         
    }
    if (this.checklistTemplateForm.controls.notifyExpiring.value === GeneralValues.YES && this.checklistTemplateForm.controls.expiringRecipient.value && this.checklistTemplateForm.controls.expiringRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.expiringRecipient.setErrors({ inactive: true });   
    } else {
      this.checklistTemplateForm.controls.expiringRecipient.setErrors(null);         
    }
    if (this.checklistTemplateForm.controls.notifyAnticipation.value === GeneralValues.YES && this.checklistTemplateForm.controls.anticipationRecipient.value && this.checklistTemplateForm.controls.anticipationRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.anticipationRecipient.setErrors({ inactive: true });   
    } else {
      this.checklistTemplateForm.controls.anticipationRecipient.setErrors(null);         
    }
    if (this.checklistTemplateForm.controls.notifyGeneration.value === GeneralValues.YES && this.checklistTemplateForm.controls.generationRecipient.value && this.checklistTemplateForm.controls.generationRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.generationRecipient.setErrors({ inactive: true });   
    } else {
      this.checklistTemplateForm.controls.generationRecipient.setErrors(null);         
    }
    if (this.checklistTemplateForm.controls.notifyApproval.value === GeneralValues.YES && this.checklistTemplateForm.controls.approvalRecipient.value && this.checklistTemplateForm.controls.approvalRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.approvalRecipient.setErrors({ inactive: true });   
    } else {
      this.checklistTemplateForm.controls.approvalRecipient.setErrors(null);         
    }
    if (this.checklistTemplateForm.controls.notifyAlarm.value === GeneralValues.YES && this.checklistTemplateForm.controls.alarmRecipient.value && this.checklistTemplateForm.controls.alarmRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.alarmRecipient.setErrors({ inactive: true });   
    } else {
      this.checklistTemplateForm.controls.alarmRecipient.setErrors(null);         
    }    
    if (this.checklistTemplateForm.controls.approver.value && this.checklistTemplateForm.controls.approver.value && this.checklistTemplateForm.controls.approver.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.approver.setErrors({ inactive: true });   
    } else {
      this.checklistTemplateForm.controls.approver.setErrors(null);   
    }
  }

  processTranslations$(checklistTemplateId: number): Observable<any> { 
    const differences = this.storedTranslations.length !== this.checklistTemplate.translations.length || this.storedTranslations.some((st: any) => {
      return this.checklistTemplate.translations.find((t: any) => {        
        return st.languageId === t.languageId &&
        st.id === t.id &&
        (st.reference !== t.reference || 
        st.approvalRequestMessageSubject !== t.approvalRequestMessageSubject || 
        st.approvalRequestMessageBody !== t.approvalRequestMessageBody || 
        st.anticipationMessageSubject !== t.anticipationMessageSubject || 
        st.anticipationMessageBody !== t.anticipationMessageBody || 
        st.expiringMessageSubject !== t.expiringMessageSubject || 
        st.expiringMessageBody !== t.expiringMessageBody || 
        st.alarmNotificationMessageSubject !== t.alarmNotificationMessageSubject || 
        st.alarmNotificationMessageBody !== t.alarmNotificationMessageBody || 
        st.generationMessageSubject !== t.generationMessageSubject || 
        st.generationMessageBody !== t.generationMessageBody || 
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
      const translationsToAdd = this.checklistTemplate.translations.map((t: any) => {
        return {
          id: null,
          checklistTemplateId,
          name: t.name,
          reference: t.reference,
          notes: t.notes,
          approvalRequestMessageSubject: t.approvalRequestMessageSubject,
          approvalRequestMessageBody: t.approvalRequestMessageBody,
          anticipationMessageSubject: t.anticipationMessageSubject,
          anticipationMessageBody: t.anticipationMessageBody,
          expiringMessageSubject: t.expiringMessageSubject,
          expiringMessageBody: t.expiringMessageBody,
          alarmNotificationMessageSubject: t.alarmNotificationMessageSubject,
          alarmNotificationMessageBody: t.alarmNotificationMessageBody,
          generationMessageSubject: t.generationMessageSubject,
          generationMessageBody: t.generationMessageBody,
          languageId: t.languageId,
          customerId: 1, // TODO: Get from profile
          status: RecordStatus.ACTIVE,
        }
      });
      const varToAdd = {
        translations: translationsToAdd,
      }
  
      return combineLatest([ 
        varToAdd.translations.length > 0 ? this._catalogsService.updateChecklistTemplateTranslations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteChecklistTemplateTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

  handleVariableMoveToFirst(id: number) {
    const order = this.checklistTemplateLines[id].order;
    for (const line of this.checklistTemplateLines) {      
      if (line.order < order) {
        line.order++;
      }       
    }
    this.checklistTemplateLines[id].order = 0;
    this.movedVariable = this.checklistTemplateLines[id].order;
    setTimeout(() => {
      this.movedVariable = -1;
    }, 250);
  }

  handleVariableMoveToUp(id: number) {
    const order = this.checklistTemplateLines[id].order - 1;
    for (const line of this.checklistTemplateLines) {      
      if (line.order === order && line.line != id) {
        line.order++;
      }
    }
    this.checklistTemplateLines[id].order = order;
    this.movedVariable = this.checklistTemplateLines[id].order;
    setTimeout(() => {
      this.movedVariable = -1;
    }, 250);
  }

  handleVariableMoveToDown(id: number) {
    const order = this.checklistTemplateLines[id].order + 1;
    for (const line of this.checklistTemplateLines) {      
      if (line.order === order && line.line != id) {
        line.order--;
      }
    }
    this.checklistTemplateLines[id].order = order;
    this.movedVariable = this.checklistTemplateLines[id].order;
    setTimeout(() => {
      this.movedVariable = -1;
    }, 250);
  }  

  handleVariableMoveToLast(id: number) {
    const order = this.checklistTemplateLines[id].order;
    for (const line of this.checklistTemplateLines) {      
      if (line.order > order) {
        line.order--;
      }
    }
    this.checklistTemplateLines[id].order = this.checklistTemplateLines.length - 1;
    this.movedVariable = this.checklistTemplateLines[id].order;
    setTimeout(() => {
      this.movedVariable = -1;
    }, 250);
  }
  
  setEditionButtonsState() {
    if (!this.checklistTemplate.id || this.checklistTemplate.id === null || this.checklistTemplate.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }

  handleAttachmentMoveToFirst(id: number) {
    const valueIndex = this.checklistTemplate.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.checklistTemplate.attachments[valueIndex]));
    this.checklistTemplate.attachments.splice(valueIndex, 1);
    this.checklistTemplate.attachments.unshift({
      index: 0,
      name: tmpValue.name,
      image: tmpValue.image,
      id: tmpValue.id,
      icon: tmpValue.icon,      
    })
    let index = 0;
    this.checklistTemplate.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklistTemplate.attachments);    
    this.setEditionButtonsState();
  }

  handleAttachmentMoveToLast(id: number) {
    const valueIndex = this.checklistTemplate.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.checklistTemplate.attachments[valueIndex]));
    this.checklistTemplate.attachments.splice(valueIndex, 1);
    this.checklistTemplate.attachments.push({
      index: 0,
      name: tmpValue.name,
      image: tmpValue.image,
      id: tmpValue.id,
      icon: tmpValue.icon,      
    })
    let index = 0;
    this.checklistTemplate.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklistTemplate.attachments);    
    this.setEditionButtonsState();
  }

  handleAttachmentMoveToUp(id: number) {
    const valueIndex = this.checklistTemplate.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.checklistTemplate.attachments[valueIndex]));
    const editingItem = this.checklistTemplate.attachments[valueIndex - 1];

    if (editingItem) {      
      this.checklistTemplate.attachments[valueIndex].name = editingItem.name;
      this.checklistTemplate.attachments[valueIndex].id = editingItem.id;
      this.checklistTemplate.attachments[valueIndex].icon = editingItem.icon;
      this.checklistTemplate.attachments[valueIndex].image = editingItem.image;

      editingItem.name = tmpValue.name;
      editingItem.id = tmpValue.id;
      editingItem.icon = tmpValue.icon;
      editingItem.image = tmpValue.image;
      
      this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklistTemplate.attachments);    
      this.setEditionButtonsState();      
    }
  }

  handleAttachmentMoveToDown(id: number) {
    const valueIndex = this.checklistTemplate.attachments.findIndex((v: Attachment) => v.index === id);
    const tmpValue = JSON.parse(JSON.stringify(this.checklistTemplate.attachments[valueIndex]));
    const editingItem = this.checklistTemplate.attachments[valueIndex + 1];
    
    if (editingItem) {      
      this.checklistTemplate.attachments[valueIndex].name = editingItem.name;
      this.checklistTemplate.attachments[valueIndex].image = editingItem.image;
      this.checklistTemplate.attachments[valueIndex].id = editingItem.id;
      this.checklistTemplate.attachments[valueIndex].icon = editingItem.icon;      

      editingItem.name = tmpValue.name;
      editingItem.id = tmpValue.id;
      editingItem.icon = tmpValue.icon;      
      editingItem.image = tmpValue.image;      
      
      this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklistTemplate.attachments);    
      this.setEditionButtonsState();      
    }
  }

  handleAttachmentRemove(id: number) {
    const valueIndex = this.checklistTemplate.attachments.findIndex((v: Attachment) => v.index === id);
    this.checklistTemplate.attachments.splice(valueIndex, 1);
    let index = 0;
    this.checklistTemplate.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklistTemplate.attachments);
    this.setAttachmentLabel();
    this.setEditionButtonsState();
  }

  messageMaxAttachment() {
    this.addAttachmentButtonClick = true;    
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`Máximo de adjuntos alcanzado`,  
        topIcon: 'warn_fill',
        defaultButtons: dialogByDefaultButton.ACCEPT,
        buttons: [],
        body: {
          message: $localize`Se ha alcanzado el límite de adjuntos para plantilla de checklist ${this.settingsData?.attachments?.variables ?? 10}.`,
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
    .set('destFolder', `${environment.uploadFolders.catalogs}/checklist-templates-headers`)
    .set('processId', this.checklistTemplate.id)
    .set('process', originProcess.CATALOGS_CHECKLIST_TEMPLATE_HEADER_ATTACHMENTS);
    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        const message = $localize`El adjunto ha sido subido satisfactoriamente<br>`;
        this._sharedService.showSnackMessage({
          message,
          duration: 3000,
          snackClass: 'snack-primary',
          icon: 'check',
        });
        this.checklistTemplate.attachments.push({
          index: this.checklistTemplate.attachments.length,
          name: res.fileName, 
          id: res.fileGuid, 
          image: `${environment.serverUrl}/files/${res.filePath}`, 
          icon: this._catalogsService.setIconName(res.fileType), 
        })
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklistTemplate.attachments);    
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
        topIcon: 'garbage_can',
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
        this.checklistTemplate.attachments = [];
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklistTemplate.attachments);    
        this.setEditionButtonsState();
        this.setAttachmentLabel();
      }
    });       
  }
    

  setAttachmentLabel() {
    if (this.checklistTemplate.attachments.length === 0) {
      this.checklistTemplateAttachmentLabel = $localize`Este registro no tiene adjuntos...`;
    } else {
      this.checklistTemplateAttachmentLabel = $localize`Este registro tiene ${this.checklistTemplate.attachments.length} adjunto(s)...`;
    }    
  }

  handleAttachmentDownload(id: number) {

    // let a = document.createElement("a")
    // a.download = this.checklistTemplate.attachments[id].name;
    // a.href = this.checklistTemplate.attachments[id].image;
    // a.click();
    // a.remove();

   
    
    
    const downloadUrl = `${environment.apiDownloadUrl}`;
    const params = new HttpParams()
    .set('fileName', this.checklistTemplate.attachments[id].image.replace(`${environment.serverUrl}/files/`, ''))
    this.downloadFiles = this._http.get(downloadUrl, { params, responseType: 'blob' }).subscribe((res: any) => {
      if (res) {
        let url = window.URL.createObjectURL(res);
        let link = document.createElement("a"); 
        link.download = this.checklistTemplate.attachments[id].name;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();    
      }      
    });
  }

  duplicateAttachments() {
    if (this.checklistTemplate.attachments.length === 0) return

    const files = this.checklistTemplate.attachments.map((a) => a.id);
    this.duplicateAttachmentsList$ = this._catalogsService.duplicateAttachmentsList$(originProcess.CATALOGS_CHECKLIST_TEMPLATE_HEADER_ATTACHMENTS, files)
    .pipe(
      tap((newAttachments) => {
        if (newAttachments.length !== this.checklistTemplate.attachments.length) {
          const message = $localize`No se pudieron duplicar todos los adjuntos...`;
          this._sharedService.showSnackMessage({
            message,
            snackClass: 'snack-warn',
            progressBarColor: 'warn',
            icon: 'delete',
          });
        }
        let line = 0;
        this.checklistTemplate.attachments = newAttachments.map(na => {
          return {
            index: line++,
            name: na.fileName, 
            image: `${environment.serverUrl}/files/${na.path}`, 
            id: na.fileId, 
            icon: this._catalogsService.setIconName(na.fileType), 
          }
        });
      })

    )
  }
  
  markLinesAsNew() {
    this.checklistTemplateLines = this.checklistTemplateLines.map((line) => {
      return {
        ...line,
        id: null,

      }
    })
    this.checklistTemplateLineForms = [];
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

    const processId = !!this.checklistTemplate.id ? this.checklistTemplate.id : 0;
    const variableParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.CHECKLIST_TEMPLATE_MOLDS,
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

  
  handleKeyDown(event: KeyboardEvent) { }

  chengeSelection(event: any) { 
  }


  handleChangeSelection(event: any) { 
    // if (this.formField.disabled) {
     // event.option.selected = false;
    // }
  }

  handleNotifyModesSelectItem(origin: string, formField: FormControl, item: any) {
    if (formField.disabled) return;
    if (formField.value === GeneralValues.YES) {
      item.selected = !item.selected;
      if (origin === 'expiring') {
        this.expiringNotificationModeSelected = this.expiringNotificationMode.items.filter(r => r.selected).length;
      } else if (origin === 'anticipation') {
        this.anticipationNotificationModeSelected = this.anticipationNotificationMode.items.filter(r => r.selected).length;
      } else if (origin === 'generation') {
        this.generationNotificationModeSelected = this.generationNotificationMode.items.filter(r => r.selected).length;
      } else if (origin === 'approval') {
        this.approvalNotificationModeSelected = this.approvalNotificationMode.items.filter(r => r.selected).length;
      } else if (origin === 'alarm') {
        this.alarmNotificationModeSelected = this.alarmNotificationMode.items.filter(r => r.selected).length;
      }      
      this.setEditionButtonsState();
    }
  }

  handleStatesSelectItem(item: any) {
    item.selected = !item.selected;
    this.statesSelected = this.states.items.filter(r => r.selected).length;      
    this.setEditionButtonsState();    
  }

  handleNotifyChannelsSelectItem(origin: string, formField: FormControl, item: any) {
    if (formField.disabled) return;
    if (formField.value === GeneralValues.YES) {
      item.selected = !item.selected;
      if (origin === 'expiring') {
        this.expiringChannelsSelected = this.expiringChannels.items.filter(r => r.selected).length;
      } else if (origin === 'anticipation') {
        this.anticipationChannelsSelected = this.anticipationChannels.items.filter(r => r.selected).length;
      } else if (origin === 'generation') {
        this.generationChannelsSelected = this.generationChannels.items.filter(r => r.selected).length;
      } else if (origin === 'approval') {
        this.approvalRequestChannelsSelected = this.approvalRequestChannels.items.filter(r => r.selected).length;
      } else if (origin === 'alarm') {
        this.alarmNotificationChannelsSelected = this.alarmNotificationChannels.items.filter(r => r.selected).length;
      }      
      this.setEditionButtonsState();
    }
  }

  /* updateSelections(item: any, action: string = '') {
    const originalValueRight = item.valueRight;
    if (action === 'u') {
      item.valueRight = null;
    } else if (action === 's') {
      item.valueRight = item.id;
    } else {
      item.valueRight = !!item.valueRight ? null : item.id;
    }
    
    const itemIndexChanged = this.currentSelections.findIndex(r => r.id === item.id && r.valueRight !== item.valueRight)
    if (itemIndexChanged !== -1) {
      this.currentSelections[itemIndexChanged].valueRight = item.valueRight;
    } else {
      this.currentSelections.push( { id: item.id, valueRight: item.valueRight, originalValueRight, catalogDetailId: item.catalogDetailId });
    }
  } */

  addVariable() {
    this.addVariableButtonClick = true;
    const dialogResponse = this._dialog.open(VariableSelectionDialogComponent, {
      width: '530px',
      disableClose: true,      
      data: {
        checklistTemplateId: this.checklistTemplate.id,
        currentVariables: this.checklistTemplateLines.map((v) => {
          return {
            variableId: v.variableId,
          }
        }), 
        variableId: 0,
        buttons: [],
        title: $localize`Agregar variable a una plantilla de checklist <strong>${this.checklistTemplate.id}</strong>`,
        topIcon: 'equation',                
        showCloseButton: false,
      },
    });
    dialogResponse.afterClosed().subscribe((response) => {
      if (response.action === ButtonActions.OK) {
        this.requestVariableData(response.variableId);
      } else {
        this.addVariableButtonClick = false;
      }
    });    
  }

  requestVariableData(variableId: number, line: number = -1): void { 
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
        this.variable = variableData;
        this.setViewLoading(false);        

        let translatedName = variableData.name;
        if (variableData.translations.length > 0 && variableData.translations.find((t) => t.languageId === 1)) { // TODO: tomar el lenguaje del profile
          translatedName = variableData.translations.find((t) => t.languageId === 1).name;
        }
        
        if (line > -1) {
          const updatedLine: ChecklistTemplateLine = this.checklistTemplateLines[line];
          updatedLine.name = translatedName; 
          updatedLine.validate = false; 
          updatedLine.enabled = true;
          updatedLine.error = false;
          updatedLine.recipient = variableData.recipient;
          updatedLine.uomName = variableData.uom?.['translatedName'] ?? variableData.uom.name;          
          updatedLine.uomPrefix = variableData.uom?.['translatedPrefix'] ?? variableData.uom.prefix;
          updatedLine.required = variableData.required;
          updatedLine.allowComments = variableData.allowComments;
          updatedLine.allowNoCapture = variableData.allowNoCapture;
          updatedLine.allowAlarm = variableData.allowAlarm;
          updatedLine.showChart = variableData.showChart;
          updatedLine.notifyAlarm = variableData.notifyAlarm;
          updatedLine.showNotes = variableData.showNotes;
          updatedLine.minimum = variableData.minimum;          
          updatedLine.uom = variableData.uom;
          updatedLine.notes = variableData.notes;
          updatedLine.maximum = variableData.maximum;
          updatedLine.valueType = variableData.valueType
          updatedLine.byDefault = variableData.byDefault;    
          updatedLine.attachments = variableData.attachments;   
          updatedLine.variableAttachments = variableData.attachments, 
          updatedLine.possibleValue = '';
          updatedLine.possibleValues = variableData.possibleValues;
          updatedLine.byDefaultDateType = variableData.byDefaultDateType;    
          updatedLine.loading = false;
          updatedLine.status = variableData.status;    
          updatedLine.recipientId = variableData.recipientId;
          updatedLine.uomId = variableData.uomId;
            
          this.checklistTemplateLines[line] = updatedLine;
          this._catalogsService.updateCheklistTemplateLineData(line, updatedLine);
          this.checklistTemplateLines[line].loading = false;
        } else {
          const newLine: ChecklistTemplateLine = {
            id: null,
            customerId: 1, // TODO 
            line: this.checklistTemplateLines.length,
            order: this.checklistTemplateLines.length,
            name: translatedName,
            validate: false,
            error: false,
            enabled: true,
            variableId, 
            recipient: variableData.recipient,
            recipientId: variableData.recipientId,
            uomId: variableData.uomId,
            required: variableData.required,
            allowComments: variableData.allowComments,
            allowNoCapture: variableData.allowNoCapture,
            allowAlarm: variableData.allowAlarm,
            showChart: variableData.showChart,
            notifyAlarm: variableData.notifyAlarm,
            valueType: variableData.valueType,
            showNotes: variableData.showNotes,
            minimum: variableData.minimum,
            useVariableAttachments: GeneralValues.YES,
            attachments: [],
            variableAttachments: variableData.attachments,
            uom: variableData.uom,
            uomName: variableData.uom?.['translatedName'] ?? variableData.uom.name,
            uomPrefix: variableData.uom?.['translatedPrefix'] ?? variableData.uom.prefix,
            notes: variableData.notes,
            maximum: variableData.maximum,
            byDefault: variableData.byDefault,
            possibleValue: '',
            possibleValues: variableData.possibleValues,
            byDefaultDateType: variableData.byDefaultDateType,    
            friendlyValueType: variableData.friendlyValueType,
            status: RecordStatus.ACTIVE,
            showLastValue: GeneralValues.NO,
            showParameters: GeneralValues.NO,
            loading: false,
          };
          this.checklistTemplateLines.push(newLine);
          this.checklistTemplateLineForms.push(null);
        }
        this.addVariableButtonClick = false;
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
  }

  handleRefreshVariable(line: number) {
    this.checklistTemplateLines[line].loading = true;
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        defaultAction: ButtonActions.CANCEL,
        title: $localize`ACTUALIZAR LA VARIABLE`,  
        topIcon: 'warn_fill',
        buttons: [{
          action: ButtonActions.OK,
          showIcon: true,
          icon: 'check',
          showCaption: true,
          caption: $localize`Actualizar`,
          showTooltip: true,
          class: 'primary',
          tooltip: $localize`Actualiza los datos de la variable`,
          default: true,
        }, {
          action: ButtonActions.CANCEL,
          showIcon: true,
          icon: 'cancel',
          showCaption: true,
          caption: $localize`Cancelar`,
          showTooltip: true,            
          tooltip: $localize`Cancela la acción`,
          default: false,
        }],
        body: {
          message: $localize`Esta acción actualizará los datos de la variable <strong>${this.checklistTemplateLines[line].name} / línea ${line + 1}</strong> de la plantilla con los valores mas recientes de la variable.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    });
    dialogResponse.afterClosed().subscribe((response) => {
      if (response.action === ButtonActions.OK) {             
        this.requestVariableData(this.checklistTemplateLines[line].variableId, line)
      }
    });
  }

  handleRemoveVariable(line: number) {
    this.checklistTemplateLines[line].loading = true;
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true, 
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        defaultAction: ButtonActions.CANCEL,
        title: $localize`QUITAR VARIABLE DE LA PLANTILLA`,  
        topIcon: 'warn_fill',
        buttons: [{
          action: ButtonActions.OK,
          showIcon: true,
          icon: 'garbage_can',
          showCaption: true,
          caption: $localize`Quitar`,
          showTooltip: true,
          class: 'primary',
          tooltip: $localize`Quita la variable del template de checklist`,
          default: true,
        }, {
          action: ButtonActions.CANCEL,
          showIcon: true,
          icon: 'cancel',
          showCaption: true,
          caption: $localize`Cancelar`,
          showTooltip: true,            
          tooltip: $localize`Cancela la acción`,
          default: false,
        }],
        body: {
          message: $localize`Esta acción eliminará la variable <strong>${this.checklistTemplateLines[line].name} / línea ${line + 1} de la plantilla</strong>.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    });
    dialogResponse.afterClosed().subscribe((response) => {
      if (response.action === ButtonActions.OK) {              
        this.checklistTemplateLines.splice(line, 1); 
        let i = 0;
        for (const line of this.checklistTemplateLines) {
          line.order = i++;
        }
        this.checklistTemplateLineForms.splice(line, 1);         
        const message = $localize`La variable ha sido removida de la plantilla de checklist`;
        this._sharedService.showSnackMessage({
          message,
          snackClass: 'snack-warn',
          progressBarColor: 'warn',
          icon: 'garbage_can',
        });
        this.setEditionButtonsState();
      }
      this.checklistTemplateLines[line].loading = false;
    });
  }

  handleInactivateVariable(line: number) {
    this.checklistTemplateLines[line].loading = true;
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        defaultAction: ButtonActions.CANCEL,
        title: $localize`INACTIVAR LA VARIABLE`,  
        topIcon: 'warn_fill',
        buttons: [{
          action: ButtonActions.OK,
          showIcon: true,
          icon: 'delete',
          showCaption: true,
          caption: $localize`Inactivar`,
          showTooltip: true,
          class: 'primary',
          tooltip: $localize`Inactiva la variable del template de checklist`,
          default: true,
        }, {
          action: ButtonActions.CANCEL,
          showIcon: true,
          icon: 'cancel',
          showCaption: true,
          caption: $localize`Cancelar`,
          showTooltip: true,            
          tooltip: $localize`Cancela la acción`,
          default: false,
        }],
        body: {
          message: $localize`Esta acción inactivará la variable <strong>${this.checklistTemplateLines[line].name} / línea ${line + 1} de la plantilla y ya no estará disponible en la captura del checklist</strong>.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    });
    dialogResponse.afterClosed().subscribe((response) => {
      if (response.action === ButtonActions.OK) {              
        this.checklistTemplateLines[line].status = RecordStatus.INACTIVE;         
        const message = $localize`La variable ha se ha inactivado y ya no estará disponible para el checklist`;
        this._sharedService.showSnackMessage({
          message,
          snackClass: 'snack-primary',
          progressBarColor: 'warn',
          icon: 'delete',
        });
      }
      this.checklistTemplateLines[line].loading = false;
    });
  }

  handleReactivateVariable(line: number) {
    this.checklistTemplateLines[line].loading = true;
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        defaultAction: ButtonActions.CANCEL,
        title: $localize`REACTIVAR VARIABLE`,  
        topIcon: 'warn_fill',
        buttons: [{
          action: ButtonActions.OK,
          showIcon: true,
          icon: 'check',
          showCaption: true,
          caption: $localize`Reactivar`,
          showTooltip: true,
          class: 'primary',
          tooltip: $localize`Reactiva la variable en el template de checklist`,
          default: true,
        }, {
          action: ButtonActions.CANCEL,
          showIcon: true,
          icon: 'cancel',
          showCaption: true,
          caption: $localize`Cancelar`,
          showTooltip: true,            
          tooltip: $localize`Cancela la acción`,
          default: false,
        }],
        body: {
          message: $localize`Esta acción reactivará la variable <strong>${this.checklistTemplateLines[line].name} / línea ${line + 1} de la plantilla y volverá a estar disponible en la captura del checklist</strong>.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    });
    dialogResponse.afterClosed().subscribe((response) => {
      if (response.action === ButtonActions.OK) {              
        this.checklistTemplateLines[line].status = RecordStatus.ACTIVE;      
        const message = $localize`La variable ha se ha reactivado y volverá a estar disponible para el checklist`;
        this._sharedService.showSnackMessage({
          message,
          snackClass: 'snack-primary',
          progressBarColor: 'primary',          
        });
      }
      this.checklistTemplateLines[line].loading = false;
    });
  }

  showErrorDialog(dialogType: string, action: ButtonActions) {
    let dialogMessage = {
      title: '',
      message: '',
    }
    if (dialogType === 'no-lines') {
      dialogMessage = {
        title: $localize`Cambios sin guardar`,
        message: $localize`La Plantilla del Checklist no contiene líneas.`,
      }
    } else if (dialogType === 'save-before') {
      dialogMessage = {
        title: $localize`Cambios sin guardar`,
        message: $localize`Existen cambios sin guardar, primero <strong>cancele la edición actual</strong> y luego reinicie el formulario.`
      }
    }    
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: dialogMessage.title,  
        topIcon: 'warn_fill',
        defaultButtons: dialogByDefaultButton.ACCEPT,
        buttons: [],
        body: {
          message: dialogMessage.message,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe(() => {
      this.elements.find(e => e.action === action).loading = false;
    });   
  }

  requestApproversData(currentPage: number, filterStr: string = null) {    
    this.approvers = {
      ...this.approvers,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }, { "data": { "name": { "contains": "${filterStr}" } } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }
    const skipRecords = this.approvers.items.length;

    const variableParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.approversOrder,
    }    
    const variables = this._sharedService.setGraphqlGen(variableParameters); 
    this.approvers$ = this._catalogsService.getApproversLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const mappedItems = data?.data?.usersPaginated?.items.map((item) => {
          return {
            isTranslated: true,
            translatedName: item.data.name,
            translatedReference: item.data.reference,
            id: item.data.id,
            status: item.data.status,
          }
        })
        this.approvers = {
          ...this.approvers,
          loading: false,
          pageInfo: data?.data?.usersPaginated?.pageInfo,
          items: this.approvers.items?.concat(mappedItems),
          totalCount: data?.data?.usersPaginated?.totalCount,
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
          items: accumulatedItems.map((i) => {
            return {
              ...i,
              selected: false,
            }
          }),
          totalCount: data?.data?.hardcodedValues?.totalCount,
        }        
      }),
      catchError(() => EMPTY)
    )
  }

  handleLineFormChange(event: any) {
    const lineAffected = this.checklistTemplateLines.find((l) => l.line === event.lineNumber);
    if (lineAffected) {
      this.checklistTemplateLineForms[event.lineNumber] = event.formData,        
      this.updateChecklistTemplateLineFromForm(event.lineNumber);
    }    
  }

  updateChecklistTemplateLineFromForm(line: number) {
    const fc = this.checklistTemplateLineForms[line];
    const updatedLine = this.checklistTemplateLines[line];
    if (updatedLine) {
      // updatedLine.name = fc.name.value;
      updatedLine.notes = fc.notes?.value;            
      updatedLine.recipientId = fc.recipient?.value?.id;      
      updatedLine.required = fc.required?.value;
      updatedLine.allowAlarm = fc.allowAlarm?.value;
      updatedLine.allowNoCapture = fc.allowComments?.value;
      updatedLine.allowComments = fc.allowComments?.value;
      updatedLine.showChart = fc.showChart?.value;   
      updatedLine.useVariableAttachments = fc.useVariableAttachments?.value ? GeneralValues.YES : GeneralValues.NO,
      updatedLine.showLastValue = fc.showLastValue?.value;
      updatedLine.showParameters = fc.showParameters?.value;
      updatedLine.notifyAlarm = fc.notifyAlarm?.value;      
      updatedLine.byDefault = fc.byDefault?.value;    
      updatedLine.showNotes = fc.showNotes.value ? GeneralValues.YES : GeneralValues.NO,
      updatedLine.minimum = fc.minimum.value ? fc.minimum.value : null;
      updatedLine.maximum = fc.maximum.value ? fc.maximum.value : null;
      updatedLine.byDefaultDateType = fc.byDefaultDateType?.value;    
      updatedLine.attachmentsList = JSON.stringify(this.checklistTemplateLines[line]?.attachments);
      // updatedLine.valuesList = this.checklistTemplateLines[line]?.valuesList;      
    } else {
      const changedLine = {
        id: this.checklistTemplateLines[line].id,
        customerId: this.checklistTemplateLines[line].customerId,
        order: this.checklistTemplateLines[line].order,
        line: this.checklistTemplateLines[line].line,
        notes: fc.notes?.value,        
        recipientId: fc.recipient?.value?.id,
        required: fc.required?.value,
        allowAlarm: fc.allowAlarm?.value,
        allowNoCapture: fc.allowComments?.value,
        allowComments: fc.allowComments?.value,
        showChart: fc.showChart?.value,
        useVariableAttachments: fc.useVariableAttachments.value ? GeneralValues.YES : GeneralValues.NO,
        showLastValue: fc.showLastValue?.value,
        showParameters: fc.showParameters?.value,
        notifyAlarm: fc.notifyAlarm?.value,        
        byDefault: fc.byDefault?.value,    
        showNotes: fc.showNotes.value ? GeneralValues.YES : GeneralValues.NO,
        minimum: fc.minimum?.value,
        maximum: fc.maximum?.value,
        byDefaultDateType: fc.byDefaultDateType?.value,    
        attachmentsList: JSON.stringify(this.checklistTemplateLines[line]?.attachments),
        // valuesList: this.checklistTemplateLines[line]?.valuesList,        
      }
      this.checklistTemplateLineForms.push(changedLine);
    }
    if (this.loaded) this.setEditionButtonsState();
    
  }

  duplicateMainImage() {    
    this.duplicateMainImage$ = this._catalogsService.duplicateMainImage$(originProcess.CATALOGS_CHECKLIST_TEMPLATES, this.checklistTemplate.mainImageGuid)
    .pipe(
      tap((newAttachments) => {
        if (newAttachments.duplicated) {       
          this.imageChanged = true;   
          this.checklistTemplate.mainImageGuid = newAttachments.mainImageGuid;
          this.checklistTemplate.mainImageName = newAttachments.mainImageName;
          this.checklistTemplate.mainImagePath = newAttachments.mainImagePath;   

          this.checklistTemplate.mainImage = `${environment.uploadFolders.completePathToFiles}/${this.checklistTemplate.mainImagePath}`;
          this.checklistTemplateForm.controls.mainImageName.setValue(this.checklistTemplate.mainImageName);
        }        
      })
    );
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
