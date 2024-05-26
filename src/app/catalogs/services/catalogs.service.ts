import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, combineLatest, forkJoin, map } from 'rxjs';
import { GET_PROVIDERS_LAZY_LOADING, GET_MANUFACTURERS_LAZY_LOADING, GET_GENERICS_LAZY_LOADING, GET_HARDCODED_VALUES, GET_PART_NUMBERS_LAZY_LOADING, GET_LINES_LAZY_LOADING, GET_EQUIPMENTS_LAZY_LOADING, GET_MAINTENANCE_HISTORICAL_LAZY_LOADING, GET_ALL_MOLDS_TO_CSV, GET_MOLDS, GET_MOLD, GET_MOLD_TRANSLATIONS, INACTIVATE_MOLD } from 'src/app/graphql/graphql.queries';
import { MoldDetail, MoldTranslation } from 'src/app/molds';
import { environment } from 'src/environments/environment';
import { GeneralCatalogMappedItem } from '../models';

@Injectable({
  providedIn: 'root'
})

export class CatalogsService {

  constructor (
    private _apollo: Apollo,    
    private _http: HttpClient,    
  ) {}
  
// Functions ================  
  getProvidersLazyLoadingDataGql$(variables: any): Observable<any> {
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

  getMoldDataGql$(parameters: any): Observable<any> {

    const moldId = { moldId: parameters.moldId};

    let variables = undefined;
    if (parameters.skipRecords !== 0) {
      variables = { recosrdsToSkip: parameters.skipRecords };
    }
    if (parameters.takeRecords !== 0) {
      if (variables) {         
        variables = { ...variables, recosrdsToTake: parameters.takeRecords };
      } else {
        variables = { recosrdsToTake: parameters.takeRecords };
      }      
    }
    if (parameters.order) {
      if (variables) {         
        variables = { ...variables, orderBy: parameters.order };
      } else {
        variables = { orderBy: parameters.order };
      }
    }    
    if (parameters.filter) {
      if (variables) {         
        variables = { ...variables, filterBy: parameters.filter };
      } else {
        variables = { filterBy: parameters.filter };
      }
    }
    
    return combineLatest([
      this._apollo.watchQuery({ 
      query: GET_MOLD, 
      variables: moldId, 
      }).valueChanges, 
      
      this._apollo.watchQuery({ 
        query: GET_MOLD_TRANSLATIONS, 
        variables, 
      }).valueChanges 
    ]);
  }

  updateMoldStatus$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }

  mapOneMold(paramsData: any): MoldDetail {
    const { oneMold } = paramsData?.moldGqlData?.data;
    const { data } = oneMold;
    const translations = paramsData?.moldGqlTranslationsData?.data;

    const extension = data.mainImageName?.split('.').pop();

    return {
      ...data,
      mainImagePath: `${environment.serverUrl}/${data.mainImagePath}${data.mainImageGuid}.${extension}`,      
      provider: this.mapDetailGeneralData(oneMold.translatedProvider, data.provider),
      manufacturer: this.mapDetailGeneralData(oneMold.translatedManufacturer, data.manufacturer),
      line: this.mapDetailGeneralData(oneMold.translatedLine, data.line),
      equipment: this.mapDetailGeneralData(oneMold.translatedEquipment, data.equipment),
      partNumber: this.mapDetailGeneralData(oneMold.translatedPartNumber, data.partNumber),
      moldType: this.mapDetailGeneralData(oneMold.translatedMoldType, data.moldType),
      moldClass: this.mapDetailGeneralData(oneMold.translatedMoldClass, data.moldClass),
      translations: this.mapTranslations(translations),
    }
  }

  mapTranslations(data: any): MoldTranslation {
    const graphqlDataObjectName = Object.keys(data)[0];    
    const { items } = data[graphqlDataObjectName];
    return items.map((t) => {
      return {
        id: t.id, 
        customerId: t.id, 
        description: t.description, 
        reference: t.reference, 
        notes: t.notes, 
        languageId: t.languageId, 
        languageName: t.language?.name,         
        languageIso: t.language?.iso,         
        updatedByUserName: t.updatedBy?.name,
        updatedAt: t.updatedAt,
      }
    }) 
  }

  mapDetailGeneralData(translatedEntity: any, data: any): GeneralCatalogMappedItem {
    return {      
      id: data.id,
      status: data.status,      
      translatedName: translatedEntity.translatedName,
      translatedDescription: translatedEntity.translatedDescription,
      translatedPrefix: translatedEntity.translatedPrefix,
      translatedReference: translatedEntity.translatedReference,
      translatedNotes: translatedEntity.translatedNotes,
      isTranslated: translatedEntity.isTranslated,
    }
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
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
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
