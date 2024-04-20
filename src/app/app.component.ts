import { Component, HostListener, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { Platform } from '@angular/cdk/platform';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from "@angular/material/snack-bar";

import { Screen, ScreenSizes, ShowElement, ToolbarControl } from './shared/models/screen.models'; 
import { SharedService } from './shared/services/shared.service'; 
import { AppState } from './state/app.state'; 
import * as appActions from './state/actions/screen.actions';
import { appearing, dissolve, fromTop } from '../app/shared/animations/shared.animations';
import { loadProfileData } from './state/actions/profile.action';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { ApplicationModules } from 'src/app/shared/models/screen.models';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileData } from './shared/models/profile.models';
import { SnackComponent } from "./shared/components";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ appearing, dissolve, fromTop, ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChildren('mainProgressBar') mainProgressBar: QueryList<ElementRef>;

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
  toolbarData: ToolbarControl;
  progressBarData: ShowElement;
  scrollbarData: ShowElement;
  scrollbarInToobar: boolean = false;
  onTopStatus: string  = 'inactive';
  outletHeight = '100%';
  invalidSize = false;
  toolbarWidth: number = 0;
  toolbarCurrentSize: ScreenSizes = ScreenSizes.SMALL;
  toolbarAnimated: boolean = false;
  goTopButtonTimer: any;
  lotsOfTabs = new Array(6).fill(0).map((_, index) => `Tab ${index}`);
  profileDataSubscriber: Subscription;
  profileData: ProfileData;
  avatar: string = '';
  tmpUpdateHits: any;
  
  allHeight: number = 300;
  toolbarHeight: number = 0;
  // allHeight = window.innerHeight - 190;
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
  
  constructor (
    private store: Store<AppState>,
    public platform: Platform,
    private breakpointObserver: BreakpointObserver,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    ) {
      this.breakpointObserver
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
            this.size = this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

// Hooks ====================
  ngOnInit(): void {
    this.tmpUpdateHits = new FormGroup({
      id: new FormControl(null, Validators.required),
      hits: new FormControl(null, Validators.required),
    })
    this.profileDataSubscriber = this.store.select(selectProfileData).subscribe( profileData => {
      this.profileData = profileData;
    });    
    this.sharedService.showLoader.subscribe((showLoader: ShowElement) => {
      setTimeout(() => {
        this.loading = showLoader.show;        
      }, 0);      
    });
    this.sharedService.showToolbar.subscribe((toolbar) => {
      this.toolbarData = toolbar;
      this.calculateOutletPosition();   
    });
    this.sharedService.showScrollBar.subscribe((scrollbarData) => {
      this.scrollbarData = scrollbarData;        
    });
    this.sharedService.scrollbarInToolbar.subscribe((scrollbarData) => {
      this.scrollbarInToobar = scrollbarData;        
    });
    this.sharedService.showToolbarWidth.subscribe((width) => {
      this.toolbarWidth = width + 60;
    });
    this.sharedService.showProgressBar.subscribe((progressBar) => {
      this.progressBarData = progressBar;      
    });
    this.sharedService.showGoTop.subscribe((goTop) => {
      this.onTopStatus = goTop.status;
      this.changeDetectorRef.detectChanges();
    });
    this.sharedService.snackMessage.subscribe((snackBar) => {
      let validDuration = snackBar.duration;      
      if (!snackBar.buttonIcon && !snackBar.buttonText && !validDuration) {
        validDuration = 4000;
      }
      this.snackBar.openFromComponent(SnackComponent, {
        data: snackBar,
        panelClass: [snackBar.snackClass],
        duration: validDuration
      });
    });
    this.sharedService.setTimer();
    this.handlerScreenSizeChange(null);
    this.store.dispatch(loadProfileData()); //TODO: Se colocara una vez que el usuario se autentique
  }

  ngAfterViewInit(): void {
    // this.mainProgressBar.changes.subscribe((components: QueryList<ElementRef>) => {
    //   components.forEach((component: any) => {
    //     component._elementRef.nativeElement.style.setProperty('--mdc-linear-progress-track-color', 'white');     
    //   })
    // });

    const progressBars = document.getElementsByName("active-progress-bar");
    progressBars.forEach((element) => {
      element?.style.setProperty('--mdc-linear-progress-track-color', 'var(--z-colors-page-background-color)');     
    })
  }
 
// Functions ================
  animationFinished(e: any) {    
    if (e.fromState !== 'void') {
      this.sharedService.SetAnimationFinished(e.fromState, e.toState, true);
    }  
  }

  calculateOutletPosition() {        
    const toolbarHeight = this.scrollbarInToobar ? 80 : 61;
    this.toolbarHeight = toolbarHeight - 61;
    this.allHeight = (window.innerHeight - 98)  - (this.toolbarData.show ? (toolbarHeight + 15) : 0);
    this.outletHeight = (window.innerHeight - 106) + 'px';
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
    this.toolbarCurrentSize = (this.toolbarData.show && this.toolbarWidth > screen.innerWidth) ? ScreenSizes.SMALL : ScreenSizes.NORMAL;
  }

  gotoTop() {
    this.sharedService.setGoTopButton(
      ApplicationModules.GENERAL,
      'temp',
    );    
  }

  prepareRoute(outlet: RouterOutlet) {
    this.sharedService.SetAnimationFinished('', '', false);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  toolbarAnimationFinished(e: any) {
    this.toolbarAnimated = true;
  }

  toolbarAnimationStarted(e: any) {
    this.toolbarAnimated = false;
  }

  updateHit() {
    this.tmpUpdateHits.reset();
   }  

// End ======================
}
