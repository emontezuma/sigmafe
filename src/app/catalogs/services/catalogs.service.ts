import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, combineLatest, map } from 'rxjs';
import { GET_PROVIDERS_LAZY_LOADING, GET_MANUFACTURERS_LAZY_LOADING, GET_GENERICS_LAZY_LOADING, GET_PART_NUMBERS_LAZY_LOADING, GET_LINES_LAZY_LOADING, GET_EQUIPMENTS_LAZY_LOADING, GET_MAINTENANCE_HISTORICAL_LAZY_LOADING, GET_ALL_MOLDS_TO_CSV, GET_MOLDS, GET_MOLD, GET_MOLD_TRANSLATIONS, INACTIVATE_MOLD, UPDATE_MOLD, DELETE_MOLD_TRANSLATIONS, ADD_MOLD_TRANSLATIONS, ADD_MAINTENANCE_HISTORY, DELETE_MAINTENANCE_HISTORY, GET_VARIABLES, ADD_VARIABLE_TRANSLATIONS, UPDATE_VARIABLE, DELETE_VARIABLE_TRANSLATIONS, GET_UOMS_LAZY_LOADING, GET_SIGMA_TYPES_LAZY_LOADING, GET_VARIABLE, GET_VARIABLE_TRANSLATIONS,  GET_CATALOG_DETAILS_CHECKLIST_TEMPLATES_LAZY_LOADING, DELETE_CATALOG_DETAILS, CREATE_OR_UPDATE_CATALOG_DETAILS, GET_SENSORS_LAZY_LOADING, GET_CATALOG_DETAILS_MOLDS_LAZY_LOADING, GET_CATALOG_DETAILS_ACTION_PLANS_LAZY_LOADING, GET_CUSTOMERS, GET_CUSTOMER, GET_CUSTOMER_TRANSLATIONS, ADD_CUSTOMER_TRANSLATIONS, UPDATE_CUSTOMER, DELETE_CUSTOMER_TRANSLATIONS, GET_MANUFACTURERS, ADD_MANUFACTURER_TRANSLATIONS, GET_MANUFACTURER, GET_MANUFACTURER_TRANSLATIONS, UPDATE_MANUFACTURER, DELETE_MANUFACTURER_TRANSLATIONS, GET_PLANTS, ADD_PLANT_TRANSLATIONS, GET_PLANT, GET_PLANT_TRANSLATIONS, UPDATE_PLANT, DELETE_PLANT_TRANSLATIONS, DELETE_COMPANY_TRANSLATIONS, UPDATE_COMPANY, GET_COMPANY_TRANSLATIONS, GET_COMPANY, ADD_COMPANY_TRANSLATIONS, GET_COMPANIES } from 'src/app/graphql/graphql.queries';
import { environment } from 'src/environments/environment';
import { CompanyDetail, CustomerDetail, PlantDetail, VariableDetail } from '../models';
import { GeneralCatalogMappedItem, GeneralTranslation, MoldDetail } from 'src/app/shared/models';

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

  getSensorsLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_SENSORS_LAZY_LOADING,
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

  getChecklistTemplatesYellowLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.query({ 
      query: GET_CATALOG_DETAILS_CHECKLIST_TEMPLATES_LAZY_LOADING, 
      variables,
    });
  }

  getMoldsLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.query({ 
      query: GET_CATALOG_DETAILS_MOLDS_LAZY_LOADING, 
      variables,
    });
  }

  getActionPlansLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.query({ 
      query: GET_CATALOG_DETAILS_ACTION_PLANS_LAZY_LOADING, 
      variables,
    });
  }

  getChecklistTemplatesRedLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.query({ 
      query: GET_CATALOG_DETAILS_CHECKLIST_TEMPLATES_LAZY_LOADING, 
      variables,
    });
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
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
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
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
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
  }7

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

  deleteCatalogDetails$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_CATALOG_DETAILS, 
      variables,       
    });
  }

  addMoldTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_MOLD_TRANSLATIONS, 
      variables,       
    });
  }

  addOrUpdateCatalogDetails$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: CREATE_OR_UPDATE_CATALOG_DETAILS, 
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
        customerId: t.customerId, 
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

  getAllMoldsToCsv$(): Observable<any> {//warning repeated
    return this._apollo.watchQuery({ 
      query: GET_ALL_MOLDS_TO_CSV,       
    }).valueChanges;
  }

  getAllMoldsCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getAllVariablesToCsv$(): Observable<any> {//warning repeated
    return this._apollo.watchQuery({ 
      query: GET_ALL_MOLDS_TO_CSV,       
    }).valueChanges;
  }

  getAllVariablesCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getMoldsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_MOLDS,
      variables
    }).valueChanges    
  }

  getVariablesDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_VARIABLES,
      variables
    }).valueChanges    
  }

  

  //====customers
  
  getAllCustomersToCsv$(): Observable<any> { //warning repeated
    return this._apollo.watchQuery({ 
      query: GET_ALL_MOLDS_TO_CSV,       
    }).valueChanges;
  }
  getAllCustomersCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }
  getCustomersDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_CUSTOMERS,
      variables
    }).valueChanges    
  }

  
  
  addCustomerTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_CUSTOMER_TRANSLATIONS, 
      variables,       
    });
  } 
  
  getCustomerDataGql$(parameters: any): Observable<any> {
    const customerId = { customerId: parameters.customerId};

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([ 
      this._apollo.query({ 
      query: GET_CUSTOMER, 
      variables: customerId,      
      }),
      
      this._apollo.query({ 
        query: GET_CUSTOMER_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  updateCustomerCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPDATE_CUSTOMER, 
      variables,      
    })
  }
  
  mapOneCustomer(paramsData: any): CustomerDetail {
    const { oneCustomer } = paramsData?.customerGqlData?.data;
    const { data } = oneCustomer;
    const translations = paramsData?.customerGqlTranslationsData?.data;
    
    
    return {
      ...data,
      translations: this.mapTranslations(translations),
    }
  }

  deleteCustomerTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_CUSTOMER_TRANSLATIONS, 
      variables,       
    });
  }


  //manufacturers=================================
  
  getAllManufacturersToCsv$(): Observable<any> {//warning repeated
    return this._apollo.watchQuery({ 
      query: GET_ALL_MOLDS_TO_CSV,       
    }).valueChanges;
  }
  getAllManufacturersCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }
  getManufacturersDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_MANUFACTURERS,
      variables
    }).valueChanges    
  }

  
  
  addManufacturerTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_MANUFACTURER_TRANSLATIONS, 
      variables,       
    });
  } 
  
  getManufacturerDataGql$(parameters: any): Observable<any> {
    const manufacturerId = { manufacturerId: parameters.manufacturerId};

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([ 
      this._apollo.query({ 
      query: GET_MANUFACTURER, 
      variables: manufacturerId,      
      }),
      
      this._apollo.query({ 
        query: GET_MANUFACTURER_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  updateManufacturerCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPDATE_MANUFACTURER, 
      variables,      
    })
  }
  
  mapOneManufacturer(paramsData: any): CustomerDetail {
    const { oneManufacturer } = paramsData?.manufacturerGqlData?.data;
    const { data } = oneManufacturer;
    const translations = paramsData?.manufacturerGqlTranslationsData?.data;
    
    
    return {
      ...data,
      translations: this.mapTranslations(translations),
    }
  }

  deleteManufacturerTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_MANUFACTURER_TRANSLATIONS, 
      variables,       
    });
  }

  updateManufacturerStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }

  //======plants

  getAllPlantsToCsv$(): Observable<any> {//warning repeated
    return this._apollo.watchQuery({ 
      query: GET_ALL_MOLDS_TO_CSV,       
    }).valueChanges;
  }

  getAllPlantsCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getPlantsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_PLANTS,
      variables
    }).valueChanges    
  }
  
  addPlantTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_PLANT_TRANSLATIONS, 
      variables,       
    });
  } 
  
  getPlantDataGql$(parameters: any): Observable<any> {
    const plantId = { plantId: parameters.plantId};

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([ 
      this._apollo.query({ 
      query: GET_PLANT, 
      variables: plantId,      
      }),
      
      this._apollo.query({ 
        query: GET_PLANT_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  updatePlantCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPDATE_PLANT, 
      variables,      
    })
  }
  
  mapOnePlant(paramsData: any): PlantDetail {
    const { onePlant } = paramsData?.plantGqlData?.data;
    const { data } = onePlant;
    const translations = paramsData?.plantGqlTranslationsData?.data;
    
    
    return {
      ...data,
      translations: this.mapTranslations(translations),
    }
  }

  deletePlantTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_PLANT_TRANSLATIONS, 
      variables,       
    });
  }

  updatePlantStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }
  
  
  //======companies


  getAllCompaniesToCsv$(): Observable<any> {//warning repeated
    return this._apollo.watchQuery({ 
      query: GET_ALL_MOLDS_TO_CSV,       
    }).valueChanges;
  }

  getAllCompaniesCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getCompaniesDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_COMPANIES,
      variables
    }).valueChanges    
  }
  
  addCompanyTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_COMPANY_TRANSLATIONS, 
      variables,       
    });
  } 
  
  getCompanyDataGql$(parameters: any): Observable<any> {
    const companyId = { companyId: parameters.companyId};

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([ 
      this._apollo.query({ 
      query: GET_COMPANY, 
      variables: companyId,      
      }),
      
      this._apollo.query({ 
        query: GET_COMPANY_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  updateCompanyCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPDATE_COMPANY, 
      variables,      
    })
  }
  
  mapOneCompany(paramsData: any): CompanyDetail {
    const { oneCompany } = paramsData?.companyGqlData?.data;
    const { data } = oneCompany;
    const translations = paramsData?.companyGqlTranslationsData?.data;
    
    
    return {
      ...data,
      translations: this.mapTranslations(translations),
    }
  }

  deleteCompanyTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_COMPANY_TRANSLATIONS, 
      variables,       
    });
  }

  updateCompanyStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }
  


// End ======================  
}
