import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { ApplicationModules, ButtonActions, GoTopButtonStatus, ProfileData, SettingsData, ToolbarButtonClicked, ToolbarElement } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { AppState, selectSettingsData } from 'src/app/state';
import { SharedService } from 'src/app/shared/services';
import { EMPTY, Observable, catchError, tap } from 'rxjs';
import { MoldItem } from 'src/app/molds';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CatalogsService } from '../../services';
import { GeneralCatalogData, GeneralCatalogParams, GeneralHardcodedValuesData, emptyGeneralCatalogData, emptyGeneralHardcodedValuesData } from '../../models';

@Component({
  selector: 'app-catalog-mold-edition',
  templateUrl: './catalog-mold-edition.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-mold-edition.component.scss']
})
export class CatalogMoldEditionComponent {
  @ViewChild('moldCatalogEdition') private moldCatalogEdition: ElementRef;

  // Variables ===============
  scroll$: Observable<any>;;
  showGoTop$: Observable<GoTopButtonStatus>;
  settingsData$: Observable<SettingsData>; 

  providers$: Observable<any>; 
  manufacturers$: Observable<any>; 
  moldTypes$: Observable<any>;   
  moldClasses$: Observable<any>;
  moldThresholdTypes$: Observable<any>;
  formFieldsChanges$: Observable<any>;
  
  providers: GeneralCatalogData = emptyGeneralCatalogData; 
  manufacturers: GeneralCatalogData = emptyGeneralCatalogData; 
  moldTypes: GeneralCatalogData = emptyGeneralCatalogData; 
  moldClasses: GeneralCatalogData = emptyGeneralCatalogData; 
  moldThresholdTypes: GeneralHardcodedValuesData = emptyGeneralHardcodedValuesData; 
  
  byDefaultIconPath: string = 'assets/icons/treasure-chest.svg';
  today = new Date();  
  order: any = JSON.parse(`{ "name": "${'ASC'}" }`);
  harcodeValuesOrder: any = JSON.parse(`{ "friendlyText": "${'ASC'}" }`);

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

  moldForm = new FormGroup({
    name: new FormControl(
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
  });
 
  constructor(
    private _store: Store<AppState>,
    private _sharedService: SharedService,
    private _catalogsService: CatalogsService,
    private router: Router,
    public _scrollDispatcher: ScrollDispatcher,
  ) {}

// Hooks ====================
  ngOnInit() {
    // this.moldForm.get('name').disable();
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
        this.requestMoldTypessData(currentPage)
        this.requestMoldClassesData(currentPage)
        this.requestMoldThresholdTypesData(currentPage)
      })
    );    
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
        const accumulatedItems = this.moldTypes.items?.concat(data?.data?.generics?.items);        
        this.moldTypes = {
          ...this.moldTypes,
          loading: false,
          pageInfo: data?.data?.generics?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.generics?.totalCount,          
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
        const accumulatedItems = this.moldClasses.items?.concat(data?.data?.generics?.items);        
        this.moldClasses = {
          ...this.moldClasses,
          loading: false,
          pageInfo: data?.data?.generics?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.generics?.totalCount,          
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
    if (action.from === ApplicationModules.MOLDS_CATALOG_EDITION) {
      if (action.action === ButtonActions.BACK) {        
        this.router.navigateByUrl('/catalogs/molds');        
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
      type: 'button',
      caption: $localize`Eliminar`,
      tooltip: $localize`Elimina el registro...`,
      class: '',
      icon: 'garbage-can',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: true,
      showCaption: true,
      loading: false,
      disabled: true,
      action: ButtonActions.DELETE,
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
    
  }

  requestProvidersData(currentPage: number, filter: string = null) {    
    this.providers = {
      ...this.providers,
      currentPage,
      loading: true,
    }    
    let filterStr = null;
    if (filter) {
      filterStr = JSON.parse(`{ "name": { "contains": "${filter}" } }`);
    }      
    const skipRecords = this.providers.items.length;    
    this.providers$ = this._catalogsService.getpProvidersLazyLoadingDataGql$(skipRecords, this.takeRecords, filterStr, this.order)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.providers.items?.concat(data?.data?.providers?.items);        
        this.providers = {
          ...this.providers,
          loading: false,
          pageInfo: data?.data?.providers?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.providers?.totalCount,          
        }

      }),
      catchError(() => EMPTY)
    )    
  }

  requestManufacturersData(currentPage: number, filter: string = null) {    
    this.manufacturers = {
      ...this.manufacturers,
      currentPage,
      loading: true,
    }    
    let filterStr = null;
    if (filter) {
      filterStr = JSON.parse(`{ "name": { "contains": "${filter}" } }`);
    }      
    const skipRecords = this.manufacturers.items.length;    
    this.manufacturers$ = this._catalogsService.getManufacturersLazyLoadingDataGql$(skipRecords, this.takeRecords, filterStr, this.order)
    .pipe(
      tap((data: any) => {                
        const accumulatedItems = this.manufacturers.items?.concat(data?.data?.manufacturers?.items);        
        this.manufacturers = {
          ...this.manufacturers,
          loading: false,
          pageInfo: data?.data?.manufacturers?.pageInfo,
          items: accumulatedItems,
          totalCount: data?.data?.manufacturers?.totalCount,          
        }

      }),
      catchError(() => EMPTY)
    )    
  }

  requestGenericsData$(currentPage: number, skipRecords: number, catalog: string, filterStr: string = null): Observable<any> {    
    let filter = null;
    if (filterStr) {
      filter = JSON.parse(`{ "tableName": { "eq": "${catalog}" }, "and": { "name": { "contains": "${filterStr}" } } }`);
    } else {
      filter = JSON.parse(`{ "tableName": { "eq": "${catalog}" } }`);
    }        
    return this._catalogsService.getGenericsLazyLoadingDataGql$(skipRecords, this.takeRecords, filter, this.order).pipe();
  }

  requestHardcodedValuesData$(currentPage: number, skipRecords: number, catalog: string): Observable<any> {    
    const filter = JSON.parse(`{ "tableName": { "eq": "${catalog}" } }`);
    return this._catalogsService.getHardcodedValuesDataGql$(skipRecords, this.takeRecords, filter, this.harcodeValuesOrder).pipe();
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

  handleOptionSelected(getMoreDataParams: any){
    console.log('[handleOptionSelected]', getMoreDataParams)
  }

  handleInputKeydown(event: KeyboardEvent) {
    console.log('[handleInputKeydown]', event)
  }

// End ======================
}
