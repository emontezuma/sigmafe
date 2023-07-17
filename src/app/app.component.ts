import { Component, HostListener, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Platform } from '@angular/cdk/platform';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Screen, ScreenSizes, ShowElement, ToolbarElement } from './shared/models/screen.models'; 
import { SharedService } from './shared/services/shared.service'; 
import { ColorsService } from './shared/services/colors.service'; 
import { AppState } from './state/app.state'; 
import * as appActions from './state/actions/screen.actions';
import { appearing, dissolve, downUp } from '../app/shared/animations/shared.animations';
import { loadProfileData } from './state/actions/profile.action';
import { ApplicationModules } from 'src/app/shared/models/screen.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ appearing, dissolve, downUp ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize({ target } : any) {
    const { screen, outerHeight, innerHeight, outerWidth, innerWidth } = target;
    const screenData: Screen = {
      platform: this.platform,
      size: this.size,
      orientation: screen.orientation.type,
      outerHeight,
      innerHeight,
      outerWidth,
      innerWidth,
    }
    this.handlerScreenSizeChange(screenData);
    this.calculateOutletPosition();
  }

// Variables ================
  title = 'sigma';
  size: string = '';  
  showNormalToolbar = false;  
  withToolbar = true;
  toggleSlider = false;
  loading = false;
  toolbarData: ToolbarElement;
  progressBarData: ShowElement;
  scrollBarData: ShowElement;
  onTopStatus: string  = 'inactive';
  outletPosition =  '48px';
  smartphoneView = false;
  invalidSize = false;
  goTopButtonTimer: any;
  // allHeight: number = 300;
  allHeight = window.innerHeight - 50;
  displayNameMap = new Map([
    [Breakpoints.Handset, 'Handset'],
    [Breakpoints.HandsetLandscape, 'HandsetLandscape'],
    [Breakpoints.HandsetPortrait, 'HandsetPortrait'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Tablet, 'Tablet'],
    [Breakpoints.TabletLandscape, 'TabletLandscape'],
    [Breakpoints.TabletPortrait, 'TabletPortrait'],
    [Breakpoints.Web, 'Web'],
    [Breakpoints.WebLandscape, 'WebLandscape'],
    [Breakpoints.WebPortrait, 'WebPortrait'],
    [Breakpoints.XLarge, 'XLarge'],
    [Breakpoints.XSmall, 'XSmall'],
  ]);
  
  constructor(
    private store: Store<AppState>,
    public platform: Platform,
    private breakpointObserver: BreakpointObserver,
    private sharedService: SharedService,
    private colorsService: ColorsService,
    ) { 
    breakpointObserver
    .observe([
      Breakpoints.Handset,
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait,
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.Small,
      Breakpoints.Tablet,
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait,
      Breakpoints.Web,
      Breakpoints.WebLandscape,
      Breakpoints.WebPortrait,
      Breakpoints.XLarge,
      Breakpoints.XSmall,
    ])
    .pipe()
    .subscribe((result: any) => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.size = this.displayNameMap.get(query) ?? 'Unknown';;
        }
      }
    });
  }

// Hooks ====================
  ngOnInit(): void {
    this.sharedService.showLoader.subscribe((showLoader: ShowElement) => {
      this.loading = showLoader.show;
    });
    this.sharedService.showToolbar.subscribe((toolbar) => {
      this.toolbarData = toolbar;
      this.smartphoneView = this.toolbarData.size === ScreenSizes.SMALL;
      this.calculateOutletPosition(); 
    });
    this.sharedService.showScrollBar.subscribe((scrollBarData) => {
      this.scrollBarData = scrollBarData;
    });
    this.sharedService.showProgressBar.subscribe((progressBar) => {
      this.progressBarData = progressBar;
      this.calculateOutletPosition();
    });
    this.sharedService.showGoTop.subscribe((goTop) => {
      this.onTopStatus = goTop.status;
    });
    this.handlerScreenSizeChange(null);
    this.store.dispatch(loadProfileData()); //TODO: Se colocara una vez que el usuario se autentique
   }
   
  ngAfterViewInit(): void { }

// Functions ================
  calculateOutletPosition() {
    this.outletPosition = (48  + (this.progressBarData?.show ? 4 : 0)).toString() + 'px';
    this.allHeight = window.innerHeight - 92  - (this.progressBarData?.show ? 4 : 0) - (this.toolbarData?.show && !this.smartphoneView ? 64 : 0);
  }

  handlerScreenSizeChange(screen: Screen | null) {
    if (!screen) {
      screen = {
        platform: this.platform,
        size: this.size,
        orientation: window.screen.orientation.type,
        innerHeight: window.innerHeight,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth,
        innerWidth: window.innerWidth,
      };
    }
    this.invalidSize = screen.innerWidth < 350 || screen.innerHeight < 400;
    if (!this.invalidSize) {
      this.store.dispatch(
        appActions.changeScreenState({ screen })
      );
    }    
  }

  goToTop() {
    this.sharedService.setGoTopButton(
      ApplicationModules.GENERAL,
      'temp',
    );    
  }

// End ======================
}
