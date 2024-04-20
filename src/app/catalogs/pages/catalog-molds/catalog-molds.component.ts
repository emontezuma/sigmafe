import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription, startWith, switchMap, tap } from 'rxjs';
import { MoldItem, Molds } from 'src/app/molds';
import { ApplicationModules, ButtonActions, PageInfo, ProfileData, SettingsData, ToolbarButtonClicked, ToolbarElement } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services';
import { loadMoldsData } from 'src/app/state/actions/molds.actions';
import { AppState } from 'src/app/state/app.state';
import { selectLoadingMoldsState,selectMoldsData } from 'src/app/state/selectors/molds.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';

@Component({
  selector: 'app-catalog-molds',
  templateUrl: './catalog-molds.component.html',
  animations: [ routingAnimation, dissolve, ],
  styleUrls: ['./catalog-molds.component.scss']
})
export class CatalogMoldsComponent implements AfterViewInit {
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

  // Variables ===============ks
  displayedColumns: string[] = ['id', 'mainImagePath', 'description', 'serialNumber', 'label', 'state', 'status', 'updatedAt'];
  dataSource = new MatTableDataSource<MoldItem>([]);
  toolbarClickSubscriber: Subscription;
  scrollSubscriber: Subscription;
  settingDataSubscriber: Subscription;
  profileDataSubscriber: Subscription;
  searchBoxSubscriber: Subscription;
  showGoTopSubscriber: Subscription;
  animationSubscriber: Subscription;
  moldsLoadingSubscriber: Subscription;
  moldsDataSubscriber: Subscription;
  screenDataSubscriber: Subscription;
  moldsDataLoadingSubscriber: Subscription;  
  sortSubscriber: Subscription;  

  loading: boolean;
  onTopStatus: string;
  settingsData: SettingsData;
  profileData: ProfileData;
  filterMoldsBy: string;
  moldsData: Molds;
  pageInfo: PageInfo;
  allHeight: number = 300;
  order: any = null;

  elements: ToolbarElement[] = [];

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
  ) { }

  // Hooks ====================
  ngOnInit() {
    // Settings
    this.pageInfo = {
      currentPage: 0,
      totalRecords:  0,
      totalPages: 0,
    }
    this.sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_CATALOG,
      true,
    );
    this.sharedService.setSearchBox(
      ApplicationModules.MOLDS_CATALOG,
      true,
    );    
    // Subscriptions
    this.screenDataSubscriber = this.store.select(selectSharedScreen).subscribe(screenData => {      
      this.allHeight = 900;    
    });    
    this.profileDataSubscriber = this.store.select(selectProfileData).subscribe( profileData => {
      this.profileData = profileData;
    });
    this.settingDataSubscriber = this.store.select(selectSettingsData).subscribe( settingsData => {
      this.settingsData = settingsData;
      this.pageInfo = {
        ...this.pageInfo,
        pageSize: this.settingsData.catalog?.pageSize || 50,
      }
      this.requestData(0, this.pageInfo.pageSize);      
    });    
    this.searchBoxSubscriber = this.sharedService.search.subscribe((searchBox) => {
      if (searchBox.  from === ApplicationModules.MOLDS_CATALOG) {
        this.filterMoldsBy = searchBox.textToSearch;    
      }
    });
    this.animationSubscriber = this.sharedService.isAnimationFinished.subscribe((animationStatus) => {      
      if (animationStatus.isFinished && animationStatus.toState === 'ChecklistFillingComponent') {
        // this.animationFinished(null);
      }      
    });    
    this.toolbarClickSubscriber = this.sharedService.toolbarAction.subscribe((buttonClicked: ToolbarButtonClicked) => {
      if (buttonClicked.from !== ApplicationModules.MOLDS_CATALOG) {
          return
      }
      this.toolbarAction(buttonClicked);      
    });
    this.moldsDataSubscriber = this.store.select(selectMoldsData).subscribe( moldsData => {
      this.setPaginator(moldsData.molds.totalCount);
      this.moldsData = JSON.parse(JSON.stringify(moldsData.molds));       
      this.paginator.pageIndex = this.pageInfo.currentPage; 
      this.paginator.length = this.pageInfo.totalRecords;
      if (this.pageInfo.currentPage * this.pageInfo.pageSize > 0) {
        this.moldsData.items = new Array(this.pageInfo.currentPage * this.pageInfo.pageSize).fill(null).concat(this.moldsData.items);
      }      
      this.moldsData.items.length = this.pageInfo.totalRecords;
      this.dataSource = new MatTableDataSource<MoldItem>(this.moldsData.items);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;    
    });
    this.moldsDataLoadingSubscriber = this.store.select(selectLoadingMoldsState).subscribe( loading => {
      this.loading = loading;
      this.sharedService.setGeneralLoading(
        ApplicationModules.MOLDS_CATALOG,
        loading,
      );
      this.sharedService.setGeneralProgressBar(
        ApplicationModules.MOLDS_CATALOG,
        loading,
      );      
    });    
  }

  ngOnDestroy() : void {
    this.sharedService.setToolbar({
      from: ApplicationModules.MOLDS_CATALOG,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this.sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_CATALOG,
      false,
    );
    // Turn off subscriptions
    if (this.scrollSubscriber) this.scrollSubscriber.unsubscribe();
    if (this.settingDataSubscriber) this.settingDataSubscriber.unsubscribe();
    if (this.showGoTopSubscriber) this.showGoTopSubscriber.unsubscribe();
    if (this.profileDataSubscriber) this.profileDataSubscriber.unsubscribe();
    if (this.searchBoxSubscriber) this.searchBoxSubscriber.unsubscribe();
    if (this.moldsDataSubscriber) this.moldsDataSubscriber.unsubscribe();
    if (this.moldsLoadingSubscriber) this.moldsLoadingSubscriber.unsubscribe();
    if (this.animationSubscriber) this.animationSubscriber.unsubscribe();
    if (this.toolbarClickSubscriber) this.toolbarClickSubscriber.unsubscribe();      
    if (this.screenDataSubscriber) this.screenDataSubscriber.unsubscribe();    
    if (this.moldsDataLoadingSubscriber) this.moldsDataLoadingSubscriber.unsubscribe();      
    if (this.sortSubscriber) this.sortSubscriber.unsubscribe();          
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = $localize`Registros por página`;      
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sortSubscriber = this.sort.sortChange.subscribe((sortData: any) => {      
      this.order = null;
      this.pageInfo.currentPage = 0;
      if (sortData.direction) {
        this.order = JSON.parse(`{ "${sortData.active}": "${sortData.direction.toUpperCase()}" }`);
      }
      this.requestData(0, this.pageInfo.pageSize, this.order);      
    });
  }

// Functions ================

  pageChange(event: any) {
    this.pageInfo = { 
      ...this.pageInfo, 
      currentPage: event?.pageIndex, 
    };    
    this.requestData(this.pageInfo.currentPage * this.pageInfo.pageSize, this.pageInfo.pageSize, this.order);
  }

  requestData(skipRecords: number, takeRecords: number, order?: any) {
    this.store.dispatch(loadMoldsData({ 
      skipRecords, 
      takeRecords, 
      order,
    }));
  }

  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this.calcElements();
        this.sharedService.setToolbar({
          from: ApplicationModules.MOLDS_CATALOG,
          show: true,
          showSpinner: false,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'right',
        });
        this.sharedService.setToolbar({
          from: ApplicationModules.MOLDS_CATALOG,
          show: true,
          showSpinner: false,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'left',
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
      action: ButtonActions.SAVE,
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
      action: ButtonActions.EXPORT_TO_EXCEL,
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

}
