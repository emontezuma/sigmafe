import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

import { sampleMoldsData } from '../../shared/sample-data';
import { MoldsData } from '../../molds/models/molds.models';

@Injectable({
  providedIn: 'root'
})
export class MoldsService {

  // Variables ===============
  fakeMoldsData: MoldsData = sampleMoldsData;
  data$: BehaviorSubject<MoldsData> = new BehaviorSubject(sampleMoldsData);


  constructor() { }

  // Functions ================  
  getMoldsData(): Observable<MoldsData> {
    return of(this.fakeMoldsData).pipe(
      delay(1500)
    );
  }

  // End ======================
}
