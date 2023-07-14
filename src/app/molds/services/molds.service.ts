import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { sampleMoldsHitsQueryData } from '../../shared/sample-data';
import { MoldsHitsQueryData } from '../../molds/models/molds.models';

@Injectable({
  providedIn: 'root'
})
export class MoldsService {

  // Variables ===============
  fakeMoldsHitsQueryData: MoldsHitsQueryData = sampleMoldsHitsQueryData;
  data$: BehaviorSubject<MoldsHitsQueryData> = new BehaviorSubject(sampleMoldsHitsQueryData);


  constructor() { }

  // Functions ================  
  getMoldsHitsQueryData(): Observable<MoldsHitsQueryData> {
    return of(this.fakeMoldsHitsQueryData).pipe(
      delay(1500)
    );
  }

  // End ======================
}
