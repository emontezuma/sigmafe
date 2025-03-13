import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, map, tap, catchError, EMPTY } from 'rxjs';
import { ApplicationModules, ButtonActions, PageInfo, SearchBox, SettingsData, Screen, ToolbarButtonClicked, ToolbarElement, AnimationStatus, GeneralValues } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';
import { AppState } from 'src/app/state/app.state';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';
import { ChecklistTemplates, ChecklistTemplatesData, emptyChecklistTemplateCatalog } from 'src/app/catalogs';
import { ChecklistsService } from '../../services';
import { environment } from 'src/environments/environment';
import { ChecklistFillingItem, ChecklistsFilling, ChecklistState } from '../../models';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-catalog-checklist-list',
  templateUrl: './checklists-list.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./checklists-list.component.scss']
})
export class ChecklistsListComponent implements AfterViewInit {
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

  checklistsColumns: string[] = ['selection', 'id', 'mainImagePath', 'name', 'department', 'workgroup', 'assignedTo', 'reassignedTo', 'state', 'completed'];
  checklistsListData = new MatTableDataSource<ChecklistFillingItem>([]);      
  
  checklistsListData$: Observable<ChecklistTemplatesData>;
  sort$: Observable<any>;
  toolbarClick$: Observable<ToolbarButtonClicked>;
  settingsData$: Observable<SettingsData>;
  searchBox$: Observable<SearchBox>;
  screenData$: Observable<Screen>;
  allChecklistTemplatesToCsv$: Observable<any>;
  animationData$: Observable<AnimationStatus>;

  catalogIcon: string = "brochure";  

  loading: boolean;
  onTopStatus: string;
  settingsData: SettingsData;
  filterByText: string;
  allChecklistTemplatesToCsv: any;
  checklistsFillingData: ChecklistsFilling = {
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
  public selection = new SelectionModel<any>(true, []);

  constructor(
    private _store: Store<AppState>,
    public _sharedService: SharedService,
    private _router: Router,
    private _checklistsService: ChecklistsService,
  ) { }

  // Hooks ====================
  ngOnInit() {
    this.pageAnimationFinished();
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.CHECKLIST_FILLING_LIST,
      true,
    );
    this._sharedService.setSearchBox(
      ApplicationModules.CHECKLIST_FILLING_LIST,
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
        if (searchBox.from === ApplicationModules.CHECKLIST_FILLING_LIST) {          
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
        if (buttonClicked.from !== ApplicationModules.CHECKLIST_FILLING_LIST) {
            return
        }
        this.toolbarAction(buttonClicked);      
      })
    );    
    this.calcElements();
  }

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.CHECKLIST_FILLING_LIST,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.CHECKLIST_FILLING_LIST,
      false,
    );        
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = $localize`Registros por página`;      
    }
    this.checklistsListData.paginator = this.paginator;
    this.checklistsListData.sort = this.sort;
    this.sort$ = this.sort.sortChange.pipe(
      tap((sortData: any) => {              
        this.order = null;
        this.pageInfo.currentPage = 0;
        if (sortData.direction) {
          if (sortData.active === 'status') {            
            this.order = JSON.parse(`{ "friendlyStatus": "${sortData.direction.toUpperCase()}" }`);
          } else if (sortData.active === 'state') {            
            this.order = JSON.parse(`{ "friendlyState": "${sortData.direction.toUpperCase()}" }`);
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


  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.checklistsListData.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.checklistsListData.data.forEach(row => this.selection.select(row));
  }
  
  requestData(skipRecords: number, takeRecords: number) {
    this.setViewLoading(true);
    this.checklistsFillingData = {
      items: new Array(5).fill(emptyChecklistTemplateCatalog),
    }
    let filter = null
    if (this._sharedService.getUserProfile().roles === 'team-member' || this._sharedService.getUserProfile().roles === 'admin') {
      filter = {
        and: [
          {
            or: [
              {
                data: { 
                  assignedToId: { 
                    eq: this._sharedService.getUserProfile() ? this._sharedService.getUserProfile().id : null
                  } 
                },         
              },
              {
                data: { 
                  reassignedToId: { 
                    eq: this._sharedService.getUserProfile() ? this._sharedService.getUserProfile().id : null
                  } 
                },
              },
            ],   
          },
          {
            or: [
              { 
                data: { 
                  name: { 
                    contains: this.filterByText ?? ''
                  } 
                } 
              }, 
              { 
                data: 
                { 
                  reference: 
                  { 
                    contains: this.filterByText ?? ''
                  } 
                } 
              } 
            ] 
          },{
            data: { 
              state: { 
                neq: ChecklistState.CLOSED,
              } 
            }
          }
        ]
      };
    } else if (this._sharedService.getUserProfile().roles === 'team-leader') {
      filter = {
        and: [{
          or: [
          { 
            data: { 
              name: { 
                contains: this.filterByText ?? ''
              } 
            } 
          }, 
          { 
            data: 
            { 
              reference: 
              { 
                contains: this.filterByText ?? ''
              } 
            } 
          }] 
        },{
          data: { 
            state: { 
              neq: ChecklistState.CLOSED,
            } 
          }
        }]                
      }       
    }

    
    // if (this.filterByText) {      
    //   const cadFilter = ` { "or": [ { "data": { "name": { "contains": "${this.filterByText}" } } }, { "data": { "reference": { "contains": "${this.filterByText}" } } }, { // "data": { "templateType": { "name": { "contains": "${this.filterByText}" } } } } ] }`;
    //   filter = JSON.parse(cadFilter);                  
    // }
    this.checklistsListData = new MatTableDataSource<ChecklistFillingItem>(this.checklistsFillingData.items);
    this.checklistsListData$ = this._checklistsService.getChecklistsDataGql$(skipRecords, takeRecords, this.order, filter)
    .pipe(
      map((checklistPlans: any) => {
        const { data } = checklistPlans;
        return { 
          ...data,
          checklistsPaginated: {
            ...data.checklistsPaginated,
            items: data.checklistsPaginated.items.map((item) => {
              
              return {
                ...item,
                data: {
                  ...item.data,
                  mainImage: item.data.checklistTemplate?.mainImageName ? `${environment.uploadFolders.completePathToFiles}/${item.data.checklistTemplate?.mainImageName}` : '',
                  department: {
                    ...item.data.department,
                    name: item.data.department?.translations?.length > 0 ? item.data.department.translations[0].name : item.data.department?.name,
                    isTranslated: item.data.department?.translations?.length > 0 ? true : false,
                  },                  
                  workgroup: {
                    ...item.data.workgroup,
                    name: item.data.workgroup?.translations?.length > 0 ? item.data.workgroup.translations[0].name : item.data.workgroup?.name,
                    isTranslated: item.data.workgroup?.translations?.length > 0 ? true : false,
                  },
                  selected: false,            
                }
              }
            })          
          }
        }
      }),
      tap( checklistsFillingData => {        
        this.setPaginator(checklistsFillingData.checklistsPaginated.totalCount);
        this.checklistsFillingData = JSON.parse(JSON.stringify(checklistsFillingData.checklistsPaginated));
        if (this.paginator) {
          this.paginator.pageIndex = this.pageInfo.currentPage; 
          this.paginator.length = this.pageInfo.totalRecords;
          if (this.pageInfo.currentPage * this.pageInfo.pageSize > 0) {
            this.checklistsFillingData.items = new Array(this.pageInfo.currentPage * this.pageInfo.pageSize).fill(null).concat(this.checklistsFillingData.items);
          }      
        }        
        // this.checklistsFillingData.items.length = this.checklistsFillingData.totalCount;
        this.checklistsListData = new MatTableDataSource<ChecklistFillingItem>(this.checklistsFillingData.items);
        this.checklistsListData.paginator = this.paginator;
        // this.checklistsListData.sort = this.sort;
        this.checklistsListData.sortData = () => this.checklistsFillingData.items;        
        if (this.elements.find(e => e.action === ButtonActions.RELOAD).loading) {
          setTimeout(() => {
            this.elements.find(e => e.action === ButtonActions.RELOAD).loading = false;                                      
          }, 200);
        }
        this.setViewLoading(false);        
      }),
      catchError(() => {
        const message = $localize`Error al recuperar los checklists`;
        this._sharedService.showSnackMessage({
          message,
          duration: 2000,
          snackClass: 'snack-warn',
          icon: 'check',
        });
        return EMPTY;
      })
    );
  }

  // pageAnimationFinished(e: any) {
  pageAnimationFinished() {
    // if (e === null || e.fromState === 'void') {
      setTimeout(() => {        
        this._sharedService.setToolbar({
          from: ApplicationModules.CHECKLIST_FILLING_LIST,
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
    if (action.from === ApplicationModules.CHECKLIST_FILLING_LIST  && this.elements.length > 0) {
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
        this._router.navigateByUrl("/catalogs/checklist-plans/create");
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;                          
        }, 200);
      } else if (action.action === ButtonActions.EXPORT_TO_CSV) {        
        /* this.elements.find(e => e.action === action.action).loading = true;                          
        this.allChecklistTemplatesToCsv$ = this._catalogsService.getAllToCsv$().pipe(
          tap(checklistPlansToCsv => {
            const fileData$ = this._catalogsService.getAllCsvData$(checklistPlansToCsv?.data?.exportChecklistTemplateToCSV?.exportedFilename)
            .subscribe(data => { 
              this.downloadFile(data, checklistPlansToCsv?.data?.exportChecklistTemplateToCSV?.downloadFilename);
              setTimeout(() => {
                this.elements.find(e => e.action === action.action).loading = false;
              }, 200);
            })
          })
        ); */
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
      visible: false,
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
      visible: false,
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
      disabled: true,
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
      disabled: true,
      visible: true,
      action: undefined,
    },];

  }

  mapColumns() {    
    this.checklistsColumns = ['selection', 'id', 'mainImagePath', 'name', 'department', 'workgroup', 'assignedTo', 'reassignedTo', 'state', 'completed'];
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
      ApplicationModules.CHECKLIST_FILLING_LIST,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.CHECKLIST_FILLING_LIST,
      loading,
    );         
  }

  get GeneralValues() {
    return GeneralValues; 
  }

// End ======================
}
