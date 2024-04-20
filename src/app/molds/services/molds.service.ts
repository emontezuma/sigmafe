import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
    
// import { sampleMoldsHitsQueryData } from '../../shared/sample-data';
import { MoldsHitsQueryData } from '../models/molds-hits.models';
import { GET_MOLDS_HITS, GET_MOLDS } from '../../graphql/graphql.queries';
import { Apollo } from 'apollo-angular';
// import { Socket } from 'ngx-socket-io';
import { updateMoldsHitsData } from 'src/app/state/actions/molds-hits.actions';
import { AppState } from 'src/app/state/app.state';

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
    // private socket: Socket,
    private store: Store<AppState>,
  ) {
    // socket.fromEvent('response').subscribe((message: any) => {      
    //   console.log('hitMold: ', message)            
    //   this.store.dispatch(updateMoldsHitsData({ hitMold: message }));        
    // });
    
    // socket.fromEvent('disconnect').subscribe(() => {
        // TODO implement it...
    // });
  
  }

  // Functions ================  
  getMoldsHitsQueryData(): Observable<MoldsHitsQueryData> {
    return of(this.fakeMoldsHitsQueryData).pipe(
      delay(1500)
    );
  }

  getMoldsHitsQueryDataGql$() {
    return this.apollo.watchQuery({ query: GET_MOLDS_HITS }).valueChanges    
  }

  getMoldsDataGql$(recosrdsToSkip: number = 0, recosrdsToTake: number = 0, orderBy: any = null) {
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
    return this.apollo.watchQuery({ query: GET_MOLDS, variables }).valueChanges    
  }

  // End ======================
}
