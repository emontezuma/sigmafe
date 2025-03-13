import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';
    
import { MoldsHitsQueryData } from '../models/molds-hits.models';
import { GET_MOLD_FAST, GET_MOLDS_HITS } from '../../graphql/graphql.queries';
import { Apollo } from 'apollo-angular';
import { MoldFastQuery } from '../models';
import { environment } from 'src/environments/environment';


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

  getMoldDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_MOLD_FAST,
      variables, 
    })
    .valueChanges    
  }

  mapOneFastMold(moldGqlData: any): MoldFastQuery {
    const { molds } = moldGqlData?.data;
    if (!molds || molds.items?.length === 0) return null;
    const data = molds.items[0]
    const mainImage = `${environment.serverUrl}/${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;
    return {
      ...data,
      mainImage,
      partNumberName: data.partNumber?.name,
      partNumberReference: data.partNumber?.reference,
    }
  }
  
  // End ======================
}
