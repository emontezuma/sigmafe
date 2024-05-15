import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, CapitalizationMethod, GoTopButtonStatus, PageInfo, ProfileData, RecordStatus, SettingsData, ToolbarButtonClicked, ToolbarElement, toolbarMode } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, catchError, map, startWith, tap } from 'rxjs';
import { MoldDetail, MoldItem, emptyMoldItem } from 'src/app/molds';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { CatalogsService } from '../../services';
import { GeneralCatalogData, GeneralCatalogParams, GeneralHardcodedValuesData, MaintenanceHistoricalData, MaintenanceHistoricalDataItem, MoldControlStates, MoldThresoldTypes, emptyGeneralCatalogData, emptyGeneralHardcodedValuesData, emptyMaintenanceHistoricalData } from '../../models';
import { environment } from 'src/environments/environment';

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
  moldFormChanges$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>;    
  toolbarAnimationFinished$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  mold$: Observable<MoldDetail>;
  
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
  moldState: string = MoldControlStates.RED;
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
    provider: new FormControl(''),
    manufacturer: new FormControl(''),
    notes: new FormControl(''),
    moldType: new FormControl(''),
    moldClass: new FormControl(''),
    manufacturingDate: new FormControl(''),
    moldThresholdType: new FormControl(''),
    moldThresholdYellow: new FormControl(''),
    moldThresholdRed: new FormControl(''),
    moldThresholdDaysYellow: new FormControl(''),
    moldThresholdDaysRed: new FormControl(''),
    partNumber: new FormControl(''),
    position: new FormControl(''),
    labelColor: new FormControl(''),
    state: new FormControl(''),
    mainImagePath: new FormControl(''),
    line: new FormControl(''),
    equipment: new FormControl(''),
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
  tmpHits: number = 3200;
  tmpDays: number = 112;
 
  constructor(
    private _store: Store<AppState>,
    private _sharedService: SharedService,
    private _catalogsService: CatalogsService,
    private router: Router,
    public _scrollDispatcher: ScrollDispatcher,
    private route: ActivatedRoute
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
        this.requestProvidersData(currentPage);      
        this.requestManufacturersData(currentPage);
        this.requestPartNumbersData(currentPage);
        this.requestLinesData(currentPage);
        this.requestEquipmentsData(currentPage);
        this.requestMaintenancesData(currentPage);
        this.requestMoldTypessData(currentPage);
        this.requestMoldClassesData(currentPage);
        this.requestMoldThresholdTypesData(currentPage);
        this.requestLabelColorsData(currentPage);
        this.requestStatesData(currentPage);
      })
    );   
    this.moldThresholdTypeChanges$ = this.moldForm.get('moldThresholdType').valueChanges.pipe(
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
    this.moldFormChanges$ = this.moldForm.valueChanges.pipe(
      tap(moldFormChanges => {
        this.setToolbarMode(toolbarMode.SAVE, true);
        this.setToolbarMode(toolbarMode.CANCEL, true);
        this.mold = moldFormChanges;        
      })
    );
    this.toolbarAnimationFinished$ = this._sharedService.toolbarAnimationFinished.pipe(
      tap((animationFinished: boolean) => {
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.MOLDS_CATALOG_EDITION,
          !animationFinished,
        );         
      }
    ));
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.MOLDS_CATALOG_EDITION) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));
    this.parameters$ = this.route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.requestMoldData(+params['id']);
        }
      })
    )
    // this.moldForm.reset(this.mold);
  }

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
        const accumulatedItems = this.moldTypes.items?.concat(data?.data?.genericsPaginated?.items);        
        this.moldTypes = {
          ...this.moldTypes,
          loading: false,
          pageInfo: data?.data?.genericsPaginated?.pageInfo,
          items: accumulatedItems,
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
        const accumulatedItems = this.moldClasses.items?.concat(data?.data?.genericsPaginated?.items);        
        this.moldClasses = {
          ...this.moldClasses,
          loading: false,
          pageInfo: data?.data?.genericsPaginated?.pageInfo,
          items: accumulatedItems,
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
  }
  
// Functions ================
  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this.calcElements();
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
    if (action.action === ButtonActions.BACK) {       
      this.elements[action.buttonIndex].loading = true; 
      this.router.navigateByUrl('/catalogs/molds');    
      setTimeout(() => {
        this.elements[action.buttonIndex].loading = false;   
      }, 750);
    } else if (action.action === ButtonActions.SAVE) {
      this.elements[action.buttonIndex].loading = true;       
      this.thisForm.ngSubmit.emit();
    } else if (action.action === ButtonActions.CANCEL) { 
      if (!this.mold.id || this.mold.id === 0) {
        this.elements[action.buttonIndex].loading = true;       
        this.mold = emptyMoldItem;
        const message = $localize`Edición cancelada`;
        this._sharedService.showSnackMessage({
          message,      
          duration: 0,
          snackClass: 'snack-primary',
          icon: '',
          buttonText: '',
          buttonIcon: '',
        });
        setTimeout(() => {
          this.setToolbarMode(toolbarMode.SAVE, false);
          this.setToolbarMode(toolbarMode.CANCEL, false);
          this.elements[action.buttonIndex].loading = false;   
        }, 100);
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
      locked: false,
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
      locked: false,
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
      locked: false,
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
      locked: true,
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
      locked: false,
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
      locked: false,
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
      locked: true,
      showCaption: true,
      loading: false,
      disabled: true,
      action: ButtonActions.SAVE,
    },{
      type: 'button',
      caption: $localize`Inactivar`,
      tooltip: $localize`Inactivar el registro...`,
      class: '',
      icon: 'delete',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: true,
      showCaption: true,
      loading: false,
      disabled: true,
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
      locked: false,
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
      locked: true,
      showCaption: true,
      loading: false,
      disabled: true,
      action: ButtonActions.TRANSLATION,
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
      this.elements[3].loading = false;   
    }, 200);
    console.log('entro aqui');    
    this.moldForm.markAllAsTouched();
  }

  requestProvidersData(currentPage: number, filterStr: string = null) {    
    this.providers = {
      ...this.providers,
      currentPage,
      loading: true,
    }    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "translatedName": { "contains": "${filterStr}" } }`);
    }      
    const skipRecords = this.providers.items.length;
    const variables = this.setGraphqlVariables(skipRecords, this.takeRecords, filter, this.order);
    this.providers$ = this._catalogsService.getpProvidersLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {
        const mappedItems = data?.data?.providersPaginated?.items.map((item) => {
          return {
            isTranslated: item.isTranslated,
            translatedName: item.translatedName,
            translatedReference: item.translatedReference,
            id: item.data.id,
          }
        })
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
      filter = JSON.parse(`{ "translatedName": { "contains": "${filterStr}" } }`);
    }      
    const skipRecords = this.manufacturers.items.length;
    const variables = this.setGraphqlVariables(skipRecords, this.takeRecords, filter, this.order);
    this.manufacturers$ = this._catalogsService.getManufacturersLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.manufacturers.items?.concat(data?.data?.manufacturersPaginated?.items);        
        this.manufacturers = {
          ...this.manufacturers,
          loading: false,
          pageInfo: data?.data?.manufacturersPaginated?.pageInfo,
          items: accumulatedItems,
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
      filter = JSON.parse(` { "or": [ { "translatedName": { "contains": "${filterStr}" } }, { "translatedReference": { "contains": "${filterStr}" } } ] } `);      
    }      
    const skipRecords = this.partNumbers.items.length;
    const variables = this.setGraphqlVariables(skipRecords, this.takeRecords, filter, this.order);
    this.partNumbers$ = this._catalogsService.getPartNumbersLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.partNumbers.items?.concat(data?.data?.partNumbersPaginated?.items);        
        this.partNumbers = {
          ...this.partNumbers,
          loading: false,
          pageInfo: data?.data?.partNumbersPaginated?.pageInfo,
          items: accumulatedItems,
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
      filter = JSON.parse(`{ "translatedName": { "contains": "${filterStr}" } }`);
    }      
    const skipRecords = this.lines.items.length;
    const variables = this.setGraphqlVariables(skipRecords, this.takeRecords, filter, this.order);
    this.lines$ = this._catalogsService.getLinesLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.lines.items?.concat(data?.data?.linesPaginated?.items);        
        this.lines = {
          ...this.lines,
          loading: false,
          pageInfo: data?.data?.linesPaginated?.pageInfo,
          items: accumulatedItems,
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
      filter = JSON.parse(`{ "translatedName": { "contains": "${filterStr}" } }`);
    }      
    const skipRecords = this.equipments.items.length;    
    const variables = this.setGraphqlVariables(skipRecords, this.takeRecords, filter, this.order);
    this.equipments$ = this._catalogsService.getEquipmentsLazyLoadingDataGql$(variables)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.equipments.items?.concat(data?.data?.equipmentsPaginated?.items);        
        this.equipments = {
          ...this.equipments,
          loading: false,
          pageInfo: data?.data?.equipmentsPaginated?.pageInfo,
          items: accumulatedItems,
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
    const variables = this.setGraphqlVariables(skipRecords, this.takeRecords, filter, this.orderMaintenance);
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
    this.viewLoading(true);
    let variables = undefined;
    variables = { moldId, customerId: 1 };
    this.mold$ = this._catalogsService.getMoldDataGql$(variables).pipe(
      tap((data: any) => {                
        this.mold = data?.data?.mold;  
        this.updateFormFromData();
        this.viewLoading(false);
      }),
      catchError(() => EMPTY)
    )    
  }  

  requestGenericsData$(currentPage: number, skipRecords: number, catalog: string, filterStr: string = null): Observable<any> {    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "and": [ { "data": { "tableName": { "eq": "${catalog}" } } }, { "translatedName": { "contains": "${filterStr}" } } ] }`);
    } else {
      filter = JSON.parse(`{ "data": { "tableName": { "eq": "${catalog}" } } }`);
    }
    const variables = this.setGraphqlVariables(skipRecords, this.takeRecords, filter, this.order);
    return this._catalogsService.getGenericsLazyLoadingDataGql$(variables).pipe();
  }

  requestHardcodedValuesData$(currentPage: number, skipRecords: number, catalog: string): Observable<any> {    
    const filter = JSON.parse(`{ "tableName": { "eq": "${catalog}" } }`);
    const variables = this.setGraphqlVariables(skipRecords, this.takeRecords, filter, this.harcodeValuesOrder);
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
    this.moldForm.get('mainImagePath').setValue(environment.serverImagesPath + event.target.files[0].name);
    const fd = new FormData();
    fd.append("image", event.target.files[0], event.target.files[0].name);    
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

  setGraphqlVariables(recosrdsToSkip: number, recosrdsToTake: number, filterBy: any, orderBy: any): any {
    let variables = undefined;
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
    return variables;
  }

  getMoldStateClass() {
    return this.moldState === MoldControlStates.RED ? 'mold-state-label-red' : this.moldState === MoldControlStates.YELLOW ? 'mold-state-label-yellow' : 'state-null';
  }

  getMoldStateLabel() {
    return this.moldState === MoldControlStates.RED ?    
    $localize`El Molde está <strong>ALARMADO!</strong> desde el <strong>${this._sharedService.capitalization(this._sharedService.formatDate(this.today, 'EEEE d MMM yyyy hh:mm:ss a'), CapitalizationMethod.FIRST_LETTER_PHRASE)}</strong>` :
    this.moldState === MoldControlStates.YELLOW ? 
    $localize`El Molde está <strong>Advertido!</strong> desde el <strong>${this._sharedService.capitalization(this._sharedService.formatDate(this.today, 'EEEE d MMM yyyy hh:mm:ss a'), CapitalizationMethod.FIRST_LETTER_PHRASE)}</strong>` : '';
  }

  pageChange(event: any) {
    this.pageInfo = { 
      ...this.pageInfo, 
      currentPage: event?.pageIndex, 
    };    
    //this.requestData(this.pageInfo.currentPage * this.pageInfo.pageSize, this.pageInfo.pageSize, this.order);
  }

  setToolbarMode(mode: toolbarMode, state: boolean) {
    if (mode === toolbarMode.SAVE && this.elements[3].disabled !== !state) {
      this.elements[3].disabled = !state;
    }
    if (mode === toolbarMode.CANCEL && this.elements[4].disabled !== !state) {
      this.elements[4].disabled = !state;
    }
  }

  viewLoading(state: boolean): void {
    this._sharedService.setGeneralLoading(
      ApplicationModules.MOLDS_CATALOG,
      state,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.MOLDS_CATALOG,
      state,
    ); 
  }

  updateFormFromData() {
    this.moldForm.patchValue({
      description: this.mold.description,
      serialNumber: this.mold.serialNumber,          
      reference: this.mold.reference,      
      notes: this.mold.notes,      
    })
  }      

  get MoldControlStates() {
    return MoldControlStates;
  }

// End ======================
}
