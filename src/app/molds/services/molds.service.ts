import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';
    
import { MoldsHitsQueryData } from '../models/molds-hits.models';
import { GET_MOLDS_HITS } from '../../graphql/graphql.queries';
import { Apollo } from 'apollo-angular';


@Injectable({
  providedIn: 'root'
})
export class MoldsService {

  // Variables ===============
  fakeMoldsHitsQueryData: MoldsHitsQueryData = null;
  data$: BehaviorSubject<MoldsHitsQueryData> = new BehaviorSubject(null);

  private linesBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  lines: Observable<any[]> = this.linesBehaviorSubject.asObservable();

  constructor (
    private _apollo: Apollo,    
  ) {}

  // Functions ================  
  getMoldsHitsQueryData(): Observable<MoldsHitsQueryData> {
    return of(this.fakeMoldsHitsQueryData).pipe(
      delay(1500)
    );
  }

  getMoldsHitsQueryDataGql$(): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_MOLDS_HITS, }).valueChanges    
  }
  
  // End ======================
}
