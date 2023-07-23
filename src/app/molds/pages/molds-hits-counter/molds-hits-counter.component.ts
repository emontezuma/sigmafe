import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";

import { fromTop } from '../../../shared/animations/shared.animations';
import { MoldsHitsQueryData } from '../../models/molds.models';
import { AppState } from '../../../state/app.state'; 
import { selectSharedScreen } from '../../../state/selectors/screen.selectors'; 
import { selectMoldsHitsQueryData, selectLoadingMoldsHitsState } from '../../../state/selectors/molds.selectors'; 
import { loadMoldsHitsQueryData } from 'src/app/state/actions/molds.actions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ColorsService } from 'src/app/shared/services/colors.service';
import { ApplicationModules, ScreenSizes, ToolbarButtons } from 'src/app/shared/models/screen.models';
import { SettingsData } from '../../../shared/models/settings.models'
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { ProfileData } from 'src/app/shared/models/profile.models';
import { selectColorsData } from 'src/app/state/selectors/colors.selectors';

@Component({
  selector: 'app-molds-hits-counter',
  animations: [ fromTop ],
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
  currentSize: ScreenSizes = ScreenSizes.NORMAL;
  cardWidth: string;
  loading: boolean = true;
  animate: boolean = true;
  filterMoldsBy: string = '';
  buttons: ToolbarButtons[] = [];
  onTopStatus: string  = 'inactive';
  goTopButtonTimer: any;
  loaded: boolean = false;
  toolbar: ElementRef | null;
  
  form = new FormGroup({
  });

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
    private colorsService: ColorsService,
    public scrollDispatcher: ScrollDispatcher,
  ) { }

// Hooks ====================
  ngOnInit() {
    this.store.select(selectSettingsData).subscribe( settingsData => {
      this.settingsData = settingsData;
    });
    this.store.select(selectSharedScreen).subscribe( shared => {
      this.currentSize = shared.innerWidth <= 300 ? ScreenSizes.SMALL : ScreenSizes.NORMAL;
      if (this.loaded) {
        if (shared.innerWidth <= 300) {
          this.calcButtons(ScreenSizes.SMALL);
          this.sharedService.setToolbar(
            ApplicationModules.MOLDS_HITS_VIEW,
            true,
            ScreenSizes.SMALL,
            this.buttons,
          );
        } else if (shared.innerWidth > 300) {
          this.calcButtons(ScreenSizes.NORMAL);
          this.sharedService.setToolbar(
            ApplicationModules.MOLDS_HITS_VIEW,
            true,
            ScreenSizes.NORMAL,
            this.buttons,
          );
        }      
      }              
    });
    this.store.select(selectProfileData).subscribe( profileData => {
      this.profileData = profileData;
    });
    this.store.select(selectLoadingMoldsHitsState).subscribe( loading => {
      this.loading = loading;
      this.sharedService.setGeneralLoading(
        ApplicationModules.MOLDS_HITS_VIEW,
        loading,
      );
      this.sharedService.setGeneralPreogressBar(
        ApplicationModules.MOLDS_HITS_VIEW,
        loading,
      );
      this.loaded = loading === false;
    });
    this.store.select(selectMoldsHitsQueryData).subscribe( moldsHitsQueryData => { 
      this.moldsHitsQueryData = moldsHitsQueryData;            
    });
    this.sharedService.setSearchBox(
      ApplicationModules.MOLDS_HITS_VIEW,
      true,
    );
    this.sharedService.search.subscribe((searchBox) => {
      if (searchBox.from === ApplicationModules.MOLDS_HITS_VIEW) {
        this.filterMoldsBy = searchBox.textToSearch;  
      }
    });
    this.store.select(selectColorsData).subscribe( colorsData => {
      this.colorsService.setColors(ApplicationModules.MOLDS_HITS_VIEW, colorsData)
    });
    this.sharedService.showGoTop.subscribe((goTop) => {
      if (goTop.status === 'temp') {
        this.onTopStatus = 'active';
        this.moldsQueryList.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
        // Ensure
      }      
    });

    this.scrollDispatcher
    .scrolled()
    .subscribe((data: any) => {
      this.getScrolling(data);
    });

    this.store.dispatch(loadMoldsHitsQueryData());    
  }

  ngOnDestroy() : void {
    this.sharedService.setToolbar(
      ApplicationModules.MOLDS_HITS_VIEW,
      false,
      this.currentSize,
      this.buttons,
    );
    this.sharedService.setGeneralScrollBar(
      ApplicationModules.MOLDS_HITS_VIEW,
      false,
    );
  }

// Functions ================
  animateToolbar(e: any) {
    if (e.fromState === 'void') {
      setTimeout(() => {
        this.calcButtons(this.currentSize);
        this.sharedService.setToolbar(
          ApplicationModules.MOLDS_HITS_VIEW,
          true,
          this.currentSize,
          this.buttons,
        );
        this.sharedService.setGeneralScrollBar(
          ApplicationModules.MOLDS_HITS_VIEW,
          true,
        );
      }, 300);
    }
  }

  calcButtons(size: ScreenSizes) {
    this.currentSize = size;    
    this.buttons = [{
      type: 'button',
      caption: $localize`Actualizar la vista`,
      tooltip:  $localize`Actualiza la vista`,
      icon: 'reload',
      primary: false,
      iconSize: '24px',
      showThis: true,
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      disabled: false,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: "",
      primary: false,
      iconSize: "",
      showThis: true,
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      disabled: true,
    },{
      type: 'button',
      caption: $localize`Exportar`,
      tooltip: $localize`Exporta la vista`,
      icon: 'download',
      primary: false,
      iconSize: '24px',
      showThis: true,
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      disabled: false,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: "",
      primary: false,
      iconSize: "",
      showThis: size === ScreenSizes.NORMAL,
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      disabled: true,
    },{
      type: 'searchbox',
      caption: '',
      tooltip: '',
      icon: '',
      primary: false,
      iconSize: '',
      showThis: size === ScreenSizes.NORMAL,
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      disabled: true,
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
