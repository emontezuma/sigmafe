import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Platform } from '@angular/cdk/platform';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Screen } from './shared/models/screen.models'; 
import { AppState } from './state/app.state'; 
import * as appActions from './state/actions/screen.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @HostListener('window:resize', ['$event'])
  onResize({ target } : any) {
    // Listen for screen size changes
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
  }
  // Variables ================
  title = 'sigma';
  size: string = '';
  showNormalToolbar = false;
  withToolbar = true;
  toggleSlider = false;
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
    breakpointObserver: BreakpointObserver,
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
  ngOnInit(): void { }

  ngAfterViewInit(): void { }
  // Functions ================

  handlerScreenSizeChange(metricsToFollow: Screen) {
    console.log(metricsToFollow);
    this.store.dispatch(
      appActions.changeScreenState({ screen: metricsToFollow })
    );
  }
  // End ======================
}
