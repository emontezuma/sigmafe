import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, combineLatest, forkJoin, map } from 'rxjs';
import { GET_PROVIDERS_LAZY_LOADING, GET_MANUFACTURERS_LAZY_LOADING, GET_GENERICS_LAZY_LOADING, GET_PART_NUMBERS_LAZY_LOADING, GET_LINES_LAZY_LOADING, GET_EQUIPMENTS_LAZY_LOADING, GET_MAINTENANCE_HISTORICAL_LAZY_LOADING, GET_ALL_MOLDS_TO_CSV, GET_MOLDS, GET_MOLD, GET_MOLD_TRANSLATIONS, INACTIVATE_MOLD, UPDATE_MOLD, DELETE_MOLD_TRANSLATIONS, ADD_MOLD_TRANSLATIONS, ADD_MAINTENANCE_HISTORY, DELETE_MAINTENANCE_HISTORY, GET_VARIABLES, ADD_VARIABLE_TRANSLATIONS, UPDATE_VARIABLE, DELETE_VARIABLE_TRANSLATIONS, GET_UOMS_LAZY_LOADING, GET_SIGMA_TYPES_LAZY_LOADING, GET_VARIABLE, GET_VARIABLE_TRANSLATIONS } from 'src/app/graphql/graphql.queries';
import { MoldDetail } from 'src/app/molds';
import { environment } from 'src/environments/environment';
import { GeneralCatalogMappedItem, VariableDetail } from '../models';
import { GeneralTranslation } from '../models/generics.models';

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

  getUomsLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_UOMS_LAZY_LOADING,
      variables,
    }).valueChanges;
  }

  getSigmaTypesLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_SIGMA_TYPES_LAZY_LOADING,
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
    return this._apollo.query({ 
      query: GET_MAINTENANCE_HISTORICAL_LAZY_LOADING, 
      variables, 
    });
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

    const variables = {
      ...(parameters.skipRecords !== 0) && { recosrdsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }
    
    return combineLatest([
      this._apollo.query({ 
      query: GET_MOLD, 
      variables: moldId,      
      }),
      
      this._apollo.query({ 
        query: GET_MOLD_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  getVariableDataGql$(parameters: any): Observable<any> {

    const variableId = { variableId: parameters.variableId};

    const variables = {
      ...(parameters.skipRecords !== 0) && { recosrdsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }
    
    return combineLatest([ 
      this._apollo.query({ 
      query: GET_VARIABLE, 
      variables: variableId,      
      }),
      
      this._apollo.query({ 
        query: GET_VARIABLE_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  updateMoldStatus$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }

  updateVariableStatus$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }

  updateMoldCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPDATE_MOLD, 
      variables,      
    })
  }

  updateVariableCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPDATE_VARIABLE, 
      variables,      
    })
  }

  deleteMoldTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_MOLD_TRANSLATIONS, 
      variables,       
    });
  }

  deleteVariableTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_VARIABLE_TRANSLATIONS, 
      variables,       
    });
  }

  deleteMoldMaintenanceHistory$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_MAINTENANCE_HISTORY, 
      variables,       
    });
  }


  addMoldTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_MOLD_TRANSLATIONS, 
      variables,       
    });
  }

  addVariableTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_VARIABLE_TRANSLATIONS, 
      variables,       
    });
  }

  addMoldMaintenanceHistory$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_MAINTENANCE_HISTORY, 
      variables,       
    });
  }

  mapOneMold(paramsData: any): MoldDetail {
    const { oneMold } = paramsData?.moldGqlData?.data;
    const { data } = oneMold;
    const translations = paramsData?.moldGqlTranslationsData?.data;
    const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = data.mainImageName ? `${environment.serverUrl}/${data.mainImagePath.replace(data.mainImageName, data.mainImageGuid + '.' + extension)}` : '';
    return {
      ...data,
      mainImage,      
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

  mapOneVariable(paramsData: any): VariableDetail {
    const { oneVariable } = paramsData?.variableGqlData?.data;
    const { data } = oneVariable;
    const translations = paramsData?.variableGqlTranslationsData?.data;
    const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = data.mainImageName ? `${environment.serverUrl}/${data.mainImagePath.replace(data.mainImageName, data.mainImageGuid + '.' + extension)}` : '';
    return {
      ...data,
      mainImage,      
      uom: this.mapDetailTranslationsData(data.uom),
      sigmaType: this.mapDetailTranslationsData(data.sigmaType),
      translations: this.mapTranslations(translations),
    }
  }

  mapTranslations(data: any): GeneralTranslation {
    const graphqlDataObjectName = Object.keys(data)[0];    
    const { items } = data[graphqlDataObjectName];
    return items.map((t) => {
      return {
        id: t.id, 
        customerId: t.id, 
        description: t.description, 
        name: t.name, 
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
    if (!translatedEntity || !data) return null;
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

  mapDetailTranslationsData(internalObjectData: any): GeneralCatalogMappedItem {
    if (!internalObjectData) return null;
    return {      
      id: internalObjectData.id,
      status: internalObjectData.status,      
      translatedName: internalObjectData.translations.length > 0 ? internalObjectData.translations[0].name : internalObjectData.name,
      translatedReference: internalObjectData.translations.length > 0 ? internalObjectData.translations[0].reference : internalObjectData.reference,
      translatedNotes: internalObjectData.translations.length > 0 ? internalObjectData.translations[0].notes : internalObjectData.notes,
      translatedPrefix: internalObjectData.translations.length > 0 ? internalObjectData.translations[0].prefix : internalObjectData.prefix,      
      translatedDescription: internalObjectData.translations.length > 0 ? internalObjectData.translations[0].description : internalObjectData.description,      
      isTranslated: internalObjectData.translations.length > 0 && internalObjectData.translations[0].languageId > 0 ? true : false,
    }
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

  getAllVariablesToCsv$(): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_ALL_MOLDS_TO_CSV,       
    }).valueChanges;
  }

  getAllVariablesCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getMoldsDataGql$(recosrdsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
    const variables = {      
      ...(recosrdsToSkip !== 0) && { recosrdsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_MOLDS,
      variables
    }).valueChanges    
  }

  getVariablesDataGql$(recosrdsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
    const variables = {      
      ...(recosrdsToSkip !== 0) && { recosrdsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_VARIABLES,
      variables
    }).valueChanges    
  }

// End ======================  
}
