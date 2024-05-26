import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { Location } from '@angular/common'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, CapitalizationMethod, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, toolbarMode } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AppState, loadMoldData, selectLoadingMoldState, selectMoldData, selectSettingsData, updateMoldTranslations } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, Subscription, catchError, skip, startWith, tap } from 'rxjs';
import { MoldDetail, MoldItem, emptyMoldItem } from 'src/app/molds';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { CatalogsService } from '../../services';
import { GeneralCatalogData, GeneralCatalogParams, GeneralHardcodedValuesData, MaintenanceHistoricalData, MaintenanceHistoricalDataItem, MoldControlStates, MoldThresoldTypes, emptyGeneralCatalogData, emptyGeneralCatalogItem, emptyGeneralHardcodedValuesData, emptyGeneralHardcodedValuesItem, emptyMaintenanceHistoricalData } from '../../models';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomValidators } from '../../custom-validators';
import { GenericDialogComponent, TranslationsDialogComponent } from 'src/app/shared/components';


interface MoldParameters {
  settingType: string,
  recosrdsToSkip?: number,
  recosrdsToTake?: number,
  filterBy?: any,
  orderBy?: any,
  id?: number,
  customerId?: number,
  status?: string,
}

@Component({
  selector: 'app-catalog-mold-edition',
  templateUrl: './catalog-mold-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-mold-edition.component.scss']
})
export class CatalogMoldEditionComponent {
  @ViewChild('moldCatalogEdition') private moldCatalogEdition: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild('f') private thisForm: NgForm;

  // Variables ===============
  mold: MoldDetail = emptyMoldItem;
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  providers$: Observable<any>; 
  manufacturers$: Observable<any>; 
  moldTypes$: Observable<any>;
  moldClasses$: Observable<any>;
  moldThresholdTypes$: Observable<any>;
  labelColors$: Observable<any>;
  states$: Observable<any>;
  partNumbers$: Observable<any>;
  lines$: Observable<any>;
  equipments$: Observable<any>;
  maintenances$: Observable<any>;
  moldThresholdTypeChanges$: Observable<any>;
  // moldFormChanges$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>;    
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  mold$: Observable<MoldDetail>;
  translations$: Observable<any>;
  moldDataLoading$: Observable<boolean>;
  updateMold$: Observable<boolean>;
  
  moldFormChangesSubscription: Subscription;
  
  providers: GeneralCatalogData = emptyGeneralCatalogData; 
  manufacturers: GeneralCatalogData = emptyGeneralCatalogData; 
  moldTypes: GeneralCatalogData = emptyGeneralCatalogData; 
  moldClasses: GeneralCatalogData = emptyGeneralCatalogData; 
  moldThresholdTypes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  labelColors: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  states: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  partNumbers: GeneralCatalogData = emptyGeneralCatalogData; 
  lines: GeneralCatalogData = emptyGeneralCatalogData; 
  equipments: GeneralCatalogData = emptyGeneralCatalogData; 
  maintenances: MaintenanceHistoricalData = emptyMaintenanceHistoricalData; 

  uploadFiles: Subscription;
  
  byDefaultIconPath: string = 'assets/icons/treasure-chest.svg';
  today = new Date();  
  order: any = JSON.parse(`{ "translatedName": "${'ASC'}" }`);
  harcodeValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);
  orderMaintenance: any = JSON.parse(`{ "maintenanceDate": "${'DESC'}" }`);

  loading: boolean;
  elements: ToolbarElement[] = [];  
  panelOpenState: boolean[] = [true, false, false];
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  filterMoldsBy: string;
  moldData: MoldItem;  
  goTopButtonTimer: any;
  takeRecords: number;

  moldInitialValues: any = null;

  moldForm = new FormGroup({
    description: new FormControl(
      '', 
      Validators.required,      
    ),
    serialNumber: new FormControl(
      '', 
      Validators.required,      
    ),
    startingDate: new FormControl(''),
    provider: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    manufacturer: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    notes: new FormControl(''),
    moldType: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    moldClass: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    manufacturingDate: new FormControl(''),
    thresholdType: new FormControl(''),
    thresholdState: new FormControl(''),
    thresholdYellow: new FormControl(''),
    thresholdRed: new FormControl(''),
    thresholdDaysYellow: new FormControl(''),
    thresholdDaysRed: new FormControl(''),
    partNumber: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    position: new FormControl(''),
    label: new FormControl(emptyGeneralHardcodedValuesItem),
    state: new FormControl(emptyGeneralHardcodedValuesItem),
    mainImageName: new FormControl(''),    
    line: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    equipment: new FormControl(emptyGeneralCatalogItem, [ CustomValidators.statusIsInactiveValidator() ]),
    reference: new FormControl(''),    
  });

  maintenanceHistoricalTableColumns: string[] = ['date', 'provider', 'operator', 'state', 'notes', 'actions'];
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
  historicalItemsLabel: string = "";

  // Temporal
  tmpDays: number = 112;

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
    // this.moldForm.get('name').disable();
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.MOLDS_CATALOG_EDITION,
      true,
    );
    this.moldInitialValues = this.moldForm.value;
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
        // this.requestMaintenancesData(currentPage);
        // this.requestMoldTypessData(currentPage);
        // this.requestMoldClassesData(currentPage);
        this.requestMoldThresholdTypesData(currentPage);
        this.requestLabelColorsData(currentPage);
        this.requestStatesData(currentPage);
      })
    );   
    this.moldThresholdTypeChanges$ = this.moldForm.controls.thresholdType.valueChanges.pipe(
      startWith(''),
      tap(moldThresholdTypeChanges => {
        if (moldThresholdTypeChanges?.value === MoldThresoldTypes.N_A) {
          this.moldForm.get('moldThresholdYellow').disable();
          this.moldForm.get('moldThresholdRed').disable();
          this.moldForm.get('moldThresholdDaysYellow').disable();
          this.moldForm.get('moldThresholdDaysRed').disable();
        } else if (moldThresholdTypeChanges?.value === MoldThresoldTypes.HITS) {
          this.moldForm.get('moldThresholdYellow').enable();
          this.moldForm.get('moldThresholdRed').enable();
          this.moldForm.get('moldThresholdDaysYellow').disable();
          this.moldForm.get('moldThresholdDaysRed').disable();
        } else if (moldThresholdTypeChanges?.value === MoldThresoldTypes.DAYS) {
          this.moldForm.get('moldThresholdYellow').disable();
          this.moldForm.get('moldThresholdRed').disable();
          this.moldForm.get('moldThresholdDaysYellow').enable();
          this.moldForm.get('moldThresholdDaysRed').enable();
        } else if (moldThresholdTypeChanges?.value === MoldThresoldTypes.BOTH) {
          this.moldForm.get('moldThresholdYellow').enable();
          this.moldForm.get('moldThresholdRed').enable();
          this.moldForm.get('moldThresholdDaysYellow').enable();
          this.moldForm.get('moldThresholdDaysRed').enable();
        }
      })
    );
    this.moldFormChangesSubscription = this.moldForm.valueChanges.subscribe((moldFormChanges: any) => {
      if (!this.mold.id || this.mold.id === null || this.mold.id === 0) {
        this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
      } else {
        this.setToolbarMode(toolbarMode.EDITING_WITH_DATA);
      }
      if (moldFormChanges.thresholdYellow && moldFormChanges.thresholdRed && (+moldFormChanges.thresholdYellow >= +moldFormChanges.thresholdRed)) {
        this.moldForm.controls.thresholdYellow.setErrors({ invalidValue: true });
      } else {
        this.moldForm.controls.thresholdYellow.setErrors(null);
      }
      if (moldFormChanges.thresholdDaysYellow && moldFormChanges.thresholdDaysRed && (+moldFormChanges.thresholdDaysYellow >= +moldFormChanges.thresholdDaysRed)) {
        this.moldForm.controls.thresholdDaysYellow.setErrors({ invalidValue: true });
      } else {
        this.moldForm.controls.thresholdDaysYellow.setErrors(null);
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
    this.mold$ = this._store.select(selectMoldData).pipe(
      skip(1),
      tap((moldData) => {
        this.mold = JSON.parse(JSON.stringify(moldData));
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).caption = this.mold.translations.length > 0 ? $localize`Traducciones (${this.mold.translations.length})` : $localize`Traducciones`;
        this.elements.find(e => e.action === ButtonActions.TRANSLATIONS).class = this.mold.translations.length > 0 ? 'accent' : '';      
        this.updateFormFromData();
        this.changeInactiveButton(this.mold.status);
        const toolbarButton = this.elements.find(e => e.action === ButtonActions.TRANSLATIONS);
        if (toolbarButton) {
          toolbarButton.caption = moldData.translations.length > 0 ? $localize`Traducciones (${moldData.translations.length})` : $localize`Traducciones`;
          toolbarButton.tooltip = $localize`Agregar traducciones al registro...`;
          toolbarButton.class = moldData.translations.length > 0 ? 'accent' : '';
        }        
        this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);      
      })
    );
    this.moldDataLoading$ = this._store.select(selectLoadingMoldState).pipe(
      tap( loading => {
        this.loading = loading;
        this._sharedService.setGeneralLoading(
          ApplicationModules.MOLDS_CATALOG_EDITION,
          loading,
        );
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.MOLDS_CATALOG_EDITION,
          loading,
        );         
      })
    );
    this.calcElements();        
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

  requestMoldTypessData(currentPage: number, filterStr: string = null) {
    this.moldTypes = {
      ...this.moldTypes,
      currentPage,
      loading: true,
    } 
    const skipRecords = this.moldTypes.items.length;
    this.moldTypes$ = this.requestGenericsData$(currentPage, skipRecords, 'mold-types', filterStr)
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
    this.moldClasses$ = this.requestGenericsData$(currentPage, skipRecords, 'mold-classes', filterStr)
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
    this.moldThresholdTypes$ = this.requestHardcodedValuesData$(0, 0, 'mold-control-strategies')
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
    this.labelColors$ = this.requestHardcodedValuesData$(0, 0, 'mold-label-color')
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
    this.states$ = this.requestHardcodedValuesData$(0, 0, 'mold-states')
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

  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this._sharedService.setToolbar({
          from: ApplicationModules.MOLDS_CATALOG_EDITION,
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
          this._location.replaceState("/catalogs/molds/create");
          this.initForm();
          this.elements.find(e => e.action === action.action).loading = false;          
        }
      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;        
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/catalogs/molds');    
        }, 750);
      } else if (action.action === ButtonActions.COPY) {               
        this.elements.find(e => e.action === action.action).loading = true;
        this.initUniqueField();
        this._location.replaceState("/catalogs/molds/create");        
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this.setToolbarMode(toolbarMode.EDITING_WITH_NO_DATA);
        }, 750);        
      } else if (action.action === ButtonActions.SAVE) {        
        this.elements.find(e => e.action === action.action).loading = true;
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
              const variables = this.setGraphqlVariables(moldParameters);
              this.updateMold$ = this._catalogsService.updateMoldStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateMold.length > 0 && data?.data?.createOrUpdateMold[0].status === RecordStatus.INACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.INACTIVE)
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
              const variables = this.setGraphqlVariables(moldParameters);
              this.updateMold$ = this._catalogsService.updateMoldStatus$(variables)
              .pipe(
                tap((data: any) => {
                  if (data?.data?.createOrUpdateMold.length > 0 && data?.data?.createOrUpdateMold[0].status === RecordStatus.ACTIVE) {
                    setTimeout(() => {                      
                      this.changeInactiveButton(RecordStatus.ACTIVE)
                      const message = $localize`El Molde ha sido reactivado`;
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
        if (this.mold?.id > 0 && this.mold.status === RecordStatus.ACTIVE) {
          const dialogResponse = this._dialog.open(TranslationsDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              duration: 0,
              translationsUpdated: false,
              title: $localize`Traducciones del molde <strong>${this.mold.id}</strong>`,
              topIcon: 'world',
              translations: JSON.parse(JSON.stringify(this.mold.translations)),
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
                message: $localize`Esta acción inactivará el molde ${this.mold.id} y ya no estará activo en el sistema.<br><br><strong>¿Desea continuar?</strong>`,
              },
              showCloseButton: false,
            },
          });
          dialogResponse.afterClosed().subscribe((response) => {
            if (response.translationsUpdated) {
              this._store.dispatch(updateMoldTranslations({ 
                translations: response.translations,
              }));
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
      tooltip:  $localize`Regresar a la lista de moldes`,
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
      disabled: this.mold?.status !== RecordStatus.ACTIVE,
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
      disabled: !!!this.mold.id,
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
    setTimeout(() => {
      this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;   
    }, 100);
    this.moldForm.markAllAsTouched();
    this.moldForm.updateValueAndValidity();
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
    const variables = this.setGraphqlVariables(moldParameters);
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
    const variables = this.setGraphqlVariables(moldParameters);    
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
    const variables = this.setGraphqlVariables(moldParameters);     
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
    const variables = this.setGraphqlVariables(moldParameters);     
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
    const variables = this.setGraphqlVariables(moldParameters);     
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
    this.maintenances = {
      ...this.maintenances,
      currentPage,
      loading: true,
    }   
    filterStr = this.mold?.id?.toString(); 
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "moldId": { "eq": ${filterStr} }, "and": { "status": { "eq": "${RecordStatus.ACTIVE}" } } }`);
    }      
    const skipRecords = this.maintenances.items.length;    
    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.orderMaintenance
    }    
    const variables = this.setGraphqlVariables(moldParameters);         
    this.maintenances$ = this._catalogsService.getMaintenancesLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.maintenances.items?.concat(data?.data?.maintenanceHistorical?.items);        
        this.maintenances = {
          ...this.maintenances,
          loading: false,
          pageInfo: data?.data?.maintenanceHistorical?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.maintenanceHistorical?.totalCount,          
        }
        this.historicalItemsLabel = $localize`Hay ${this.maintenances.items?.length} registro(s)`;
        this.maintenanceHistorical = new MatTableDataSource<MaintenanceHistoricalDataItem>(accumulatedItems);
        this.maintenanceHistorical.paginator = this.paginator;

      }),
      catchError(() => EMPTY)
    )    
  }

  requestMoldData(moldId: number): void { 
    let variables = undefined;
    variables = { moldId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "moldId": { "eq": ${moldId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order
    }
    const translationsVariables = this.setGraphqlVariables(moldParameters);

    this._store.dispatch(loadMoldData({ 
      moldId,
      skipRecords, 
      takeRecords: this.takeRecords,
      filter,
      order,
    }));    
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
    const variables = this.setGraphqlVariables(moldParameters);   
    return this._catalogsService.getGenericsLazyLoadingDataGql$(variables).pipe();
  }

  requestHardcodedValuesData$(currentPage: number, skipRecords: number, catalog: string): Observable<any> {    
    const filter = JSON.parse(`{ "tableName": { "eq": "${catalog}" } }`);
    const moldParameters = {
      settingType: 'tables',
      skipRecords, 
      takeRecords: this.takeRecords, 
      filter, 
      order: this.harcodeValuesOrder,
    }    
    const variables = this.setGraphqlVariables(moldParameters);
    return this._catalogsService.getHardcodedValuesDataGql$(variables).pipe();
  }

  getMoreData(getMoreDataParams: GeneralCatalogParams) {
    if (getMoreDataParams.catalogName === 'providers') {
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

    } else if (getMoreDataParams.catalogName === 'manufacturers') {
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

    } else if (getMoreDataParams.catalogName === 'lines') {
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
      
    } else if (getMoreDataParams.catalogName === 'equipments') {
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

    } else if (getMoreDataParams.catalogName === 'partNumbers') {
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
      

    } else if (getMoreDataParams.catalogName === 'moldTypes') {
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
      
    } else if (getMoreDataParams.catalogName === 'moldClasses') {
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
    }
    
  }

  onFileSelected(event: any) {
    const fd = new FormData();
    fd.append("image", event.target.files[0], event.target.files[0].name);

    const uploadUrl = `${environment.apiUploadUrl}`;
    const params = new HttpParams()
    .set('destFolder', `${environment.uploadFolders.catalogs}/molds`)
    .set('processId', this.mold.id)
    .set('process', 'catalogs-molds');

    this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
      if (res) {
        this.moldForm.controls.mainImageName.setValue(res.fileName);
        this.mold.mainImagePath = environment.serverUrl + '/' + res.filePath.replace(res.fileName, `${res.fileGuid}${res.fileExtension}`)
        this.mold.mainImageGuid = res.fileGuid;
        const message = $localize`El archivo ha sido subido satisfactoriamente`;
        this._sharedService.showSnackMessage({
          message,      
          snackClass: 'snack-primary',
          icon: 'check',        
        });
      }      
    });
  }

  handleOptionSelected(getMoreDataParams: any){
    console.log('[handleOptionSelected]', getMoreDataParams)
  }

  handleInputKeydown(event: KeyboardEvent) {
    console.log('[handleInputKeydown]', event)
  }

  handleAddHistoricalButtonClick() {

  }

  handleRemoveAllHistoricalButtonClick() {

  }

  editMaintenance(id: number) {

  }

  removeMaintenance(id: number) {
    
  }

  setGraphqlVariables(moldParameters: MoldParameters): any {
    const { settingType, recosrdsToSkip, recosrdsToTake, filterBy, orderBy, id, customerId, status} = moldParameters;

    let variables = undefined;    
    if (settingType === 'tables') {
      if (recosrdsToSkip !== 0) {
        variables = { recosrdsToSkip };
      }
      if (recosrdsToTake !== 0) {
        if (variables) {         
          variables = { ...variables, recosrdsToTake };
        } else {
          variables = { recosrdsToTake };
        }      
      }
      if (orderBy) {
        if (variables) {         
          variables = { ...variables, orderBy };
        } else {
          variables = { orderBy };
        }
      }        
      if (filterBy) {
        if (variables) {         
          variables = { ...variables, filterBy };
        } else {
          variables = { filterBy };
        }    
      }
    } else if (settingType === 'status') {
      variables = { id, customerId, status };      
    }
    
    return variables;
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
      thresholdDaysRed: this.mold.thresholdDaysRed?.toString(),
      thresholdDaysYellow: this.mold.thresholdDaysYellow?.toString(),
      thresholdRed: this.mold.thresholdRed?.toString(),
      thresholdYellow: this.mold.thresholdYellow?.toString(),      
      thresholdType: this.mold.thresholdType,      
      thresholdState: this.mold.thresholdState,
      mainImageName: this.mold.mainImageName,
      label: this.mold.label,      
      state: this.mold.state,
      startingDate: this.mold.startingDate,
    });
  } 

  prepareRecordToAdd(): any {
    const fc = this.moldForm.controls;
    if (fc.startingDate) {
      if (!this._sharedService.isDateValid(this._sharedService.formatDate(fc.startingDate))) {
        fc.startingDate = null;
      }
    }
    return  {
      ...(fc.description.dirty) && { description: fc.description.value  },
      ...(fc.serialNumber.dirty) && { serialNumber: fc.serialNumber.value },
      ...(fc.reference.dirty) && { reference: fc.reference.value },
      ...(fc.notes.dirty) && { notes: fc.notes.value },
      ...(fc.startingDate.dirty) && { startingDate: fc.startingDate.value },
      ...(fc.moldType.dirty) && { moldType: fc.moldType.value },      
      ...(fc.moldClass.dirty) && { moldClass: fc.moldClass.value },      
      ...(fc.moldType.dirty) && { moldType: fc.moldType.value },      
      ...(fc.moldType.dirty) && { moldType: fc.moldType.value },      
      ...(fc.moldType.dirty) && { moldType: fc.moldType.value },      
    }
  } 

  initForm(): void {
    this.moldForm.reset();
    this.maintenances.items = [];
    this.mold = emptyMoldItem;    
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

  get MoldControlStates() {
    return MoldControlStates;
  }

// End ======================
}
