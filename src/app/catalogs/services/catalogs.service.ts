import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { GET_PROVIDERS_LAZY_LOADING, GET_MANUFACTURERS_LAZY_LOADING, GET_GENERICS_LAZY_LOADING, GET_HARDCODED_VALUES, GET_PART_NUMBERS_LAZY_LOADING, GET_LINES_LAZY_LOADING, GET_EQUIPMENTS_LAZY_LOADING, GET_MAINTENANCE_HISTORICAL_LAZY_LOADING, GET_ALL_MOLDS_TO_CSV, GET_MOLDS, GET_MOLD } from 'src/app/graphql/graphql.queries';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CatalogsService {

  constructor (
    private _apollo: Apollo,    
    private _http: HttpClient,    
  ) {}
  
// Functions ================  
  getpProvidersLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_PROVIDERS_LAZY_LOADING,
      variables,
    }).valueChanges;
  }

  getManufacturersLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_MANUFACTURERS_LAZY_LOADING, 
      variables,
    }).valueChanges;
  }

  getLinesLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_LINES_LAZY_LOADING, 
      variables, 
    }).valueChanges;
  }

  getEquipmentsLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_EQUIPMENTS_LAZY_LOADING, 
      variables, 
    }).valueChanges;
  }

  getMaintenancesLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_MAINTENANCE_HISTORICAL_LAZY_LOADING, 
      variables, 
    }).valueChanges;
  }

  getPartNumbersLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_PART_NUMBERS_LAZY_LOADING, 
      variables, 
    }).valueChanges;
  }

  getGenericsLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_GENERICS_LAZY_LOADING, 
      variables, 
    }).valueChanges;
  }

  getMoldDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_MOLD, 
      variables, 
    }).valueChanges;
  }

  getHardcodedValuesDataGql$(variables: any): Observable<any> {
    // No filters, skip or take records applied to the hardcode values table but the tableNamefield, 
    // This is because this values list must be short

  return this._apollo.watchQuery({ 
      query: GET_HARDCODED_VALUES, 
      variables, 
    }).valueChanges;
  }

  getAllMoldsToCsv$(): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_ALL_MOLDS_TO_CSV,       
    }).valueChanges;
  }

  getAllMoldsCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.apiUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getMoldsDataGql$(recosrdsToSkip: number = 0, recosrdsToTake: number = 50, orderBy: any = null, filter: any = null): Observable<any> {
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
    if (filter) {
      if (variables) {         
        variables = { ...variables, filterBy: filter };
      } else {
        variables = { filterBy: filter };
      }
    }    
    return this._apollo.watchQuery({ 
      query: GET_MOLDS,
      variables
    }).valueChanges    
  }

// End ======================  
}
