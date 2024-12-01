import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'; 
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, filter, map, skip, switchMap, tap } from 'rxjs';
import { ApplicationModules, ButtonActions, PageInfo, ProfileData, SearchBox, SettingsData, Screen, ToolbarButtonClicked, ToolbarElement, AnimationStatus, MoldItem, emptyMoldCatalog, MoldsData, Molds } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';
import { loadMoldsData } from 'src/app/state/actions/molds.actions';
import { AppState } from 'src/app/state/app.state';
import { selectLoadingMoldsState,selectMoldsData } from 'src/app/state/selectors/molds.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';
import { CatalogsService } from '../../services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-catalog-molds',
  templateUrl: './catalog-molds-list.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-molds-list.component.scss']
})
export class CatalogMoldsListComponent implements AfterViewInit {
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

  // Variables ===============
  moldsTableColumns: string[] = ['id', 'mainImagePath', 'description', 'serialNumber', 'position', 'state', 'hits', 'status', 'updatedAt'];
  moldsCatalogData = new MatTableDataSource<MoldItem>([]);      
  
  moldsData$: Observable<MoldsData>;
  sort$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>;
  moldsDataLoading$: Observable<boolean>;
  settingsData$: Observable<SettingsData>;
  profileData$: Observable<ProfileData>;
  searchBox$: Observable<SearchBox>;
  screenData$: Observable<Screen>;
  allMoldsToCsv$: Observable<any>;
  animationData$: Observable<AnimationStatus>;

  catalogIcon: string = "treasure_chest";

  showAddButton: boolean;
  loading: boolean;
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  filterByText: string;
  allMoldsToCsv: any;
  moldsData: Molds = {
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
    private activatedRoute: ActivatedRoute,
  ) { }

  // Hooks ====================
  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.showAddButton = data ? data['showAddButton'] : true;
      console.log(this.showAddButton);
      this.calcElements();
    } )
    this.pageAnimationFinished();
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_CATALOG,
      true,
    );
    this._sharedService.setSearchBox(
      ApplicationModules.MOLDS_CATALOG,
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
        if (searchBox.from === ApplicationModules.MOLDS_CATALOG) {
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
        if (buttonClicked.from !== ApplicationModules.MOLDS_CATALOG) {
            return
        }
        this.toolbarAction(buttonClicked);      
      })
    );
    this.moldsData$ = this._store.select(selectMoldsData).pipe(
      skip(1),
      map((mold: any) => {        
        return { 
          ...mold,
          moldsPaginated: {
            ...mold.moldsPaginated,
            items: mold.moldsPaginated.items.map((item) => {
              
              return {
                ...item,
                data: {
                  ...item.data,                  
                  mainImage: item.data.mainImageName ? `${environment.uploadFolders.completePathToFiles}/${item.data.mainImagePath}` : '',
                }
              }
            })          
          }
        }
      }),
      tap( moldsData => {        
        this.setPaginator(moldsData.moldsPaginated.totalCount);
        this.moldsData = JSON.parse(JSON.stringify(moldsData.moldsPaginated));
        if (this.paginator) {
          this.paginator.pageIndex = this.pageInfo.currentPage; 
          this.paginator.length = this.pageInfo.totalRecords;
          if (this.pageInfo.currentPage * this.pageInfo.pageSize > 0) {
            this.moldsData.items = new Array(this.pageInfo.currentPage * this.pageInfo.pageSize).fill(null).concat(this.moldsData.items);
          }      
        }
        this.moldsData.items.length = this.moldsData.totalCount;
        this.moldsCatalogData = new MatTableDataSource<MoldItem>(this.moldsData.items);
        this.moldsCatalogData.paginator = this.paginator;
        // this.moldsCatalogData.sort = this.sort;
        this.moldsCatalogData.sortData = () => this.moldsData.items;
        if (this.elements.find(e => e.action === ButtonActions.RELOAD).loading) {
          setTimeout(() => {
            this.elements.find(e => e.action === ButtonActions.RELOAD).loading = false;                          
          }, 200);
        }        
      })
    );
    this.moldsDataLoading$ = this._store.select(selectLoadingMoldsState).pipe(
      tap( loading => {
        this.loading = loading;
        this._sharedService.setGeneralLoading(
          ApplicationModules.MOLDS_CATALOG,
          loading,
        );
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.MOLDS_CATALOG,
          loading,
        ); 
        if (this.pendingToolbarButtonIndex === 2 && !loading) {
          this.pendingToolbarButtonIndex = null;
          setTimeout(() => {
            this.elements[2].loading = loading;  
          }, 200);
        }
      })
    );
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

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = $localize`Registros por página`;      
    }
    this.moldsCatalogData.paginator = this.paginator;
    this.moldsCatalogData.sort = this.sort;
    this.sort$ = this.sort.sortChange.pipe(
      tap((sortData: any) => {              
        this.order = null;
        this.pageInfo.currentPage = 0;
        if (sortData.direction) {
          if (sortData.active === 'position') {
            const sortAscending = 'ASC';            
            this.order = JSON.parse(`[ { "translatedPartNumber": { "translatedName": "${sortData.direction.toUpperCase()}" } }, { "data": { "position": "${sortAscending}" } } ]`);            
          } else if (sortData.active === 'state' || sortData.active === 'generalInfo') {            
            this.order = JSON.parse(`{ "friendlyState": "${sortData.direction.toUpperCase()}" }`);
          } else if (sortData.active === 'mainInfo') {            
            this.order = JSON.parse(`{ "data": { "description": { "${sortData.direction.toUpperCase()}" } }`);
          } else if (sortData.active === 'status') {            
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
    this.moldsData = {
      items: new Array(5).fill(emptyMoldCatalog),
    }
    let filter = null;
    if (this.filterByText) {      
      const cadFilter = ` { "or": [ { "data": { "description": { "contains": "${this.filterByText}" } } }, { "data": { "reference": { "contains": "${this.filterByText}" } } }, { "data": { "serialNumber": { "contains": "${this.filterByText}" } } } ] }`;
      filter = JSON.parse(cadFilter);                  
    }
    this.moldsCatalogData = new MatTableDataSource<MoldItem>(this.moldsData.items);
    this._store.dispatch(loadMoldsData({ 
      skipRecords, 
      takeRecords,
      filter,
      order: this.order,
    }));
  }

  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {        
        this._sharedService.setToolbar({
          from: ApplicationModules.MOLDS_CATALOG,
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
    if (action.from === ApplicationModules.MOLDS_CATALOG  && this.elements.length > 0) {
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
        this._router.navigateByUrl("/catalogs/molds/create");
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;                          
        }, 200);
      } else if (action.action === ButtonActions.EXPORT_TO_CSV) {        
        this.elements.find(e => e.action === action.action).loading = true;                          
        this.allMoldsToCsv$ = this._catalogsService.getAllMoldsToCsv$().pipe(
          tap(moldToCsv => {
            const fileData$ = this._catalogsService.getAllCsvData$(moldToCsv?.data?.exportMoldToCSV?.exportedFilename)
            .subscribe(data => { 
              this.downloadFile(data, moldToCsv?.data?.exportMoldToCSV?.downloadFilename);
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

    if (this.showAddButton) {
      this.elements.unshift(
      {
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
      },);
    }
  }

  mapColumns() {
    if (this.size !== 'small') {
      this.moldsTableColumns = ['id', 'mainImagePath', 'description', 'serialNumber', 'position', 'state', 'hits', 'status', 'updatedAt'];  
    } else {
      this.moldsTableColumns = ['id', 'mainImagePath', 'mainInfo', 'generalInfo'];
    }
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

// End ======================

}
