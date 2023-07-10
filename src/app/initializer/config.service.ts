import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../app/state/app.state'; 
import { loadSettingsData } from '../../app/state/actions/settings.actions';
import { selectLoadingState } from '../state/selectors/settings.selectors';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
// Variables ================
  controlTimer: any;
 
  constructor(
    private store: Store<AppState>,
  ) { }

// Functions ================
  load(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.store.dispatch(loadSettingsData());
      this.controlTimer = setTimeout(() => {
        resolve(false);
      }, 10000);
      this.store.select(selectLoadingState).subscribe((loading) => {
        if (!loading) {
          clearTimeout(this.controlTimer);
          resolve(true);
        }
      });
    }); 
  } 

// End ======================
}
