import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { sampleSettings } from '../../shared/sample-data';
import { SettingsData } from '../../shared/models/settings.models';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Variables ===============
  fakeSettingsData: SettingsData = sampleSettings;
  data$: BehaviorSubject<SettingsData> = new BehaviorSubject(sampleSettings);


  constructor() { }

  // Functions ================  
  getSettingsData(): Observable<SettingsData> {
    return of(this.fakeSettingsData).pipe(
      delay(1500)
    );
  }

  // End ======================
}