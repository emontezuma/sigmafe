import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { sampleChecklistFillingData } from '../../shared/sample-data';
import { ChecklistFillingData } from '../models/checklists.models';

@Injectable({
  providedIn: 'root'
})
export class ChecklistsService {

  // Variables ===============
  fakeChecklistFillingData: ChecklistFillingData = sampleChecklistFillingData;
  data$: BehaviorSubject<ChecklistFillingData> = new BehaviorSubject(sampleChecklistFillingData);


  constructor() { }

  // Functions ================  
  getChecklistFillingData(): Observable<ChecklistFillingData> {
    return of(this.fakeChecklistFillingData).pipe(
      delay(1500)
    );
  }

  // End ======================
}
