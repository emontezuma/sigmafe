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
import { ChecklistTemplateDetail, ChecklistTemplateItem, ChecklistTemplatePossibleValue, emptyChecklistTemplateItem } from '../../models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomValidators } from '../../custom-validators';
import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesItem } from '../../models/catalogs-shared.models';

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
  macros$: Observable<any>;    
  recipients$: Observable<any>;

  moldsCurrentSelection: GeneralMultipleSelcetionItems[] = [];  
  molds: GeneralCatalogData = emptyGeneralCatalogData; 
  molds$: Observable<any>;    
  recipients: GeneralCatalogData = emptyGeneralCatalogData;

  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  checklistTemplate$: Observable<ChecklistTemplateDetail>;
  translations$: Observable<any>;
  updateChecklistTemplate$: Observable<any>;
  updateChecklistTemplateCatalog$: Observable<any>;
  deleteChecklistTemplateTranslations$: Observable<any>;  
  addChecklistTemplateTranslations$: Observable<any>;  
  
  checklistTemplateFormChangesSubscription: Subscription;
  checklistTemplateFieldFormChangesSubscription: Subscription;
  
  templateTypes: GeneralCatalogData = emptyGeneralCatalogData;   
  macros: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  notifyingModes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  notifyingChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  anticipationModes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  anticipationChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  generationModes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  generationChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  approvalModes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  approvalChannels: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  notifyingModesSelected: number = 0;
  notifyingChannelsSelected: number = 0;
  anticipationModesSelected: number = 0;
  anticipationChannelsSelected: number = 0;
  approvalModesSelected: number = 0;
  approvalChannelsSelected: number = 0;
  generationModesSelected: number = 0;
  generationChannelsSelected: number = 0;
  
  valuesList: ChecklistTemplatePossibleValue[] = []; 
  possibleValuesTableColumns: string[] = [ 'item', 'value', 'byDefault', 'alarmedValue', 'actions' ];
  possibleValuesTable = new MatTableDataSource<ChecklistTemplatePossibleValue>([]);
  possibleValuePositions = [
    { id: 'l', description: $localize`Al final de la lista` },  
    { id: 'f', description: $localize`Al prncipio de la lista` }, 
  ];

  attachmentsTableColumns: string[] = [ 'index', 'icon', 'name', 'actions-attachments' ];
  attachmentsTable = new MatTableDataSource<Attachment>([]);
  addAttachmentButtonClick: boolean = false;
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
  storedTranslations: [];
  translationChanged: boolean = false
  imageChanged: boolean = false
  submitControlled: boolean = false
  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false, false, false];
  generalPanelOpenState: boolean[] = [];
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
    requiresApproval: new FormControl(emptyGeneralHardcodedValuesItem),
    cancelOpenChecklists: new FormControl(emptyGeneralHardcodedValuesItem),
    notifyExpiring: new FormControl(emptyGeneralHardcodedValuesItem),
    notifyAnticipation: new FormControl(emptyGeneralHardcodedValuesItem),
    anticipationSeconds: new FormControl(0),    
    cancelOpenChecklist: new FormControl(emptyGeneralHardcodedValuesItem),
    notifyApproval: new FormControl(emptyGeneralHardcodedValuesItem),
    notifyGeneration: new FormControl(emptyGeneralHardcodedValuesItem),
    expiringMessageSubject:  new FormControl(''),
    expiringMessageBody:  new FormControl(''),
    expiringNotificationMode:  new FormControl(''),
    approvalNotificationMode:  new FormControl(''),
    anticipationNotificationMode:  new FormControl(''),
    generationNotificationMode:  new FormControl(''),
    expiringNotificationChannels:  new FormControl(''),
    approvalNotificationChannels:  new FormControl(''),
    anticipationNotificationChannels:  new FormControl(''),
    generationNotificationChannels:  new FormControl(''),    
    approvalMessageSubject:  new FormControl(''),
    anticipationMessageSubject:  new FormControl(''),
    generationMessageSubject:  new FormControl(''),
    approvalMessageBody:  new FormControl(''),
    anticipationMessageBody:  new FormControl(''),
    generationMessageBody:  new FormControl(''),    
    molds:  new FormControl(''),
    notes: new FormControl(''),
    mainImageName: new FormControl(''),    
    reference: new FormControl(''),    
    prefix: new FormControl(''),    
    byDefaultDateType: new FormControl(emptyGeneralHardcodedValuesItem),
    expiringRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    approvalRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    anticipationRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
    generationRecipient: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),      
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
  showMacros: boolean = false;

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
      ApplicationModules.CHEKLIST_TEMPLATES_CATALOG_EDITION,
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
        // this.requestMoldClassesData(currentPage);
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
          ApplicationModules.CHEKLIST_TEMPLATES_CATALOG_EDITION,
          !animationFinished,
        ); 
      }
    ));

    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      skip(1),
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.CHEKLIST_TEMPLATES_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));

    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestChecklistTemplateData(+params['id']);
        }
      })
    ); 

    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestChecklistTemplateData(+params['id']);
        }
      })
    ); 

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyExpiring.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('expiringMessageBody').enabled) this.checklistTemplateForm.get('expiringMessageBody').disable();
        if (this.checklistTemplateForm.get('expiringMessageSubject').enabled) this.checklistTemplateForm.get('expiringMessageSubject').disable();
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('expiringMessageBody').disabled) this.checklistTemplateForm.get('expiringMessageBody').enable();
        if (this.checklistTemplateForm.get('expiringMessageSubject').disabled) this.checklistTemplateForm.get('expiringMessageSubject').enable();
      }      
    });

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyAnticipation.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('anticipationMessageBody').enabled) this.checklistTemplateForm.get('anticipationMessageBody').disable();
        if (this.checklistTemplateForm.get('anticipationMessageSubject').enabled) this.checklistTemplateForm.get('anticipationMessageSubject').disable();
        if (this.checklistTemplateForm.get('anticipationSeconds').enabled) this.checklistTemplateForm.get('anticipationSeconds').disable();
        
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('anticipationMessageBody').disabled) this.checklistTemplateForm.get('anticipationMessageBody').enable();
        if (this.checklistTemplateForm.get('anticipationMessageSubject').disabled) this.checklistTemplateForm.get('anticipationMessageSubject').enable();
        if (this.checklistTemplateForm.get('anticipationSeconds').disabled) this.checklistTemplateForm.get('anticipationSeconds').enable();        
      }      
    });

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyApproval.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('approvalMessageBody').enabled) this.checklistTemplateForm.get('approvalMessageBody').disable();
        if (this.checklistTemplateForm.get('approvalMessageSubject').enabled) this.checklistTemplateForm.get('approvalMessageSubject').disable();
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('approvalMessageBody').disabled) this.checklistTemplateForm.get('approvalMessageBody').enable();
        if (this.checklistTemplateForm.get('approvalMessageSubject').disabled) this.checklistTemplateForm.get('approvalMessageSubject').enable();
      }      
    });

    this.checklistTemplateFieldFormChangesSubscription = this.checklistTemplateForm.controls.notifyGeneration.valueChanges
    .subscribe((value: any) => {
      if (!this.loaded) return;
      if (!value || value === GeneralValues.NO) {
        if (this.checklistTemplateForm.get('generationMessageBody').enabled) this.checklistTemplateForm.get('generationMessageBody').disable();
        if (this.checklistTemplateForm.get('generationMessageSubject').enabled) this.checklistTemplateForm.get('generationMessageSubject').disable();
      } else if (value === GeneralValues.YES) { 
        if (this.checklistTemplateForm.get('generationMessageBody').disabled) this.checklistTemplateForm.get('generationMessageBody').enable();
        if (this.checklistTemplateForm.get('generationMessageSubject').disabled) this.checklistTemplateForm.get('generationMessageSubject').enable();
      }      
    });

    this.calcElements();
    setTimeout(() => {
      this.focusThisField = 'name';
      if (!this.checklistTemplate.id) {
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
          from: ApplicationModules.CHEKLIST_TEMPLATES_CATALOG_EDITION,
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
    if (action.from === ApplicationModules.CHEKLIST_TEMPLATES_CATALOG_EDITION && this.elements.length > 0) {
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
                message: $localize`Esta acción inactivará la plantilla checklist con el Id <strong>${this.checklistTemplate.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
                message: $localize`Esta acción reactivará la plantilla de checklist con el Id <strong>${this.checklistTemplate.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
    this.notifyingModes = {
      ...this.notifyingModes,
      currentPage,
      loading: true,
    }
    this.anticipationModes = {
      ...this.anticipationModes,
      currentPage,
      loading: true,
    }
    this.approvalModes = {
      ...this.approvalModes,
      currentPage,
      loading: true,
    }
    this.generationModes = {
      ...this.generationModes,
      currentPage,
      loading: true,
    }        
    this.notificationModes$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.macrosValuesOrder, SystemTables.CHECKLIST_TEMPLATE_NOTIFYING)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.notifyingModes.items?.concat(data?.data?.hardcodedValues?.items);
        this.notifyingModes = {
          ...this.notifyingModes,
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
        this.anticipationModes = {
          ...this.anticipationModes,
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
        this.approvalModes = {
          ...this.approvalModes,
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
        this.generationModes = {
          ...this.generationModes,
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
  
  requestNotifyChannelsData(currentPage: number) {
    this.notifyingChannels = {
      ...this.notifyingChannels,
      currentPage,
      loading: true,
    }        
    this.anticipationChannels = {
      ...this.anticipationChannels,
      currentPage,
      loading: true,
    }        
    this.approvalChannels = {
      ...this.approvalChannels,
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
        const accumulatedItems = this.notifyingChannels.items?.concat(data?.data?.hardcodedValues?.items);
        this.notifyingChannels = {
          ...this.notifyingChannels,
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
        this.approvalChannels = {
          ...this.approvalChannels,
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
    this.checklistTemplateForm.markAllAsTouched();
    this.checklistTemplateForm.updateValueAndValidity(); 
    if (this.checklistTemplateForm.valid) {      
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
    const dataToSave = this.prepareRecordToAdd(newRecord);
    this.updateChecklistTemplateCatalog$ = this._catalogsService.updateChecklistTemplateCatalog$(dataToSave)
    .pipe(
      tap((data: any) => {
        if (data?.data?.createOrUpdateChecklistTemplate.length > 0) {
          const checklistTemplateId = data?.data?.createOrUpdateChecklistTemplate[0].id;
          combineLatest([ 
            this.processTranslations$(checklistTemplateId), 
            this.saveCatalogDetails$(checklistTemplateId)             
          ])      
          .subscribe((data: any) => {
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
    return of(null);    
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
    const process = originProcess.CATALOGS_CHEKLIST_TEMPLATE_HEADER_ATTACHMENTS;
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
    }).pipe(
      map(([ checklistTemplateGqlData, checklistTemplateGqlTranslationsData, checklistTemplateGqlAttachments ]) => {
        return this._catalogsService.mapOneChecklistTemplate({
          checklistTemplateGqlData,  
          checklistTemplateGqlTranslationsData,
          checklistTemplateGqlAttachments,
        })
      }),
      tap((checklistTemplateData: ChecklistTemplateDetail) => {
        if (!checklistTemplateData) return;
        this.checklistTemplate =  checklistTemplateData;

        this.moldsCurrentSelection = [];
        this.translationChanged = false;
        this.imageChanged = false;
        this.storedTranslations = JSON.parse(JSON.stringify(this.checklistTemplate.translations));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.checklistTemplate.translations.length > 0 ? $localize`Traducciones (${this.checklistTemplate.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.checklistTemplate.translations.length > 0 ? 'accent' : '';   
        this.updateFormFromData();
        this.prepareListOfValues();
        this.changeInactiveButton(this.checklistTemplate.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = checklistTemplateData.translations.length > 0 ? $localize`Traducciones (${checklistTemplateData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = checklistTemplateData.translations.length > 0 ? 'accent' : '';
        }        
        this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        this.setAttachmentLabel();
        this.setViewLoading(false);
        this.loaded = true;
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
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
    }
  }

  onFileSelected(event: any) {
    const fd = new FormData();
    fd.append('image', event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/checklist-templates`)
    .set('processId', this.checklistTemplate.id)
    .set('process', originProcess.CATALOGS_VARIABLES_TEMPLATES);
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
    this.checklistTemplateForm.patchValue({
      name: this.checklistTemplate.name,
      reference: this.checklistTemplate.reference,      
      prefix: this.checklistTemplate.prefix,      
      notes: this.checklistTemplate.notes,      
      templateType: this.checklistTemplate.templateType,
      allowDiscard: this.checklistTemplate.required,
      mainImageName: this.checklistTemplate.mainImageName,            
    });
  } 

  prepareRecordToAdd(newRecord: boolean): any {
    const fc = this.checklistTemplateForm.controls;
    return  {
        id: this.checklistTemplate.id,
        customerId: 1, // TODO: Get from profile
        status: newRecord ? RecordStatus.ACTIVE : this.checklistTemplate.status,
        possibleValues: JSON.stringify(this.valuesList),
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.prefix.dirty || fc.prefix.touched || newRecord) && { prefix: fc.prefix.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.templateType.dirty || fc.templateType.touched || newRecord) && { uomId: fc.templateType.value.id },
      ...(fc.templateType.dirty || fc.templateType.touched || newRecord) && { uomId: fc.templateType.value.id },
      ...(fc.requiresApproval.dirty || fc.requiresApproval.touched || newRecord) && { requiresApproval: fc.requiresApproval.value },
      ...(fc.cancelOpenChecklists.dirty || fc.cancelOpenChecklists.touched || newRecord) && { cancelOpenChecklists: fc.cancelOpenChecklists.value },      
      ...(this.imageChanged) && { 
        mainImageName: fc.mainImageName.value,
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
    this.moldsCurrentSelection = [];
    this.checklistTemplateForm.controls.byDefaultDateType.setValue(GeneralValues.DASH);    
    this.checklistTemplateForm.controls.molds.setValue('');       
    this.multipleSearchDefaultValue = '';
    this.valuesList = [];
    this.storedTranslations = [];
    this.translationChanged = false;
    this.checklistTemplate = emptyChecklistTemplateItem;
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
    }    
    return '';
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.CHEKLIST_TEMPLATES_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.CHEKLIST_TEMPLATES_CATALOG_EDITION,
      loading,
    ); 
  }

  validateTables(): void {
    if (this.checklistTemplateForm.controls.templateType.value && this.checklistTemplateForm.controls.templateType.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.templateType.setErrors({ inactive: true });   
    }    
    if (this.checklistTemplateForm.controls.notifyExpiring.value === GeneralValues.YES && this.checklistTemplateForm.controls.expiringRecipient.value && this.checklistTemplateForm.controls.expiringRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.expiringRecipient.setErrors({ inactive: true });   
    }
    if (this.checklistTemplateForm.controls.notifyAnticipation.value === GeneralValues.YES && this.checklistTemplateForm.controls.anticipationRecipient.value && this.checklistTemplateForm.controls.anticipationRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.anticipationRecipient.setErrors({ inactive: true });   
    }
    if (this.checklistTemplateForm.controls.notifyGeneration.value === GeneralValues.YES && this.checklistTemplateForm.controls.generationRecipient.value && this.checklistTemplateForm.controls.generationRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.generationRecipient.setErrors({ inactive: true });   
    }
    if (this.checklistTemplateForm.controls.notifyApproval.value === GeneralValues.YES && this.checklistTemplateForm.controls.approvalRecipient.value && this.checklistTemplateForm.controls.approvalRecipient.value.status === RecordStatus.INACTIVE) {
      this.checklistTemplateForm.controls.approvalRecipient.setErrors({ inactive: true });   
    }    
  }

  processTranslations$(checklistTemplateId: number): Observable<any> { 
    const differences = this.storedTranslations.length !== this.checklistTemplate.translations.length || this.storedTranslations.some((st: any) => {
      return this.checklistTemplate.translations.find((t: any) => {        
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
      const translationsToAdd = this.checklistTemplate.translations.map((t: any) => {
        return {
          id: null,
          checklistTemplateId,
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
        varToAdd.translations.length > 0 ? this._catalogsService.addChecklistTemplateTransations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteChecklistTemplateTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

  handleMoveToFirst(id: number) {
    const valueIndex = this.valuesList.findIndex((v: ChecklistTemplatePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.valuesList[valueIndex]));
    this.valuesList.splice(valueIndex, 1);
    this.valuesList.unshift({
      order: 0,
      value: tmpValue.value,
      byDefault: tmpValue.byDefault,
      alarmedValue: tmpValue.alarmedValue,
    })
    let index = 1;
    this.valuesList.forEach((v: ChecklistTemplatePossibleValue) => {
      v.order = index++;
    });
    this.possibleValuesTable = new MatTableDataSource<ChecklistTemplatePossibleValue>(this.valuesList);    
    this.setEditionButtonsState();
  }

  handleMoveToUp(id: number) {
    const valueIndex = this.valuesList.findIndex((v: ChecklistTemplatePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.valuesList[valueIndex]));
    const editingItem = this.valuesList[valueIndex - 1];

    if (editingItem) {      
      this.valuesList[valueIndex].value = editingItem.value;
      this.valuesList[valueIndex].byDefault = editingItem.byDefault;
      this.valuesList[valueIndex].alarmedValue = editingItem.alarmedValue;

      editingItem.value = tmpValue.value;
      editingItem.byDefault = tmpValue.byDefault;
      editingItem.alarmedValue = tmpValue.alarmedValue;
      
      this.possibleValuesTable = new MatTableDataSource<ChecklistTemplatePossibleValue>(this.valuesList);    
      this.setEditionButtonsState();      
    }
  }

  handleMoveToDown(id: number) {
    const valueIndex = this.valuesList.findIndex((v: ChecklistTemplatePossibleValue) => v.order === id);
    const tmpValue = JSON.parse(JSON.stringify(this.valuesList[valueIndex]));
    const editingItem = this.valuesList[valueIndex + 1];
    
    if (editingItem) {      
      this.valuesList[valueIndex].value = editingItem.value;
      this.valuesList[valueIndex].byDefault = editingItem.byDefault;
      this.valuesList[valueIndex].alarmedValue = editingItem.alarmedValue;      

      editingItem.value = tmpValue.value;
      editingItem.byDefault = tmpValue.byDefault;
      editingItem.alarmedValue = tmpValue.alarmedValue;      
      
      this.possibleValuesTable = new MatTableDataSource<ChecklistTemplatePossibleValue>(this.valuesList);    
      this.setEditionButtonsState();      
    }
  }
  
  prepareListOfValues() {
    if (this.checklistTemplate.possibleValues) {
      try {
        this.valuesList = JSON.parse(this.checklistTemplate.possibleValues);
      } catch (error) {
        this.valuesList = null;
      }          
    } else {
      this.valuesList = null;
    }
    this.possibleValuesTable = new MatTableDataSource<ChecklistTemplatePossibleValue>(this.valuesList);        
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
    .set('destFolder', `${environment.uploadFolders.catalogs}/checklist-templates`)
    .set('processId', this.checklistTemplate.id)
    .set('process', originProcess.CATALOGS_CHEKLIST_TEMPLATE_HEADER_ATTACHMENTS);
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
    this.duplicateAttachmentsList$ = this._catalogsService.duplicateAttachmentsList$(originProcess.CATALOGS_CHEKLIST_TEMPLATE_HEADER_ATTACHMENTS, files)
    .pipe(
      tap((newAttachments) => {
        if (newAttachments.length !== this.checklistTemplate.attachments) {
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

  
  handleKeyDown(event: KeyboardEvent) { }

  chengeSelection(event: any) { 
  }


  handleChengeSelection(event: any) { 
    // if (this.formField.disabled) {
     // event.option.selected = false;
    // }
  }

  handleNotifyModesSelectItem(origin: string, formField: FormControl, item: any) {
    if (formField.disabled) return;
    if (formField.value === GeneralValues.YES) {
      item.selected = !item.selected;
      if (origin === 'expiring') {
        this.notifyingModesSelected = this.notifyingModes.items.filter(r => r.selected).length;
      } else if (origin === 'anticipation') {
        this.anticipationModesSelected = this.anticipationModes.items.filter(r => r.selected).length;
      } else if (origin === 'generation') {
        this.generationModesSelected = this.generationModes.items.filter(r => r.selected).length;
      } else if (origin === 'approval') {
        this.approvalModesSelected = this.approvalModes.items.filter(r => r.selected).length;
      }      
      this.setEditionButtonsState();
    }
  }

  handleNotifyChannelsSelectItem(origin: string, formField: FormControl, item: any) {
    if (formField.disabled) return;
    if (formField.value === GeneralValues.YES) {
      item.selected = !item.selected;
      if (origin === 'expiring') {
        this.notifyingChannelsSelected = this.notifyingChannels.items.filter(r => r.selected).length;
      } else if (origin === 'anticipation') {
        this.anticipationChannelsSelected = this.anticipationChannels.items.filter(r => r.selected).length;
      } else if (origin === 'generation') {
        this.generationChannelsSelected = this.generationChannels.items.filter(r => r.selected).length;
      } else if (origin === 'approval') {
        this.approvalChannelsSelected = this.approvalChannels.items.filter(r => r.selected).length;
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
