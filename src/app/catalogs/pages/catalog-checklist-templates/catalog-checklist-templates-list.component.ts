import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';
import { ApplicationModules, ButtonActions, PageInfo, ProfileData, SearchBox, SettingsData, Screen, ToolbarButtonClicked, ToolbarElement, AnimationStatus } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';
import { AppState } from 'src/app/state/app.state';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';
import { CatalogsService } from '../../services';
import { environment } from 'src/environments/environment';
import { ChecklistTemplateItem, ChecklistTemplates, ChecklistTemplatesData, emptyChecklistTemplateCatalog } from '../../models';

@Component({
  selector: 'app-catalog-checklist-templates',
  templateUrl: './catalog-checklist-templates-list.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-checklist-templates-list.component.scss']
})
export class CatalogChecklistTemplatesListComponent implements AfterViewInit {
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

  checklistTemplatesTableColumns: string[] = ['id', 'mainImagePath', 'name', 'reference', 'templateType', 'lastGeneratedDate', 'generationCount', 'status', 'updatedAt'];
  checklistTemplatesCatalogData = new MatTableDataSource<ChecklistTemplateItem>([]);      
  
  checklistTemplatesData$: Observable<ChecklistTemplatesData>;
  sort$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>;
  settingsData$: Observable<SettingsData>;
  profileData$: Observable<ProfileData>;
  searchBox$: Observable<SearchBox>;
  screenData$: Observable<Screen>;
  allChecklistTemplatesToCsv$: Observable<any>;
  animationData$: Observable<AnimationStatus>;

  catalogIcon: string = "brochure";  

  loading: boolean;
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  filterByText: string;
  allChecklistTemplatesToCsv: any;
  checklistTemplatesData: ChecklistTemplates = {
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
    public _sharedService: SharedService,
    private _router: Router,
    private _catalogsService: CatalogsService,
  ) { }

  // Hooks ====================
  ngOnInit() {
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.CHEKLIST_TEMPLATES_CATALOG,
      true,
    );
    this._sharedService.setSearchBox(
      ApplicationModules.CHEKLIST_TEMPLATES_CATALOG,
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
        if (searchBox.from === ApplicationModules.CHEKLIST_TEMPLATES_CATALOG) {
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
        if (buttonClicked.from !== ApplicationModules.CHEKLIST_TEMPLATES_CATALOG) {
            return
        }
        this.toolbarAction(buttonClicked);      
      })
    );    
    this.calcElements();
  }

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.CHEKLIST_TEMPLATES_CATALOG,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.CHEKLIST_TEMPLATES_CATALOG,
      false,
    );        
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = $localize`Registros por página`;      
    }
    this.checklistTemplatesCatalogData.paginator = this.paginator;
    this.checklistTemplatesCatalogData.sort = this.sort;
    this.sort$ = this.sort.sortChange.pipe(
      tap((sortData: any) => {              
        this.order = null;
        this.pageInfo.currentPage = 0;
        if (sortData.direction) {
          if (sortData.active === 'status') {            
            this.order = JSON.parse(`{ "friendlyStatus": "${sortData.direction.toUpperCase()}" }`);
          } else if (sortData.active === 'templateType') {            
            this.order = JSON.parse(`{ "data": { "templateType": { "name": "${sortData.direction.toUpperCase()}" } } }`);
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
    this.checklistTemplatesData = {
      items: new Array(5).fill(emptyChecklistTemplateCatalog),
    }
    let filter = null;
    if (this.filterByText) {      
      const cadFilter = ` { "or": [ { "data": { "name": { "contains": "${this.filterByText}" } } }, { "data": { "reference": { "contains": "${this.filterByText}" } } } ] }`;
      filter = JSON.parse(cadFilter);                  
    }
    // if (this.filterByText) {      
    //   const cadFilter = ` { "or": [ { "data": { "name": { "contains": "${this.filterByText}" } } }, { "data": { "reference": { "contains": "${this.filterByText}" } } }, { // "data": { "templateType": { "name": { "contains": "${this.filterByText}" } } } } ] }`;
    //   filter = JSON.parse(cadFilter);                  
    // }
    this.checklistTemplatesCatalogData = new MatTableDataSource<ChecklistTemplateItem>(this.checklistTemplatesData.items);
    this.checklistTemplatesData$ = this._catalogsService.getChecklistTemplatesDataGql$(skipRecords, takeRecords, this.order, filter)
    .pipe(
      map((checklistTemplates: any) => {
        const { data } = checklistTemplates;
        return { 
          ...data,
          checklistTemplatesPaginated: {
            ...data.checklistTemplatesPaginated,
            items: data.checklistTemplatesPaginated.items.map((item) => {
              const extension = item.data.mainImageName ? item.data.mainImageName.split('.').pop() : '';          
              return {
                ...item,
                data: {
                  ...item.data,                  
                  mainImage: item.data.mainImageName ? `${environment.serverUrl}/${item.data.mainImagePath.replace(item.data.mainImageName, item.data.mainImageGuid + '.' + extension)}` : '',
                  templateType: {
                    ...item.data.templateType,
                    name: item.data.templateType?.translations?.length > 0 ? item.data.templateType.translations[0].name : item.data.templateType?.name,
                    isTranslated: item.data.templateType?.translations?.length > 0 ? true : false,
                  },                  
                }
              }
            })          
          }
        }
      }),
      tap( checklistTemplatesData => {        
        this.setPaginator(checklistTemplatesData.checklistTemplatesPaginated.totalCount);
        this.checklistTemplatesData = JSON.parse(JSON.stringify(checklistTemplatesData.checklistTemplatesPaginated));
        if (this.paginator) {
          this.paginator.pageIndex = this.pageInfo.currentPage; 
          this.paginator.length = this.pageInfo.totalRecords;
          if (this.pageInfo.currentPage * this.pageInfo.pageSize > 0) {
            this.checklistTemplatesData.items = new Array(this.pageInfo.currentPage * this.pageInfo.pageSize).fill(null).concat(this.checklistTemplatesData.items);
          }      
        }        
        this.checklistTemplatesData.items.length = this.checklistTemplatesData.totalCount;
        this.checklistTemplatesCatalogData = new MatTableDataSource<ChecklistTemplateItem>(this.checklistTemplatesData.items);
        this.checklistTemplatesCatalogData.paginator = this.paginator;
        // this.checklistTemplatesCatalogData.sort = this.sort;
        this.checklistTemplatesCatalogData.sortData = () => this.checklistTemplatesData.items;        
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
          from: ApplicationModules.CHEKLIST_TEMPLATES_CATALOG,
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
    if (action.from === ApplicationModules.CHEKLIST_TEMPLATES_CATALOG  && this.elements.length > 0) {
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
        this._router.navigateByUrl("/catalogs/checklist-templates/create");
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;                          
        }, 200);
      } else if (action.action === ButtonActions.EXPORT_TO_CSV) {        
        this.elements.find(e => e.action === action.action).loading = true;                          
        this.allChecklistTemplatesToCsv$ = this._catalogsService.getAllChecklistTemplatesToCsv$().pipe(
          tap(checklistTemplatesToCsv => {
            const fileData$ = this._catalogsService.getAllChecklistTemplatesCsvData$(checklistTemplatesToCsv?.data?.exportChecklistTemplatesToCsv?.exportedFilename)
            .subscribe(data => { 
              this.downloadFile(data, checklistTemplatesToCsv?.data?.exportChecklistTemplatesToCsv?.downloadFilename);
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
    this.checklistTemplatesTableColumns = ['id', 'mainImagePath', 'name', 'reference', 'templateType', 'lastGeneratedDate', 'generationCount', 'status', 'updatedAt'];
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
      ApplicationModules.CHEKLIST_TEMPLATES_CATALOG,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.CHEKLIST_TEMPLATES_CATALOG,
      loading,
    );         
  }

// End ======================
}
