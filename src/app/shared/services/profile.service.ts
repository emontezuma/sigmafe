import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { sampleProfile } from '../../shared/sample-data';
import { ProfileData } from '../models/profile.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

// Variables ===============
  fakeProfileData: ProfileData = sampleProfile;
  data$: BehaviorSubject<ProfileData> = new BehaviorSubject(sampleProfile);


  constructor () { }

// Functions ================  
  getSettingsData(): Observable<ProfileData> {
    return of(this.fakeProfileData).pipe(
      delay(1500)
    );
  }

// End ======================
}
