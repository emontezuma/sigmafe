import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, map, tap, catchError, EMPTY } from 'rxjs';
import { ApplicationModules, RecordStatus, ButtonActions, PageInfo, ProfileData, SearchBox, SettingsData, Screen, ToolbarButtonClicked, ToolbarElement, AnimationStatus, GeneralValues } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';
import { AppState } from 'src/app/state/app.state';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';
import { CatalogsService } from '../../services';
import { environment } from 'src/environments/environment';
import { PlantItem, Queries, QueriesData, emptyPlantCatalog } from '../../models';

@Component({
  selector: 'app-catalog-queries',
  templateUrl: './catalog-queries-list.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-queries-list.component.scss']
})
export class CatalogQueriesListComponent implements AfterViewInit {
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

// Queries ===============
  queriesTableColumns: string[] = ['id', 'mainImagePath', 'name', 'byDefault', 'public', 'userName', 'status', 'updatedAt'];
  queriesCatalogData = new MatTableDataSource<PlantItem>([]);      
  
  queriesData$: Observable<QueriesData>;
  sort$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>;
  settingsData$: Observable<SettingsData>;
  profileData$: Observable<ProfileData>;
  searchBox$: Observable<SearchBox>;
  screenData$: Observable<Screen>;
  allQueriesToCsv$: Observable<any>;
  animationData$: Observable<AnimationStatus>;

  catalogIcon: string = "grouped_tasks";  

  loading: boolean;
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  filterByText: string;
  allQueriesToCsv: any;
  queriesData: Queries = {
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
  showTableFooter: boolean = false;  

  constructor(
    private _store: Store<AppState>,
    private _sharedService: SharedService,
    private _router: Router,
    private _catalogsService: CatalogsService,
  ) { }

  // Hooks ====================
  ngOnInit() {
    this.pageAnimationFinished();
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.DEPARTMENTS_CATALOG,
      true,
    );
    this._sharedService.setSearchBox(
      ApplicationModules.DEPARTMENTS_CATALOG,
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
        if (searchBox.from === ApplicationModules.DEPARTMENTS_CATALOG) {
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
        if (buttonClicked.from !== ApplicationModules.DEPARTMENTS_CATALOG) {
            return
        }
        this.toolbarAction(buttonClicked);      
      })
    );    
    this.calcElements();
  }

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.DEPARTMENTS_CATALOG,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.DEPARTMENTS_CATALOG,
      false,
    );        
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = $localize`Registros por página`;      
    }
    this.queriesCatalogData.paginator = this.paginator;
    this.queriesCatalogData.sort = this.sort;
    this.sort$ = this.sort.sortChange.pipe(
      tap((sortData: any) => {              
        this.order = null;
        this.pageInfo.currentPage = 0;
        if (sortData.direction) {
          if (sortData.active === 'status') {            
            this.order = JSON.parse(`{ "friendlyStatus": "${sortData.direction.toUpperCase()}" }`);
          } else if (sortData.active === 'plant') {            
            this.order = JSON.parse(`{ "data": { "plant": { "name": "${sortData.direction.toUpperCase()}" } } }`);          
          } else if (sortData.active === 'recipient') {            
            this.order = JSON.parse(`{ "data": { "recipient": { "name": "${sortData.direction.toUpperCase()}" } } }`);          
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
    this.queriesData = {
      items: new Array(5).fill(emptyPlantCatalog),
    }    
    let filter =  { 
        and: [{  
          data: { 
            name: { 
              contains: this.filterByText ? this.filterByText :  '',
            } 
          } 
        },{  
          or: [{ 
            data: { 
              userId: { 
                eq: this._sharedService?.getUserProfile() ? this._sharedService?.getUserProfile().id : null, 
              } 
            } 
          },{ 
            data: { 
              public: { 
                eq: GeneralValues.YES, 
              } 
            } 
          }] 
        },{
          data: { 
            status: { 
              eq: RecordStatus.ACTIVE, 
            } 
          } 
        }
      
      ]
           
    }
    this.queriesCatalogData = new MatTableDataSource<PlantItem>(this.queriesData.items);
    this.queriesData$ = this._catalogsService.getQueriesDataGql$(skipRecords, takeRecords, this.order, filter)
    .pipe(
      map((queries: any) => {
        const { data } = queries;
        return { 
          ...data,
          userDefinedQueriesPaginated: {
            ...data.userDefinedQueriesPaginated,
            items: data.userDefinedQueriesPaginated.items.map((item) => {
              
              return {
                ...item,
                data: {
                  ...item.data,                 
                  userName: item.data?.user?.name,
                  // mainImage: item.data.mainImageName ? `${environment.serverUrl}/${environment.uploadFolders.completePathToFiles}/${item.data.mainImagePath}` : '',                                        
                }
              }
            })          
          }
        }
      }),
      tap( queriesData => {        
        this.setPaginator(queriesData.userDefinedQueriesPaginated.totalCount);
        this.queriesData = JSON.parse(JSON.stringify(queriesData.userDefinedQueriesPaginated));
        if (this.paginator) {
          this.paginator.pageIndex = this.pageInfo.currentPage; 
          this.paginator.length = this.pageInfo.totalRecords;
          if (this.pageInfo.currentPage * this.pageInfo.pageSize > 0) {
            this.queriesData.items = new Array(this.pageInfo.currentPage * this.pageInfo.pageSize).fill(null).concat(this.queriesData.items);
          }      
        }        
        // this.queriesData.items.length = this.queriesData.totalCount;
        this.queriesCatalogData = new MatTableDataSource<PlantItem>(this.queriesData.items);
        this.queriesCatalogData.paginator = this.paginator;
        // this.queriesCatalogData.sort = this.sort;
        this.queriesCatalogData.sortData = () => this.queriesData.items;        
        if (this.elements.find(e => e.action === ButtonActions.RELOAD).loading) {
          setTimeout(() => {
            this.elements.find(e => e.action === ButtonActions.RELOAD).loading = false;                                      
          }, 200);
        }
        this.setViewLoading(false);        
      }),
      catchError(err => {
        this.setViewLoading(false);        
        if (this.paginator) {
          this.paginator.pageIndex = 0; 
          this.paginator.length = 0;          
          this.queriesData.items = [];          
        }        
        // this.queriesData.items.length = this.queriesData.totalCount;
        this.queriesCatalogData = new MatTableDataSource<PlantItem>(this.queriesData.items);
        this.queriesCatalogData.paginator = this.paginator;
        return EMPTY;
      })      
    );
  }

  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {        
        this._sharedService.setToolbar({
          from: ApplicationModules.DEPARTMENTS_CATALOG,
          show: true,
          showSpinner: false,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'right',
        });
      }, 10);
    // }
  }

  setPaginator(totalRecords: number) {
    this.pageInfo = {
      ...this.pageInfo,
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / this.pageInfo.pageSize),
    }    
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.from === ApplicationModules.DEPARTMENTS_CATALOG  && this.elements.length > 0) {
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
        this._router.navigateByUrl("/catalogs/queries/create");        
      } else if (action.action === ButtonActions.EXPORT_TO_CSV) {        
        this.elements.find(e => e.action === action.action).loading = true;                          
        this.allQueriesToCsv$ = this._catalogsService.getAllQueriesToCsv$().pipe(
          tap(queriesToCsv => {
            const fileData$ = this._catalogsService.getAllCsvData$(queriesToCsv?.data?.exportDepartmentToCSV?.exportedFilename)
            .subscribe(data => { 
              this.downloadFile(data, queriesToCsv?.data?.exportDepartmentToCSV?.downloadFilename);
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
      visible: true,
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
      disabled: false,
            visible: true,
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
      visible: true,
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
      visible: true,
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
      disabled: false,
            visible: true,
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
      disabled: false,
            visible: true,
      action: undefined,
    },];

  }

  mapColumns() {    
    this.queriesTableColumns = ['id', 'mainImagePath', 'name', 'byDefault', 'public', 'userName', 'status', 'updatedAt'];
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
      ApplicationModules.DEPARTMENTS_CATALOG,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.DEPARTMENTS_CATALOG,
      loading,
    );         
  }

  get GeneralValues() {
      return GeneralValues; 
    }

// End ======================
}
