import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, map, skip, tap } from 'rxjs';
import { ApplicationModules, ButtonActions, PageInfo, ProfileData, SearchBox, SettingsData, Screen, ToolbarButtonClicked, ToolbarElement, AnimationStatus } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';
import { AppState } from 'src/app/state/app.state';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';
import { CatalogsService } from '../../services';
import { environment } from 'src/environments/environment';
import { PlantItem, Plants, PlantsData, emptyPlantCatalog } from '../../models';

@Component({
  selector: 'app-catalog-plants',
  templateUrl: './catalog-plants-list.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-plants-list.component.scss']
})
export class CatalogPlantsListComponent implements AfterViewInit {
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

// Plants ===============
  plantsTableColumns: string[] = ['id', 'mainImagePath', 'name', 'reference', 'company', 'status', 'updatedAt'];
  plantsCatalogData = new MatTableDataSource<PlantItem>([]);      
  
  plantsData$: Observable<PlantsData>;
  sort$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>;
  settingsData$: Observable<SettingsData>;
  profileData$: Observable<ProfileData>;
  searchBox$: Observable<SearchBox>;
  screenData$: Observable<Screen>;
  allPlantsToCsv$: Observable<any>;
  animationData$: Observable<AnimationStatus>;

  catalogIcon: string = "industry";  

  loading: boolean;
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  filterByText: string;
  allPlantsToCsv: any;
  plantsData: Plants = {
    items: new Array(5).fill(null),
  }
  pageInfo: PageInfo = {
    currentPage: 0,
    totalRecords:  0,
    totalPages: 0,
    inactiveRecords: 0,
    activeRecords: 0,
  }
  order: any = null;
  pendingToolbarButtonIndex: number = null;
  size: 'minimum' | 'medium' | 'high' | string;

  elements: ToolbarElement[] = [];
  currentTabIndex: number = 1;  

  constructor(
    private _store: Store<AppState>,
    private _sharedService: SharedService,
    private _router: Router,
    private _catalogsService: CatalogsService,
  ) { }

  // Hooks ====================
  ngOnInit() {
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.PLANTS_CATALOG,
      true,
    );
    this._sharedService.setSearchBox(
      ApplicationModules.PLANTS_CATALOG,
      true,
    );    
    // Observables
    this.screenData$ = this._store.select(selectSharedScreen).pipe(
      tap((screenData: Screen) => {          
        if (screenData?.innerWidth < 1000) {
          this.size = 'small';
        } else if (screenData?.innerWidth < 1400) {
          this.size = 'medium';
        } else {
          this.size = 'high';
        }        
        this.mapColumns();
      })
    );
    this.profileData$ = this._store.select(selectProfileData).pipe(
      tap( profileData => {
        this.profileData = profileData;
      })
    );
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap(settingsData => {
        this.settingsData = settingsData;
        this.pageInfo = {
          ...this.pageInfo,
          pageSize: this.settingsData.catalog?.pageSize || 50,
        }
        this.requestData(0, this.pageInfo.pageSize);      
      })
    );
    this.searchBox$ = this._sharedService.search.pipe(
      tap((searchBox: SearchBox) => {
        if (searchBox.from === ApplicationModules.PLANTS_CATALOG) {
          console.log(searchBox.textToSearch);
          this.filterByText = searchBox.textToSearch;    
          this.requestData(0, this.pageInfo.pageSize);      
        }
      })
    );
    this.animationData$ = this._sharedService.isAnimationFinished.pipe(
      tap((animationStatus: AnimationStatus) => {      
        if (animationStatus.isFinished && animationStatus.toState === 'ChecklistFillingComponent') {
          // this.animationFinished(null);
        }      
      })
    );
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      tap((buttonClicked: ToolbarButtonClicked) => {
        if (buttonClicked.from !== ApplicationModules.PLANTS_CATALOG) {
            return
        }
        this.toolbarAction(buttonClicked);      
      })
    );    
    this.calcElements();
  }

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.PLANTS_CATALOG,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.PLANTS_CATALOG,
      false,
    );        
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = $localize`Registros por página`;      
    }
    this.plantsCatalogData.paginator = this.paginator;
    this.plantsCatalogData.sort = this.sort;
    this.sort$ = this.sort.sortChange.pipe(
      tap((sortData: any) => {              
        this.order = null;
        this.pageInfo.currentPage = 0;
        if (sortData.direction) {
          if (sortData.active === 'status') {            
            this.order = JSON.parse(`{ "friendlyStatus": "${sortData.direction.toUpperCase()}" }`);
          } else {
            this.order = JSON.parse(`{ "data": { "${sortData.active}": "${sortData.direction.toUpperCase()}" } }`);
          }
        }
        this.requestData(0, this.pageInfo.pageSize);      
      })
    );
  }

// Functions ================
  pageChange(event: any) {
    this.pageInfo = { 
      ...this.pageInfo, 
      currentPage: event?.pageIndex, 
    };    
    this.requestData(this.pageInfo.currentPage * this.pageInfo.pageSize, this.pageInfo.pageSize);
  }

  requestData(skipRecords: number, takeRecords: number) {
    this.setViewLoading(true);
    this.plantsData = {
      items: new Array(5).fill(emptyPlantCatalog),
    }
    let filter = null;
    if (this.filterByText) {      
      const cadFilter = ` { "or": [ { "data": { "name": { "contains": "${this.filterByText}" } } }, { "data": { "reference": { "contains": "${this.filterByText}" } } } ] }`;
      filter = JSON.parse(cadFilter);                  
    }
    this.plantsCatalogData = new MatTableDataSource<PlantItem>(this.plantsData.items);
    this.plantsData$ = this._catalogsService.getPlantsDataGql$(skipRecords, takeRecords, this.order, filter)
    .pipe(
      map((plants: any) => {
        const { data } = plants;
        return { 
          ...data,
          plantsPaginated: {
            ...data.plantsPaginated,
            items: data.plantsPaginated.items.map((item) => {
              const extension = item.data.mainImageName ? item.data.mainImageName.split('.').pop() : '';          
              return {
                ...item,
                data: {
                  ...item.data,                  
                  mainImage: item.data.mainImageName ? `${environment.serverUrl}/${item.data.mainImagePath.replace(item.data.mainImageName, item.data.mainImageGuid + '.' + extension)}` : '',
                  company: {
                    ...item.data.company,
                    name: item.data.company?.translations?.length > 0 ? item.data.company.translations[0].name : item.data.company?.name,
                    isTranslated: item.data.company?.translations?.length > 0 ? true : false,
                  },
                }
              }
            })          
          }
        }
      }),
      tap( plantsData => {        
        this.setPaginator(plantsData.plantsPaginated.totalCount);
        this.plantsData = JSON.parse(JSON.stringify(plantsData.plantsPaginated));
        if (this.paginator) {
          this.paginator.pageIndex = this.pageInfo.currentPage; 
          this.paginator.length = this.pageInfo.totalRecords;
          if (this.pageInfo.currentPage * this.pageInfo.pageSize > 0) {
            this.plantsData.items = new Array(this.pageInfo.currentPage * this.pageInfo.pageSize).fill(null).concat(this.plantsData.items);
          }      
        }        
        this.plantsData.items.length = this.plantsData.totalCount;
        this.plantsCatalogData = new MatTableDataSource<PlantItem>(this.plantsData.items);
        this.plantsCatalogData.paginator = this.paginator;
        // this.plantsCatalogData.sort = this.sort;
        this.plantsCatalogData.sortData = () => this.plantsData.items;        
        if (this.elements.find(e => e.action === ButtonActions.RELOAD).loading) {
          setTimeout(() => {
            this.elements.find(e => e.action === ButtonActions.RELOAD).loading = false;                                      
          }, 200);
        }
        this.setViewLoading(false);        
      })
    );
  }

  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {        
        this._sharedService.setToolbar({
          from: ApplicationModules.PLANTS_CATALOG,
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

  setPaginator(totalRecords: number) {
    this.pageInfo = {
      ...this.pageInfo,
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / this.pageInfo.pageSize),
    }    
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.from === ApplicationModules.PLANTS_CATALOG  && this.elements.length > 0) {
      if (action.action === ButtonActions.RELOAD) {
        this.elements.find(e => e.action === action.action).loading = true;        
        this.pageInfo = {
          ...this.pageInfo,
          currentPage: 0,
          pageSize: this.settingsData.catalog?.pageSize,
        }
        this.pendingToolbarButtonIndex = 2;
        this.requestData(this.pageInfo.currentPage, this.pageInfo.pageSize);
      } else if (action.action === ButtonActions.NEW) {
        this.elements.find(e => e.action === action.action).loading = true;                
        this._router.navigateByUrl("/catalogs/plants/create");
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;                          
        }, 200);
      } else if (action.action === ButtonActions.EXPORT_TO_CSV) {        
        this.elements.find(e => e.action === action.action).loading = true;                          
        this.allPlantsToCsv$ = this._catalogsService.getAllToCsv$().pipe(
          tap(plantsToCsv => {
            const fileData$ = this._catalogsService.getAllCsvData$(plantsToCsv?.data?.exportPlantsToCsv?.exportedFilename)
            .subscribe(data => { 
              this.downloadFile(data, plantsToCsv?.data?.exportPlantsToCsv?.downloadFilename);
              setTimeout(() => {
                this.elements.find(e => e.action === action.action).loading = false;
              }, 200);
            })
          })
        );
      }
    }    
  }

  calcElements() {
    this.elements = [{
      type: 'button',
      caption: $localize`Nuevo...`,
      tooltip:  $localize`Crea un nuevo registro`,
      icon: 'document',
      class: 'primary',
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
      icon: "",
      class: '',
      iconSize: "",
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      loading: false,
      disabled: true,
      action: undefined,
    },{
      type: 'button',
      caption: $localize`Actualizar la vista`,
      tooltip:  $localize`Actualiza la vista`,
      icon: 'reload',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      loading: false,
      disabled: false,
      action: ButtonActions.RELOAD,
    },{
      type: 'button',
      caption: $localize`Exportar`,
      tooltip: $localize`Exporta la vista`,
      class: '',
      icon: 'download',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      loading: false,
      disabled: false,
      action: ButtonActions.EXPORT_TO_CSV,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: "",
      class: '',
      iconSize: "",
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      loading: false,
      disabled: true,
      action: undefined,
    },{
      type: 'searchbox',
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
    },];

  }

  mapColumns() {    
    this.plantsTableColumns = ['id', 'mainImagePath', 'name', 'reference', 'company', 'status', 'updatedAt'];
  }
  
  setTabIndex(tab: any) { 
    this.currentTabIndex = tab;
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

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.PLANTS_CATALOG,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.PLANTS_CATALOG,
      loading,
    );         
  }

// End ======================
}
