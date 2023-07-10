import { Component, OnInit, HostListener, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Platform } from '@angular/cdk/platform';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";
import { Subscription } from 'rxjs';

import { Screen, ShowElement } from './shared/models/screen.models'; 
import { SharedService } from './shared/services/shared.service'; 
import { AppState } from './state/app.state'; 
import * as appActions from './state/actions/screen.actions';
import { appearing, dissolve } from '../app/shared/animations/shared.animations';
import { loadProfileData } from './state/actions/profile.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ appearing, dissolve ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(CdkScrollable, { static: false }) cdkScrollable: CdkScrollable;
  
  @HostListener('window:resize', ['$event'])
  onResize({ target } : any) {
    const { screen, outerHeight, innerHeight, outerWidth, innerWidth } = target;
    const metricsToFollow: Screen = {
      platform: this.platform,
      size: this.size,
      width: screen.width,
      height: screen.height,
      availableWidth: screen.availWidth,
      availableHeight: screen.availHeight,
      orientation: screen.orientation.type,
      outerHeight,
      innerHeight,
      outerWidth,
      innerWidth,
    };
    this.handlerScreenSizeChange(metricsToFollow);
    this.allHeight = metricsToFollow.innerHeight;
  }

// Variables ================
  title = 'sigma';
  size: string = '';  
  showNormalToolbar = false;  
  withToolbar = true;
  toggleSlider = false;
  loading = false;
  isToolbarActive = false;
  isWaitingForProcess = true;
  onTopStatus: string  = 'inactive';
  allHeight: number = 0;
  scrollingSubscription: Subscription;
  goTopButtonTimer: any;
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
    public scroll: ScrollDispatcher,
    private breakpointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService,    
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
    this.scrollingSubscription = this.scroll
    .scrolled()
    .subscribe((data: any) => {
      this.miScroll(data);
    });
    this.sharedService.showLoader.subscribe((showLoader: ShowElement) => {
      this.loading = showLoader.show;
    });
    this.store.dispatch(loadProfileData()); //TODO: Se colocara una vez que el usuario se autentique
   }
   
  ngAfterViewInit(): void { }

// Functions ================
  handlerScreenSizeChange(metricsToFollow: Screen) {
    this.store.dispatch(
      appActions.changeScreenState({ screen: metricsToFollow })
    );
  }

  miScroll(data: CdkScrollable) {    
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;    
    if (scrollTop < 5) {
      this.onTopStatus = 'inactive';
    } else if (this.onTopStatus !== 'temp') {
      this.onTopStatus = 'active';
      clearTimeout(this.goTopButtonTimer);
      this.goTopButtonTimer = setTimeout(() => {
        this.onTopStatus = 'inactive';
        this.changeDetectorRef.detectChanges();    
      }, 2500);
    }
    this.changeDetectorRef.detectChanges();    
  }

  goToTop() {
    this.onTopStatus = 'temp';
    this.changeDetectorRef.detectChanges();
    this.cdkScrollable.scrollTo({ top: 0, behavior: 'smooth' });
  }

// End ======================
}
