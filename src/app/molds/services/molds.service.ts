import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';
    
import { MoldsHitsQueryData } from '../models/molds-hits.models';
import { GET_MOLDS_HITS, GET_MOLDS } from '../../graphql/graphql.queries';
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
    private apollo: Apollo,    
  ) {}

  // Functions ================  
  getMoldsHitsQueryData(): Observable<MoldsHitsQueryData> {
    return of(this.fakeMoldsHitsQueryData).pipe(
      delay(1500)
    );
  }

  getMoldsHitsQueryDataGql$(): Observable<any> {
    return this.apollo.watchQuery({ query: GET_MOLDS_HITS }).valueChanges    
  }

  getMoldsDataGql$(recosrdsToSkip: number = 0, recosrdsToTake: number = 50, orderBy: any = null): Observable<any> {
    let variables = undefined;
    if (recosrdsToSkip !== 0) {
      variables = { recosrdsToSkip: recosrdsToSkip };
    }
    if (recosrdsToTake !== 0) {
      if (variables) {         
        variables = { ...variables, recosrdsToTake: recosrdsToTake };
      } else {
        variables = { recosrdsToTake: recosrdsToTake };
      }      
    }
    if (orderBy) {
      if (variables) {         
        variables = { ...variables, orderBy: orderBy };
      } else {
        variables = { orderBy: orderBy };
      }
    }    
    return this.apollo.watchQuery({ query: GET_MOLDS, variables, context: { headers: { 'x-customer-id': '1', 'x-language-id': '1',  }} }).valueChanges    
  }

  // End ======================
}
