import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";
import { Observable, tap } from 'rxjs';

import { routingAnimation, dissolve, fromLeft, listAnimation } from '../../../shared/animations/shared.animations';
import { MoldHitsQuery, MoldStates } from '../../models/molds-hits.models';
import { AppState } from '../../../state/app.state'; 
import { selectMoldsHitsQueryData, selectLoadingMoldsHitsState } from '../../../state/selectors/molds-hits.selectors'; 
import { loadMoldsHitsQueryData } from 'src/app/state/actions/molds-hits.actions';
import { SharedService } from 'src/app/shared/services';
import { ProfileData, ApplicationModules, ButtonActions, ToolbarButtonClicked, ToolbarElement, GoTopButtonStatus, AnimationStatus, SearchBox } from 'src/app/shared/models';
import { SettingsData } from '../../../shared/models/settings.models'
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';

@Component({
  selector: 'app-molds-hits-counter',
  animations: [ routingAnimation, dissolve, fromLeft, listAnimation ],
  templateUrl: './molds-hits-counter.component.html',
  styleUrls: ['./molds-hits-counter.component.scss']
})
export class MoldsHitsCounterComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
  @ViewChild('moldHitsCounter') moldHitsCounter: ElementRef;
  @ViewChildren('hitsCounters') hitsCounters: QueryList<ElementRef>;
  
  
// Variables ===============
  scroll$: Observable<any>;
  
  settingsData$: Observable<SettingsData>;
  toolbarClick$: Observable<ToolbarButtonClicked>;        
  showGoTop$: Observable<GoTopButtonStatus>;
  profileData$: Observable<ProfileData>;  
  everySecond$: Observable<boolean>;
  animation$: Observable<AnimationStatus>;
  searchBox$: Observable<SearchBox>;
  moldsHitsLoading$: Observable<boolean>;  
  moldsHitsData$: Observable<MoldHitsQuery[]>;  
  stopTimer$: Observable<boolean>;
  screen$: Observable<number>;  

  filteredMoldsHits: MoldHitsQuery[] = [];
  originalMoldsHits: MoldHitsQuery[] = [];
  moldsHitsToShow: MoldHitsQuery[] = [];
  settingsData: SettingsData;
  profileData: ProfileData;
  colsBySize: number = 2;
  filterMoldsBy: string = '';
  loading: boolean = true;
  animate: boolean = true;
  sliderInitiated: boolean = false;
  elements: ToolbarElement[] = [];
  currentLabel: string = '';
  onTopStatus: string  = 'inactive';
  goTopButtonTimer: any;
  loaded: boolean = false;
  moldColorFilter: string = '';
  moldStateFilter: string = '';
  moldStatusFilter: string = '';
  showFrom: number = 0;
  timeToWait: number = 6;
  moldsToShow: number = 6;
  cardHeight: number = 210;
  allHeight: number = 6;
  disableListAnimation: boolean = false;
  animatingList: boolean = false;
  
  constructor(
    private _store: Store<AppState>,
    private _sharedService: SharedService,
    public _scrollDispatcher: ScrollDispatcher,
  ) { }

// Hooks ====================
  ngOnInit() {
    // Dispatches
    this._store.dispatch(loadMoldsHitsQueryData());  

    // Settings
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_HITS_VIEW,
      true,
    );
    this._sharedService.setSearchBox(
      ApplicationModules.MOLDS_HITS_VIEW,
      true,
    );    
    this.moldsHitsLoading$ = this._store.select(selectLoadingMoldsHitsState).pipe(
      tap( loading => {
        this.loading = loading;
        this._sharedService.setGeneralLoading(
          ApplicationModules.MOLDS_HITS_VIEW,
          loading,
        );
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.MOLDS_HITS_VIEW,
          loading,
        );
        this.loaded = loading === false;
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
      })
    );
    this.moldsHitsData$ = this._store.select(selectMoldsHitsQueryData).pipe(
      tap( moldsHits => {
        this.originalMoldsHits = moldsHits;
        this.filterMoldsHitsQueryData();
        if (this.moldsHitsToShow.length > 0 && moldsHits?.length > 0) {
          this.moldsHitsToShow.forEach((showedMold, index) => {
            const moldToUpdate = moldsHits.find(mold => mold.data.id === showedMold.data.id);
            this.moldsHitsToShow[index] = {
              ...moldToUpdate,
              data: {
                ...moldToUpdate.data,
                index: showedMold.data.index,
                updateHits: moldToUpdate.data.hits != showedMold.data.hits,
              },              
            }
          });          
          return;
        }      
        this.showFrom = 0;
        this.slider();
      })
    );
    this.searchBox$ = this._sharedService.search.pipe(
      tap((searchBox) => {
        if (searchBox.  from === ApplicationModules.MOLDS_HITS_VIEW) {
          this.disableListAnimation = true;
          this.filterMoldsBy = searchBox.textToSearch;
          this.processFilterChange()
        }
      })
    );
    this.animation$ = this._sharedService.isAnimationFinished.pipe(
      tap((animationStatus) => {      
        if (animationStatus.isFinished && animationStatus.toState === 'ChecklistFillingComponent') {
          // this.animationFinished(null);
        }      
      })
    );
    this.showGoTop$ = this._sharedService.showGoTop.pipe(
      tap((goTop) => {
        if (goTop.status === 'temp') {
          this.onTopStatus = 'active';
          this.moldHitsCounter.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          // Ensure
        }      
      })
    );
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      tap((buttonClicked: ToolbarButtonClicked) => {
        if (buttonClicked.from !== ApplicationModules.MOLDS_HITS_VIEW) {
            return
        }
        this.toolbarAction(buttonClicked);
      })
    );
    this.everySecond$ = this._sharedService.pastSecond.pipe(      
      
    );
    this.stopTimer$ = this._sharedService.timeCompleted.pipe(
      tap((timeCompleted) => {        
        if (timeCompleted) {        
          this.slider();
        }      
      })
    );    
    this.scroll$ = this._scrollDispatcher
    .scrolled()
    .pipe(      
      tap((data: any) => {
        this.getScrolling(data);
      })
    )

    this.screen$ = this._sharedService.getAllHeight.pipe(
      tap((allHeight) => {
        this.allHeight = allHeight;
        if (allHeight > 0) {
          this.calculateMoldsToShow();
        }        
      })
    )
    // this.animationFinished(null);      
  }

  ngAfterViewInit(): void {        
    this.hitsCounters.changes.subscribe((components: QueryList<ElementRef>) => {      
      components.forEach((component: any) => {
        this.cardHeight = component.nativeElement?.offsetHeight > this.cardHeight ? component.nativeElement?.offsetHeight : this.cardHeight;
      });
      this.calculateMoldsToShow();
    });      
  }

  calculateMoldsToShow() {
    const decimals = this.allHeight / (this.cardHeight + 10) - Math.floor(this.allHeight / (this.cardHeight + 10));
    if (decimals < .15) {
      this.moldsToShow = Math.floor(this.allHeight / (this.cardHeight + 10)) - 1;
    } else {
      this.moldsToShow = Math.floor(this.allHeight / (this.cardHeight + 10));
    }
  }
  

  ngOnDestroy() : void {
    this._sharedService.setToolbar({
      from: ApplicationModules.MOLDS_HITS_VIEW,
      show: false,
      showSpinner: false,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_HITS_VIEW,
      false,
    );                    
  }

// Functions ================
  pageAnimationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this.calcElements();
        this._sharedService.setToolbar({
          from: ApplicationModules.MOLDS_HITS_VIEW,
          show: true,
          showSpinner: true,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'right',
      });
      }, 500);
    }
  }

  listAnimationFinished(e: any) {    
    console.log(e.fromState, e.toState);
    this.animatingList = false;
    if (e.fromState == 'void') {
      this.showingMolds();
    } else if (e.toState == 0) {
      this.showingMolds();
    } else {
      this.finishAnimation()
    } 
  }

  listAnimationStarted(e: any) {
    this.animatingList = true;
  }

  finishAnimation() {
    this._sharedService.setToolbarTime(this.filteredMoldsHits.length > this.moldsToShow ? this.timeToWait : 0);
    this.sliderInitiated = false;
    this._sharedService.setGeneralLoading(
      ApplicationModules.MOLDS_HITS_VIEW,
      false,
    );
  }

  calcElements() {
    this.elements = [{
      type: 'label',      
      caption: this.currentLabel,
      class: 'tab-spinner-text',
    },{
      type: 'button-menu',
      field: 'mold-state',
      caption: $localize`Estado del molde`,
      tooltip:  $localize`FIltrar el estado del molde`,
      disabled: false,
      options: [{
        caption: $localize`(Todos los moldes)`,
        icon: 'record',
        value: ButtonActions.ALL,        
      },
      {
        caption: $localize`En producción`,
        icon: 'gear',
        value: MoldStates.IN_PRODUCTION,
        default: true,
      },
      {
        caption: $localize`En almacén`,        
        icon: 'solution',
        value: MoldStates.IN_WAREHOUSE,
      },
      {
        caption: $localize`En reparación`,        
        icon: 'solution',
        value: MoldStates.IN_REPAIRING,
      },
      {
        caption: $localize`Fuera de servicio`,        
        icon: 'solution',
        value: MoldStates.OUT_OF_SERVICE,
      }]      
    },{
      type: 'button-menu',
      field: 'mold-status',
      caption: $localize`Estatus del molde`,
      tooltip:  $localize`FIltrar el estatus del molde`,
      disabled: false,
      options: [{
        caption: $localize`(Todos los moldes)`,
        icon: 'record',
        value: ButtonActions.ALL,
        default: true,    
      },
      {
        caption: $localize`Alarmados`,
        icon: 'warn-fill',
        value: ButtonActions.ALARMED,        
      },
      {
        caption: $localize`Con advertencia`,        
        icon: 'flash',
        value: ButtonActions.WARNED,
      },]      
    },{
      type: 'button-menu',
      field: 'mold-color',
      caption: $localize`Etiqueta del molde`,
      tooltip:  $localize`FIltrar la etiqueta de color del molde`,
      disabled: false,
      options: [{
        caption: $localize`(Todos los moldes)`,
        icon: 'record',
        value: ButtonActions.ALL,
        default: true,
      },
      {
        caption: $localize`ROJO`,
        icon: 'palette',
        value: ButtonActions.RED,
      },
      {
        caption: $localize`AMARILLO`,
        icon: 'palette',
        value: ButtonActions.YELLOW,        
      },
      {
        caption: $localize`AZUL`,
        icon: 'palette',
        value: ButtonActions.DODGERBLUE,        
      },
      {
        caption: $localize`NARANJA`,
        icon: 'palette',
        value: ButtonActions.ORANGE,        
      },
      {
        caption: $localize`VERDE`,
        icon: 'palette',
        value: ButtonActions.GREEN,        
      },]      
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
      class: 'warn',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      loading: false,
      disabled: false,
      action: ButtonActions.SAVE,
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
  
  trackByFn(index: any, item: any) { 
    return item.index; 
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

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.field === "mold-color") {
      this.moldColorFilter = action.action === ButtonActions.ALL ? '' : action.action;
    } else if (action.field === "mold-state") {
      this.moldStateFilter = action.action === ButtonActions.ALL ? '' : action.action;
    } else if (action.field === "mold-status") {
      this.moldStatusFilter = action.action === ButtonActions.ALL ? '' : action.action;
    }
    this.moldsHitsData$ = this._store.select(selectMoldsHitsQueryData).pipe(
      tap( filteredMoldsHits => {
        this.disableListAnimation = true;
        this.originalMoldsHits = filteredMoldsHits;      
        this.processFilterChange();
      })
    );
  }

  processFilterChange() {
    const reactivateSlider = this.filteredMoldsHits.length === 0;
    this.filterMoldsHitsQueryData();
    this.showFrom = 0;
    this.slider();
    if (this.filteredMoldsHits.length === 0) {
      this.finishAnimation();
    }
    if (reactivateSlider && this.filteredMoldsHits.length > 0) {
      this.showingMolds();
    }
    setTimeout(() => {
      this.disableListAnimation = false;
    }, 500);        
  }

  filterMoldsHitsQueryData() {        
      this.filteredMoldsHits = this.filterMoldsBy ? 
      this._sharedService.filterObject(this.originalMoldsHits, this.filterMoldsBy).filter(mold => 
      (!this.moldColorFilter || mold.data.label  === this.moldColorFilter) &&
      (!this.moldStateFilter || mold.data.state  === this.moldStateFilter) &&
      (!this.moldStatusFilter || mold.data.status  === this.moldStatusFilter))
      :
      this.originalMoldsHits.filter(mold => 
      (!this.moldColorFilter || mold.data.label  === this.moldColorFilter) &&
      (!this.moldStateFilter || mold.data.state  === this.moldStateFilter) &&
      (!this.moldStatusFilter || mold.data.status  === this.moldStatusFilter));            
  }

  slider() {
    this._sharedService.setGeneralLoading(
      ApplicationModules.MOLDS_HITS_VIEW,
      true,
    );
    if (this.sliderInitiated) return;
    this.sliderInitiated = true;
    this.moldsHitsToShow = [];        
  }

  addMoldsHitsToShow(element: number) {
    this.moldsHitsToShow.push({
      ...this.filteredMoldsHits[element],
      data: {
        ...this.filteredMoldsHits[element].data,
        index: element + 1,
      },            
    });
  }

  showingMolds() {       
    
    const moldsToShowLessOne = this.moldsToShow - 1;    
    if (this.filteredMoldsHits.length > this.moldsToShow) {                 
      if (this.showFrom + moldsToShowLessOne > this.filteredMoldsHits.length) {
        for (let i = this.showFrom; i < this.filteredMoldsHits.length; i++) {
          this.addMoldsHitsToShow(i);
        }
        for (let i = 0; i <= (this.showFrom + moldsToShowLessOne - this.filteredMoldsHits.length); i++) {
          this.addMoldsHitsToShow(i);
        }
        this.showFrom = this.showFrom + moldsToShowLessOne - this.filteredMoldsHits.length + 1;        
      } else {
        const limit = this.showFrom + moldsToShowLessOne > this.filteredMoldsHits.length - 1 ? this.filteredMoldsHits.length - 1 : this.showFrom + moldsToShowLessOne;
        for (let i = this.showFrom ; i <= limit; i++) {
          this.addMoldsHitsToShow(i);
        }
        this.showFrom = this.showFrom + this.moldsToShow;
        if (this.moldsHitsToShow.length < this.moldsToShow) {
          for (let i = 0; i <= (this.moldsToShow - this.moldsHitsToShow.length - 1); i++) {
            this.addMoldsHitsToShow(i);
          }
          this.showFrom = this.moldsToShow - this.moldsHitsToShow.length + 1;
        }
        
      }
      this.setToolbarLabel(`Página ${Math.ceil((this.showFrom) / this.moldsToShow)} de ${Math.ceil(this.filteredMoldsHits.length / this.moldsToShow)}`);
    } else if (this.filteredMoldsHits.length > 0) {
      this.showFrom = 0;
      this._sharedService.setToolbarTime(0);
      this.filteredMoldsHits.forEach((mold, index) => {
        this.moldsHitsToShow.push({
          ...mold,
          data: {
            ...mold.data,
            index: index + 1,
          },                        
        });
      });
      this.setToolbarLabel(`Página 1 de 1`);
    } else {
      this._sharedService.setToolbarTime(0);
      this.setToolbarLabel('');      
    }
  }

  setToolbarLabel(label: string) {
    this.currentLabel = label + `. <strong>Moldes: ${this.filteredMoldsHits.length}</strong>` + (this.filteredMoldsHits.length !==  this.originalMoldsHits.length ? ` filtrado(s) de ${this.originalMoldsHits.length}` : '');;
    if (this.elements.length > 0) {
      this.elements[0].caption = this.currentLabel;
    }
  }

// End ======================
}
