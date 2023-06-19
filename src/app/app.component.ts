import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Screen } from './shared/models/screen.models'; 
import { AppState } from './state/app.state'; 
import * as screenActions from './state/actions/screen.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'sigma';
  showNormalToolbar = false;
  withToolbar = true;
  
  constructor(private store: Store<AppState>) {

  }

  // Hooks ====================
  ngOnInit() {
    const screen: Screen = {
      size: 'grande',
      availableHeight: 0,
      availableWidth: 0,
      height: 0,
      innerHeight: 0,
      innerWidth: 0,
      orientation: '',
      outerHeight: 0,
      outerWidth: 0,
      width: 0,
    };
    console.log('OnInit');
    this.store.dispatch(screenActions.changeScreenState( { screenSize: screen } ));
  }

}
