import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../app/state/app.state'; 
import { loadSettingsData } from '../../app/state/actions/settings.actions';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private store: Store<AppState>,
  ) { }

  setSettings() {
    this.store.dispatch(loadSettingsData());
  }  
}
