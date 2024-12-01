import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, originProcess, SystemTables, toolbarMode, ScreenDefaultValues, GeneralValues, GeneralHardcodedValuesData, emptyGeneralHardcodedValuesData, GeneralCatalogParams, SimpleTable, GeneralMultipleSelcetionItems, HarcodedVariableValueType } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, combineLatest, map, of, skip, switchMap, tap } from 'rxjs';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { CatalogsService } from '../../services';
import { ChecklistPlanDetail, emptyChecklistPlanItem } from '../../models';
import { CustomValidators } from '../../custom-validators';
import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';
import { GeneralCatalogData, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesItem } from '../../models/catalogs-shared.models';


@Component({
  selector: 'app-catalog-checklist-plans-edition',
  templateUrl: './catalog-checklist-plans-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-checklist-plans-edition.component.scss']
})
export class CatalogChecklistPlansEditionComponent {
  @ViewChild('catalogEdition') private catalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;
  @ViewChild('possibleValue', { static: false }) possibleValue: ElementRef;  

  // ChecklistPlans ===============
  checklistPlan: ChecklistPlanDetail = emptyChecklistPlanItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  checklistPlanTypes$: Observable<any>; 
  genYesNoValues$: Observable<any>;
  frequencies$: Observable<any>;
  
  templatesCurrentSelection: GeneralMultipleSelcetionItems[] = [];  
  templates: GeneralCatalogData = emptyGeneralCatalogData; 
  templates$: Observable<any>;    
  pendingRecord: number = 0;

  toolbarClick$: Observable<ToolbarButtonClicked>; 
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  checklistPlan$: Observable<any>;
  translations$: Observable<any>;
  updateChecklistPlan$: Observable<any>;
  updateChecklistPlanCatalog$: Observable<any>;
  deleteChecklistPlanTranslations$: Observable<any>;    
  
  checklistPlanFormChangesSubscription: Subscription;
  
  checklistPlanTypes: GeneralCatalogData = emptyGeneralCatalogData;   
  genYesNoValues: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  frequencies: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  hours: string[] = [];
  
  updatingCount: number = 0;

  catalogIcon: string = "status_report2";  
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodedValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  harcodedValuesOrderById: any = JSON.parse(`{ "id": "${'ASC'}" }`);
  storedTranslations: [] = [];
  translationChanged: boolean = false
  submitControlled: boolean = false
  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false, false, false];
  generalPanelOpenState: boolean[] = [false, false, false, false, false];
  formPanelOpenState: boolean[] = [];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;  
  goTopButtonTimer: any;
  takeRecords: number;
  focusThisField: string = '';
  tmpValueType: string = '';
  multipleSearchDefaultValue: string = '';    

  checklistPlanForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,  
    ),
    checklistPlanType: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    templates:  new FormControl('y'),
    frequency: new FormControl(emptyGeneralHardcodedValuesItem),
    notes: new FormControl(''),
    reference: new FormControl(''),
    prefix: new FormControl(''),
    hour: new FormControl(''),
    hours: new FormControl(''),
    byDefaultDate:  new FormControl(new Date()),
    byDefaultTime:  new FormControl(''), 
    specificDate:  new FormControl(null), 
    timeZone: new FormControl(new Date().getTimezoneOffset() * 60),
    limit: new FormControl(0),
    anticipationTime: new FormControl(0),
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
  movedVariable: number = -1;

  moldsOptions: SimpleTable[] = [
    { id: '', description: $localize`No usar esta plantilla de checklist para ningún Plan` },  
    { id: 'y', description: $localize`TODOS las plantillas de checklist activos` },  
    { id: 'n', description: $localize`Las plantillas de checklist de lista` },  
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
    public _dialog: MatDialog,
    private _location: Location,
  ) {}

// Hooks ====================
  ngOnInit() {
    // this.checklistPlanForm.get('name').disable();
    this.pageAnimationFinished();
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
        this.requestChecklistPlanTypesData(currentPage);
        this.requestGenYesNoValuesData(currentPage);  
        this.requestFrequenciesValuesData(currentPage);          
        this.requestChecklistTemplatesData(currentPage);         
      })
    );
        
    this.checklistPlanFormChangesSubscription = this.checklistPlanForm.valueChanges
    .subscribe(() => {
      if (!this.loaded) return;
      this.setEditionButtonsState();
    });

    this.checklistPlanFormChangesSubscription = this.checklistPlanForm.controls.byDefaultDate.valueChanges
    .subscribe((value: any) => {
      this.calculateByDefaultValue();
    });
    this.checklistPlanFormChangesSubscription = this.checklistPlanForm.controls.byDefaultTime.valueChanges
    .subscribe((value: any) => {
      this.calculateByDefaultValue();
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
          this.requestChecklistPlanData(+params['id']);
        }
      })
    ); 

    this.calcElements();
    setTimeout(() => {
      this.focusThisField = 'name';
      if (!this.checklistPlan.id) {
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
    if (this.checklistPlanFormChangesSubscription) this.checklistPlanFormChangesSubscription.unsubscribe();     
  }
  
// Functions ================  
  requestChecklistPlanTypesData(currentPage: number, filterStr: string = null) {
    this.checklistPlanTypes = {
      ...this.checklistPlanTypes,
      currentPage,
      loading: true,
    } 
    const skipRecords = this.checklistPlanTypes.items.length;
    this.checklistPlanTypes$ = this.requestGenericsData$(currentPage, skipRecords, SystemTables.CHECKLIST_PLAN_TYPES, filterStr)
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
        this.checklistPlanTypes = {
          ...this.checklistPlanTypes,
          loading: false,
          pageInfo: data?.data?.genericsPaginated?.pageInfo,
          items: this.checklistPlanTypes.items?.concat(mappedItems),
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

  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION,
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
    if (action.from === ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION && this.elements.length > 0) {
      if (action.action === ButtonActions.NEW) {        
        this.elements.find(e => e.action === action.action).loading = true;
        if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) {
          this.showErrorDialog('save-before', ButtonActions.NEW);    
        } else {
          this._location.replaceState('/catalogs/checklist-plans/create');
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;  
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/checklist-plans'); 
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.copyChecklistPlan();
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
        if (!this.checklistPlan.id || this.checklistPlan.id === null || this.checklistPlan.id === 0) {
          this.initForm();
        } else {
          noData = false;
          this.requestChecklistPlanData(this.checklistPlan.id);
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
        if (this.checklistPlan?.id > 0 && this.checklistPlan.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`INACTIVAR PLAN DE CHECKLIST`,  
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
                message: $localize`Esta acción inactivará la plantilla checklist con el Id <strong>${this.checklistPlan.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
                id: this.checklistPlan.id,
                customerId: this.checklistPlan.customerId,
                status: RecordStatus.INACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(variableParameters);
              this.updateChecklistPlan$ = this._catalogsService.updateChecklistPlanStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateChecklistPlan.length > 0 && data?.data?.createOrUpdateChecklistPlan[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE);
                      this.checklistPlan.status = RecordStatus.INACTIVE;
                      this.elements.find(e => e.action === ButtonActions.EXECUTE).disabled = !(this.checklistPlan.status === RecordStatus.ACTIVE);
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
        } else if (this.checklistPlan?.id > 0 && this.checklistPlan.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR PLAN DE CHECKLIST`,  
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
                message: $localize`Esta acción reactivará el plan de checklist con el Id <strong>${this.checklistPlan.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
                id: this.checklistPlan.id,
                customerId: this.checklistPlan.customerId,
                status: RecordStatus.ACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(variableParameters);
              this.updateChecklistPlan$ = this._catalogsService.updateChecklistPlanStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateChecklistPlan.length > 0 && data?.data?.createOrUpdateChecklistPlan[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {
                      this.checklistPlan.status = RecordStatus.ACTIVE;
                      this.changeInactiveButton(RecordStatus.ACTIVE);
                      this.elements.find(e => e.action === ButtonActions.EXECUTE).disabled = !(this.checklistPlan.status === RecordStatus.ACTIVE);
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
      } else if (action.action === ButtonActions.EXECUTE) { 
        this.elements.find(e => e.action === action.action).loading = true;
        if (this.checklistPlan?.id > 0 && this.checklistPlan.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            panelClass: 'warn-dialog',
            autoFocus : true,
            data: {
              title: $localize`EJECUTAR EL PLAN DE CHECKLIST`,  
              topIcon: 'delete',
              buttons: [{
                action: 'execute',
                showIcon: true,
                icon: 'time_cycles',
                showCaption: true,
                caption: $localize`Ejecutar el plan`,
                showTooltip: true,
                class: 'warn',
                tooltip: $localize`Ejecuta el plan de checklist`,
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
                message: $localize`Esta acción generará la plantilla checklist con el Id <strong>${this.checklistPlan.id}</strong> y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
                id: this.checklistPlan.id,
                customerId: this.checklistPlan.customerId,
                status: RecordStatus.INACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(variableParameters);
              this.updateChecklistPlan$ = this._catalogsService.updateChecklistPlanStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateChecklistPlan.length > 0 && data?.data?.createOrUpdateChecklistPlan[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {
                      this.changeInactiveButton(RecordStatus.INACTIVE);
                      this.checklistPlan.status = RecordStatus.INACTIVE;
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
        } else if (this.checklistPlan?.id > 0 && this.checklistPlan.status === RecordStatus.INACTIVE) {
          const dialogResponse = this._dialog.open(GenericDialogComponent, {
            width: '450px',
            disableClose: true,
            autoFocus : true,
            data: {
              title: $localize`REACTIVAR PLAN DE CHECKLIST`,  
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
                message: $localize`Esta acción reactivará el plan de checklist con el Id <strong>${this.checklistPlan.id}</strong> y volverá a estar disponible en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
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
                id: this.checklistPlan.id,
                customerId: this.checklistPlan.customerId,
                status: RecordStatus.ACTIVE,
              }
              const variables = this._sharedService.setGraphqlGen(variableParameters);
              this.updateChecklistPlan$ = this._catalogsService.updateChecklistPlanStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateChecklistPlan.length > 0 && data?.data?.createOrUpdateChecklistPlan[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {
                      this.checklistPlan.status = RecordStatus.ACTIVE;
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
      
      } else if (action.action === ButtonActions.TRANSLATIONS) { 
        if (this.checklistPlan?.id > 0) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones del plan de checklist <strong>${this.checklistPlan.id}</strong>`,
              topIcon: 'world',
              translations: this.checklistPlan.translations,
              fromChecklistPlan: true,
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
                message: $localize`Esta acción inactivará el plan de checklist ${this.checklistPlan.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            this.translationChanged = response.translationsUpdated
            if (response.translationsUpdated) {              
              //this._store.dispatch(updateMoldTranslations({ 
              this.checklistPlan.translations = [...response.translations];
              //}));
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.checklistPlan.translations.length > 0 ? $localize`Traducciones (${this.checklistPlan.translations.length})` : $localize`Traducciones`;
              this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.checklistPlan.translations.length > 0 ? 'accent' : '';   
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
      caption: $localize`Ejecutar ahora`,
      tooltip:  $localize`Ejecuta el plan en este momento`,
      icon: 'time_cycles',
      class: 'accent',
      alignment: 'left',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: true,
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
      disabled: this.checklistPlan?.status !== RecordStatus.ACTIVE,
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
      disabled: !!!this.checklistPlan.id,
      action: ButtonActions.TRANSLATIONS,  
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

  requestFrequenciesValuesData(currentPage: number) {
    this.frequencies = {
      ...this.frequencies,
      currentPage,
      loading: true,
    }        
    this.frequencies$ = this._sharedService.requestHardcodedValuesData$(0, 0, this.takeRecords, this.harcodedValuesOrderById, SystemTables.CHECKLIST_PLANS_FREQUENCIES)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.frequencies.items?.concat(data?.data?.hardcodedValues?.items);
        this.frequencies = {
          ...this.frequencies,
          loading: false,
          pageInfo: data?.data?.hardcodedValues?.pageInfo,
          items: accumulatedItems,
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
    // this.checklistPlanForm.markAllAsTouched();
    this.checklistPlanForm.updateValueAndValidity(); 
    if (this.checklistPlanForm.valid) {      
      this.saveRecord();   
    } else {
      let fieldsMissing = '';
      let fieldsMissingCounter = 0;
      for (const controlName in this.checklistPlanForm.controls) {
        if (this.checklistPlanForm.controls.hasOwnProperty(controlName)) {
          const typedControl: AbstractControl = this.checklistPlanForm.controls[controlName]; 
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
        for (const controlName in this.checklistPlanForm.controls) {
          if (this.checklistPlanForm.controls.hasOwnProperty(controlName)) {
            const typedControl: AbstractControl = this.checklistPlanForm.controls[controlName]; 
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
    const newRecord = !this.checklistPlan.id || this.checklistPlan.id === null || this.checklistPlan.id === 0;
    let checklistPlanId = 0;
    try {
      const dataToSave = this.prepareRecordToSave(newRecord);
      this.updateChecklistPlanCatalog$ = this._catalogsService.updateChecklistPlanCatalog$(dataToSave)
      .pipe(
        switchMap((data: any) => {
          if (data?.data?.createOrUpdateChecklistPlan.length > 0) {
            checklistPlanId = data?.data?.createOrUpdateChecklistPlan[0].id;      
            return combineLatest([ 
              this.processTranslations$(checklistPlanId), 
              this.saveCatalogDetails$(checklistPlanId),
            ])
          } else {
            return of([])
          }
        }),
        tap((data: any) => {
          this.requestChecklistPlanData(checklistPlanId);
          setTimeout(() => {              
            let message = $localize`El plan de checklist ha sido actualizada`;
            if (newRecord) {                
              message = $localize`El plan de checklist ha sido creada satisfactoriamente con el id <strong>${checklistPlanId}</strong>`;
              this._location.replaceState(`/catalogs/checklist-plans/edit/${checklistPlanId}`);
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

  saveCatalogDetails$(processId: number): Observable<any> {
    const newRecord = !this.checklistPlan.id || this.checklistPlan.id === null || this.checklistPlan.id === 0;
    if (this.templatesCurrentSelection.length > 0) {
      const checklistPlanTemplates = this.templatesCurrentSelection
      .filter(ct => !!ct.originalValueRight && ct.valueRight === null)
      .map(ct => {
        return {
          id: ct.catalogDetailId,
          deletePhysically: true,
        }
      });
      const ctToDelete = {
        ids: checklistPlanTemplates,
        customerId: 1, // TODO: Get from profile
      }
      const checklistPlanTemplatesdToAdd = this.templatesCurrentSelection
      .filter(ct => ct.originalValueRight === null && !!ct.valueRight)
      .map(ct => {
        return {
          process: SystemTables.CHECKLIST_PLANS_TEMPLATES,
          processId,
          detailTableName: SystemTables.CHECKLIST_TEMPLATES,
          value: ct.valueRight,
          customerId: 1,  // TODO: Get from profile
        }
      });
      const ctToAdd = {
        catalogDetails: checklistPlanTemplatesdToAdd,
      }

      return combineLatest([ 
        ctToAdd.catalogDetails.length > 0 ? this._catalogsService.addOrUpdateCatalogDetails$(ctToAdd) : of(null), 
        ctToDelete.ids.length > 0 && !newRecord ? this._catalogsService.deleteCatalogDetails$(ctToDelete) :  of(null) 
      ]);
    } else {
      return of(null);
    }
  }

  requestChecklistPlanData(checklistPlanId: number): void { 
    let variables = undefined;
    variables = { checklistPlanId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "checklistPlanId": { "eq": ${checklistPlanId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);    
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.checklistPlan$ = this._catalogsService.getChecklistPlanDataGql$({ 
      checklistPlanId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter,   
      customerId: 1, // TODO      
    }).pipe(
      map(([ checklistPlanGqlData, checklistPlanGqlTranslationsData]) => {
        return this._catalogsService.mapOneChecklistPlan({
          checklistPlanGqlData,  
          checklistPlanGqlTranslationsData,      
        })
      }),
      tap((checklistPlanData: ChecklistPlanDetail) => {
        // this.mapLines(attachments);  
        this.checklistPlan = checklistPlanData; 
        this.templatesCurrentSelection = [];  
        this.translationChanged = false;  
        this.storedTranslations = JSON.parse(JSON.stringify(this.checklistPlan.translations));  
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.checklistPlan.translations.length > 0 ? $localize`Traducciones (${this.checklistPlan.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.checklistPlan.translations.length > 0 ? 'accent' : '';   
        this.pendingRecord = 0;  
        this.updateFormFromData();
        this.changeInactiveButton(this.checklistPlan.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = this.checklistPlan.translations.length > 0 ? $localize`Traducciones (${this.checklistPlan.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = this.checklistPlan.translations.length > 0 ? 'accent' : '';
        }        
        this.templates.items = [];
        this.requestChecklistTemplatesData(0);
        this.loaded = true;
        setTimeout(() => {
          this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        }, 1000);          
        this.setViewLoading(false);  
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
  }  

  mapChecklistPlansDetailAttachments$(processId: number): Observable<any> {
    return this._catalogsService.getAttachmentsDataGql$({
      processId,
      process: originProcess.CATALOGS_CHECKLIST_TEMPLATE_LINES_ATTACHMENTS,
      customerId: 1, //TODO get Customer from user profile
    });
  }

  mapChecklistPlansDetailVariableAttachments$(processId: number): Observable<any> {
    return this._catalogsService.getAttachmentsDataGql$({
      processId,
      process: originProcess.CATALOGS_VARIABLES_ATTACHMENTS,
      customerId: 1, //TODO get Customer from user profile
    });
  }
    
  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    console.log(getMoreDataParams);
    if (getMoreDataParams.catalogName === SystemTables.CHECKLIST_PLAN_TYPES) {
      if (getMoreDataParams.initArray) {
        this.checklistPlanTypes.currentPage = 0;
        this.checklistPlanTypes.items = [];
      } else if (!this.checklistPlanTypes.pageInfo.hasNextPage) {
        return;
      } else {
        this.checklistPlanTypes.currentPage++;
      }
      this.requestChecklistPlanTypesData(        
        this.checklistPlanTypes.currentPage,
        getMoreDataParams.textToSearch,  
      ); 
    } else if (getMoreDataParams.catalogName === SystemTables.CHECKLIST_TEMPLATES) {
      if (this.templates.loading) return;
      if (getMoreDataParams.initArray) {
        this.templates.currentPage = 0;   
        this.templates.items = [];
      } else if (!this.templates.pageInfo.hasNextPage) {
        return;
      } else {
        this.templates.currentPage++;
      }
      this.requestChecklistTemplatesData(        
        this.templates.currentPage,
        getMoreDataParams.textToSearch,  
      );          
    }          
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
      this.elements.find(e => e.action === ButtonActions.EXECUTE).disabled = true;
    } else if (mode === toolbarMode.EDITING_WITH_NO_DATA) {
      // if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = true;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
      this.elements.find(e => e.action === ButtonActions.EXECUTE).disabled = true;
    } else if (mode === toolbarMode.INITIAL_WITH_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = false;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = false;
      this.elements.find(e => e.action === ButtonActions.EXECUTE).disabled = !(this.checklistPlan.status === RecordStatus.ACTIVE);
    } else if (mode === toolbarMode.INITIAL_WITH_NO_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).disabled = true;   
      this.elements.find(e => e.action === ButtonActions.INACTIVATE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
      this.elements.find(e => e.action === ButtonActions.EXECUTE).disabled = true;
    }    
  }

  updateFormFromData(): void {    
    this.checklistPlanForm.patchValue({
      name: this.checklistPlan.name,
      reference: this.checklistPlan.reference,  
      prefix: this.checklistPlan.prefix,  
      notes: this.checklistPlan.notes,  
      checklistPlanType: this.checklistPlan.checklistPlanType,
      templates: this.checklistPlan.templates,      
      limit: this.checklistPlan.limit,
      anticipationTime: this.checklistPlan.anticipationTime,
      frequency: this.checklistPlan.frequency,
      specificDate: this.checklistPlan.specificDate ? this._sharedService.convertUtcTolocal(this.checklistPlan.specificDate) : null,      
    });
    this.hours = [];
    if (this.checklistPlan.hours) {
      this.hours = JSON.parse(this.checklistPlan.hours); //.map((h) => this._sharedService.formatDate(`2021/01/01 ${h}`, 'hh:mm a'));
    }
    if (this.checklistPlanForm.controls.specificDate.value) {      
      const dateAndTime = this._sharedService.formatDate(this.checklistPlanForm.controls.specificDate.value, 'yyyy/MM/dd HH:mm').split(' ');
      this.checklistPlanForm.patchValue({        
        byDefaultDate: dateAndTime.length > 0 ? new Date(dateAndTime[0]) : null,
        byDefaultTime: dateAndTime.length > 1 ? dateAndTime[1] : null,
      });
    }    
  } 

  prepareRecordToSave(newRecord: boolean): any {
    this.checklistPlanForm.markAllAsTouched();
    const fc = this.checklistPlanForm.controls;
    let dateToSave = null;
    if (this.checklistPlanForm.controls.specificDate.value) {
      const dateAndTime = this._sharedService.formatDate(
        (this.checklistPlanForm.controls.specificDate.value ? this.checklistPlanForm.controls.specificDate.value : new Date()),
        'yyyy/MM/dd HH:mm:ss'
      )
      .split(' ');
      dateToSave = `${dateAndTime[0]} ${dateAndTime[1]}`;
    }

    return  {
        id: this.checklistPlan.id,
        customerId: 1, // TODO: Get from profile
        status: newRecord ? RecordStatus.ACTIVE : this.checklistPlan.status,
        hours: JSON.stringify(this.hours),
        specificDate: dateToSave,
      ...(fc.name.dirty || fc.name.touched || newRecord) && { name: fc.name.value  },
      ...(fc.prefix.dirty || fc.prefix.touched || newRecord) && { prefix: fc.prefix.value  },
      ...(fc.reference.dirty || fc.reference.touched || newRecord) && { reference: fc.reference.value },
      ...(fc.notes.dirty || fc.notes.touched || newRecord) && { notes: fc.notes.value },
      ...(fc.checklistPlanType.dirty || fc.checklistPlanType.touched || newRecord) && { checklistPlanTypeId: fc.checklistPlanType.value ? fc.checklistPlanType.value.id : null },  
      ...(fc.templates.dirty || fc.templates.touched || newRecord) && { templates: fc.templates.value },
      ...(fc.frequency.dirty || fc.frequency.touched || newRecord) && { frequency: fc.frequency.value },
      ...(fc.timeZone.dirty || fc.timeZone.touched || newRecord) && { timeZone: fc.timeZone.value ? +fc.timeZone.value : 0 },
      ...(fc.limit.dirty || fc.limit.touched || newRecord) && { limit: fc.limit.value ? +fc.limit.value : 0 }, 
      ...(fc.anticipationTime.dirty || fc.anticipationTime.touched || newRecord) && { anticipationTime: fc.anticipationTime.value ? +fc.anticipationTime.value : 0 }, 
    }
  }
  
  initForm(): void {
    this.checklistPlanForm.reset();    
    this.checklistPlanForm.controls.templates.setValue(''); 
    
    this.checklistPlanForm.controls.timeZone.setValue(new Date().getTimezoneOffset() * 60);
    this.checklistPlanForm.controls.limit.setValue(0);
    this.checklistPlanForm.controls.anticipationTime.setValue(0);
    this.multipleSearchDefaultValue = '';
    this.storedTranslations = [];
    this.hours = [];
    this.checklistPlanForm.controls.specificDate.setValue(null);
    this.translationChanged = false;
    this.checklistPlan = emptyChecklistPlanItem; 

    // Default values
    
    this.focusThisField = 'name';
    this.templates.items = [];    
    this.templatesCurrentSelection = [];  
    
    this.requestChecklistTemplatesData(0);    
    
    setTimeout(() => {
      this.catalogEdition.nativeElement.scrollIntoView({            
        behavior: 'smooth',
        block: 'start',
      });   
      this.focusThisField = '';
    }, 200);
  }

  initUniqueField(): void {
    this.checklistPlan.id = null;
    this.checklistPlan.createdBy = null;
    this.checklistPlan.createdAt = null;
    this.checklistPlan.updatedBy = null;
    this.checklistPlan.updatedAt = null; 
    this.checklistPlan.status = RecordStatus.ACTIVE; 
    this.checklistPlan.translations.map((t) => {
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
      return $localize`Descripción o nombre de la el plan de checklist`
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
    if (this.checklistPlanForm.controls.checklistPlanType.value && this.checklistPlanForm.controls.checklistPlanType.value.status === RecordStatus.INACTIVE) {
      this.checklistPlanForm.controls.checklistPlanType.setErrors({ inactive: true });   
    } else {
      this.checklistPlanForm.controls.checklistPlanType.setErrors(null);   
    }    
  }

  processTranslations$(checklistPlanId: number): Observable<any> { 
    const differences = this.storedTranslations.length !== this.checklistPlan.translations.length || this.storedTranslations.some((st: any) => {
      return this.checklistPlan.translations.find((t: any) => {        
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
      const translationsToAdd = this.checklistPlan.translations.map((t: any) => {
        return {
          id: null,
          checklistPlanId,
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
        varToAdd.translations.length > 0 ? this._catalogsService.updateChecklistPlanTranslations$(varToAdd) : of(null),
        varToDelete.ids.length > 0 ? this._catalogsService.deleteChecklistPlanTranslations$(varToDelete) : of(null) 
      ]);
    } else {
      return of(null);
    }
    
  }

  setEditionButtonsState() {
    if (!this.checklistPlan.id || this.checklistPlan.id === null || this.checklistPlan.id === 0) {
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    } else {
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
    }
  }

  handleMultipleSelectionChanged(catalog: string){    
    this.setEditionButtonsState();
  }

  requestChecklistTemplatesData(currentPage: number, filterStr: string = null) {    
    this.templates = {
      ...this.templates,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "translatedName": { "contains": "${filterStr}" } } ] }`);
    }
    const skipRecords = this.templates.items.length;

    const processId = !!this.checklistPlan.id ? this.checklistPlan.id : 0;
    const checklistPlanParameters = {
      settingType: 'multiSelection',
      skipRecords,
      process: SystemTables.CHECKLIST_PLANS_TEMPLATES,
      processId, 
      takeRecords: this.takeRecords, 
      filter,   
    }    
    const variables = this._sharedService.setGraphqlGen(checklistPlanParameters);    
    this.templates$ = this._catalogsService.getChecklistTemplatesLazyLoadingDataGql$(variables)
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
        this.templates = {
          ...this.templates,
          loading: false,
          pageInfo: data?.data?.catalogDetailChecklistTemplate?.pageInfo,
          items: this.templates.items?.concat(mappedItems),
          totalCount: data?.data?.catalogDetailChecklistTemplate?.totalCount,
        }
      }),
      catchError(() => EMPTY)
    )    
  }

  handleKeyDown(event: KeyboardEvent) { }

  chengeSelection(event: any) { 
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

  copyChecklistPlan() {        
    this.initUniqueField();
    this._location.replaceState('/catalogs/checklist-plans/create');
    setTimeout(() => {
      this.elements.find(e => e.action === ButtonActions.COPY).loading = false;
      this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
    }, 750);
  }

  handleSelectionChange(event: any) {    
  }

  addHour(event: any) {
    const finalHour = this._sharedService.formatDate(`2021/01/01 ${this.checklistPlanForm.controls.hour.value}`, 'hh:mm a');
    const index = this.hours.indexOf(finalHour);
    if (index == -1) {
      this.hours.push(this._sharedService.formatDate(`2021/01/01 ${this.checklistPlanForm.controls.hour.value}`, 'hh:mm a'));
      this.checklistPlanForm.controls.hour.setValue(null);
      this.setEditionButtonsState();
    } else {
      const message = $localize`Este horario ya esta incluido`;
      this._sharedService.showSnackMessage({
        message,
        snackClass: 'snack-warn',
        progressBarColor: 'warn',
        icon: '',
      });
    }
  }

  removeHour(hour: string) {
    const index = this.hours.indexOf(hour);
    if (index >= 0) {
      this.hours.splice(index, 1);
    }
  }

  calculateByDefaultValue() {    
    const date = this._sharedService.formatDate(this.checklistPlanForm.controls.byDefaultDate.value ?? new Date(), 'yyyy/MM/dd');
    let time = this.checklistPlanForm.controls.byDefaultTime.value ?? this._sharedService.formatDate(new Date(), 'HH:mm:ss');
    if (time.length === 5) {
      time = `${time}:00`;
    }
    let byDefaulDAT = null;
    try {
      byDefaulDAT = new Date(`${date}' '${time}`)
    } catch (error) {
      byDefaulDAT = null;
    }          
    this.checklistPlanForm.controls.specificDate.setValue(byDefaulDAT);
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
