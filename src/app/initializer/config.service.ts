import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../app/state/app.state'; 
import { loadSettingsData } from '../../app/state/actions/settings.actions';
import { selectLoadingSettingsState } from '../state/selectors/settings.selectors';
import { loadColorsData } from '../state/actions/colors.actions';
import { selectLoadingColorsState } from '../state/selectors/colors.selectors';
import { ColorsService } from 'src/app/shared/services/colors.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
// Variables ================
  controlTimer: any;
  processesFinished: number = 0;
 
  constructor(
    private store: Store<AppState>,
    private colorsService: ColorsService,
  ) { }

// Functions ================
  load(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.store.dispatch(loadSettingsData());
      this.store.dispatch(loadColorsData());
      this.controlTimer = setTimeout(() => {
        resolve(false);
      }, 10000);
      this.store.select(selectLoadingSettingsState).subscribe((loading) => {
        if (!loading) {          
          this.processesFinished = this.processesFinished + 1;
          if (this.processesFinished === 2) {
            clearTimeout(this.controlTimer);
            resolve(true);
          }          
        }
      });
      this.store.select(selectLoadingColorsState).subscribe((loading) => {
        if (!loading) {
          this.colorsService.setColors();
          this.processesFinished = this.processesFinished + 1;
          if (this.processesFinished === 2) {
            clearTimeout(this.controlTimer);
            resolve(true);
          }
        }
      });
    }); 
  } 

// End ======================
}
