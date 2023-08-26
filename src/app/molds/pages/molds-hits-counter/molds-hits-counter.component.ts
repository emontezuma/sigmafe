import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";

import { routingAnimation, dissolve } from '../../../shared/animations/shared.animations';
import { MoldsHitsQueryData } from '../../models/molds.models';
import { AppState } from '../../../state/app.state'; 
import { selectMoldsHitsQueryData, selectLoadingMoldsHitsState } from '../../../state/selectors/molds.selectors'; 
import { loadMoldsHitsQueryData } from 'src/app/state/actions/molds.actions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ApplicationModules, ButtonActions, ScreenSizes, ToolbarButtons } from 'src/app/shared/models/screen.models';
import { SettingsData } from '../../../shared/models/settings.models'
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { ProfileData } from 'src/app/shared/models/profile.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-molds-hits-counter',
  animations: [ routingAnimation, dissolve ],
  templateUrl: './molds-hits-counter.component.html',
  styleUrls: ['./molds-hits-counter.component.scss']
})
export class MoldsHitsCounterComponent implements OnInit {
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
  @ViewChild('moldsQueryList') private moldsQueryList: ElementRef;  
  
// Variables ===============
  moldsHitsQueryData: MoldsHitsQueryData;
  settingsData: SettingsData;
  profileData: ProfileData;
  colsBySize: number = 2;
  loading: boolean = true;
  animate: boolean = true;
  filterMoldsBy: string = '';
  buttons: ToolbarButtons[] = [];
  onTopStatus: string  = 'inactive';
  goTopButtonTimer: any;
  loaded: boolean = false;
  scrollSubscriber: Subscription;
  settingDataSubscriber: Subscription;
  profileDataSubscriber: Subscription;
  searchBoxSubscriber: Subscription;
  showGoTopSubscriber: Subscription;
  animationSubscriber: Subscription;
  moldsHitsLoadingSubscriber: Subscription;
  moldsHitsDataSubscriber: Subscription;
    
  form = new FormGroup({
  });

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
    public scrollDispatcher: ScrollDispatcher,
  ) { }

// Hooks ====================
  ngOnInit() {
    // Settings
    this.sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_HITS_VIEW,
      true,
    );
    this.sharedService.setSearchBox(
      ApplicationModules.MOLDS_HITS_VIEW,
      true,
    );    
    this.moldsHitsLoadingSubscriber = this.store.select(selectLoadingMoldsHitsState).subscribe( loading => {
      this.loading = loading;
      this.sharedService.setGeneralLoading(
        ApplicationModules.MOLDS_HITS_VIEW,
        loading,
      );
      this.sharedService.setGeneralProgressBar(
        ApplicationModules.MOLDS_HITS_VIEW,
        loading,
      );
      this.loaded = loading === false;
    });
    
    // Dispatches
    this.store.dispatch(loadMoldsHitsQueryData());  

    // Subscriptions
    this.profileDataSubscriber = this.store.select(selectProfileData).subscribe( profileData => {
      this.profileData = profileData;
    });
    this.settingDataSubscriber = this.store.select(selectSettingsData).subscribe( settingsData => {
      this.settingsData = settingsData;
    });    
    this.moldsHitsDataSubscriber = this.store.select(selectMoldsHitsQueryData).subscribe( moldsHitsQueryData => { 
      this.moldsHitsQueryData = moldsHitsQueryData;            
    });
    this.searchBoxSubscriber = this.sharedService.search.subscribe((searchBox) => {
      if (searchBox.from === ApplicationModules.MOLDS_HITS_VIEW) {
        this.filterMoldsBy = searchBox.textToSearch;  
      }
    });
    this.animationSubscriber = this.sharedService.isAnimationFinished.subscribe((animationStatus) => {      
      if (animationStatus.isFinished && animationStatus.toState === 'ChecklistFillingComponent') {
        // this.animationFinished(null);
      }      
    });    
    this.showGoTopSubscriber = this.sharedService.showGoTop.subscribe((goTop) => {
      if (goTop.status === 'temp') {
        this.onTopStatus = 'active';
        this.moldsQueryList.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
        // Ensure
      }      
    });
    this.scrollSubscriber = this.scrollDispatcher
    .scrolled()
    .subscribe((data: any) => {
      this.getScrolling(data);
    });
    // this.animationFinished(null);      
  }

  ngOnDestroy() : void {
    this.sharedService.setToolbar(
      ApplicationModules.MOLDS_HITS_VIEW,
      false,
      '',
      '',
      this.buttons,
    );
    this.sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_HITS_VIEW,
      false,
    );
    // Turn off subscriptions
    if (this.scrollSubscriber) this.scrollSubscriber.unsubscribe();
    if (this.settingDataSubscriber) this.settingDataSubscriber.unsubscribe();
    if (this.showGoTopSubscriber) this.showGoTopSubscriber.unsubscribe();
    if (this.profileDataSubscriber) this.profileDataSubscriber.unsubscribe();
    if (this.searchBoxSubscriber) this.searchBoxSubscriber.unsubscribe();
    if (this.moldsHitsDataSubscriber) this.moldsHitsDataSubscriber.unsubscribe();
    if (this.moldsHitsLoadingSubscriber) this.moldsHitsLoadingSubscriber.unsubscribe();
    if (this.animationSubscriber) this.animationSubscriber.unsubscribe();
  }

// Functions ================
  animationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this.calcButtons();
        this.sharedService.setToolbar(
          ApplicationModules.MOLDS_HITS_VIEW,
          true,
          'toolbar-grid',
          'divider',
          this.buttons,
        );
      }, 500);
    }
  }

  calcButtons() {
    this.buttons = [{
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
    return index; 
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
          this.sharedService.setGoTopButton(
            ApplicationModules.GENERAL,
            'inactive',
          );
        }
        return;
      }, 2500);
    }
    if (this.onTopStatus !== status) {
      this.onTopStatus = status;
      this.sharedService.setGoTopButton(
        ApplicationModules.GENERAL,
        status,
      );
    }
  }

// End ======================
}
