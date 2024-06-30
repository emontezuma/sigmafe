import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, combineLatest, map } from 'rxjs';
import { GET_ACTION_PLANS_TO_GENERATE_LAZY_LOADING, INACTIVATE_VARIABLE, GET_PROVIDERS_LAZY_LOADING, GET_MANUFACTURERS_LAZY_LOADING, GET_GENERICS_LAZY_LOADING, GET_PART_NUMBERS_LAZY_LOADING, GET_LINES_LAZY_LOADING, GET_EQUIPMENTS_LAZY_LOADING, GET_MAINTENANCE_HISTORICAL_LAZY_LOADING, GET_ALL_MOLDS_TO_CSV, GET_MOLDS, GET_MOLD, GET_MOLD_TRANSLATIONS, INACTIVATE_MOLD, UPDATE_MOLD, DELETE_MOLD_TRANSLATIONS, ADD_MOLD_TRANSLATIONS, ADD_MAINTENANCE_HISTORY, DELETE_MAINTENANCE_HISTORY, GET_VARIABLES, ADD_VARIABLE_TRANSLATIONS, UPDATE_VARIABLE, DELETE_VARIABLE_TRANSLATIONS, GET_UOMS_LAZY_LOADING, GET_SIGMA_TYPES_LAZY_LOADING, GET_VARIABLE, GET_VARIABLE_TRANSLATIONS,  GET_CATALOG_DETAILS_CHECKLIST_TEMPLATES_LAZY_LOADING, DELETE_CATALOG_DETAILS, CREATE_OR_UPDATE_CATALOG_DETAILS, GET_SENSORS_LAZY_LOADING, GET_CATALOG_DETAILS_MOLDS_LAZY_LOADING, GET_CUSTOMERS, GET_CUSTOMER, GET_CUSTOMER_TRANSLATIONS, ADD_CUSTOMER_TRANSLATIONS, UPDATE_CUSTOMER, DELETE_CUSTOMER_TRANSLATIONS, GET_MANUFACTURERS, ADD_MANUFACTURER_TRANSLATIONS, GET_MANUFACTURER, GET_MANUFACTURER_TRANSLATIONS, UPDATE_MANUFACTURER, DELETE_MANUFACTURER_TRANSLATIONS, GET_PLANTS, ADD_PLANT_TRANSLATIONS, GET_PLANT, GET_PLANT_TRANSLATIONS, UPDATE_PLANT, DELETE_PLANT_TRANSLATIONS, DELETE_COMPANY_TRANSLATIONS, UPDATE_COMPANY, GET_COMPANY_TRANSLATIONS, GET_COMPANY, ADD_COMPANY_TRANSLATIONS, GET_COMPANIES, GET_PROVIDERS, ADD_PROVIDER_TRANSLATIONS, GET_PROVIDER, GET_PROVIDER_TRANSLATIONS, UPDATE_PROVIDER, DELETE_PROVIDER_TRANSLATIONS, INACTIVATE_CUSTOMER, INACTIVATE_COMPANY, GET_EQUIPMENTS, ADD_EQUIPMENT_TRANSLATIONS, GET_EQUIPMENT, GET_EQUIPMENT_TRANSLATIONS, UPDATE_EQUIPMENT, DELETE_EQUIPMENT_TRANSLATIONS, INACTIVATE_EQUIPMENT, GET_DEPARTMENTS, ADD_DEPARTMENT_TRANSLATIONS, GET_DEPARTMENT, GET_DEPARTMENT_TRANSLATIONS, UPDATE_DEPARTMENT, DELETE_DEPARTMENT_TRANSLATIONS, INACTIVATE_DEPARTMENT, GET_CHECKLIST_TEMPLATES, INACTIVATE_PLANT, GET_COMPANIES_LAZY_LOADING, ADD_UOM_TRANSLATIONS, GET_UOMS, GET_UOM, GET_UOM_TRANSLATIONS, UPDATE_UOM, DELETE_UOM_TRANSLATIONS, INACTIVATE_UOM, GET_POSITIONS, ADD_POSITION_TRANSLATIONS, GET_POSITION_TRANSLATIONS, GET_POSITION, UPDATE_POSITION, DELETE_POSITION_TRANSLATIONS, INACTIVATE_POSITION } from 'src/app/graphql/graphql.queries';
import { environment } from 'src/environments/environment';
import { CompanyDetail, CustomerDetail, DepartmentDetail, EquipmentDetail, PlantDetail, PositionDetail, UomDetail, VariableDetail } from '../models';
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

  getCompaniesLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_COMPANIES_LAZY_LOADING,
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

  getActionPlansToGenerateLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.query({ 
      query: GET_ACTION_PLANS_TO_GENERATE_LAZY_LOADING, 
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
      mutation: INACTIVATE_VARIABLE, 
      variables,       
    });
  }

  updateCustomerStatus$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: INACTIVATE_CUSTOMER, 
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
      const name = t.description ? t.description : t.name;
      return {
        id: t.id, 
        customerId: t.customerId,
        description: name, 
        name, 
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

  // getAllMoldsToCsv$(): Observable<any> {//warning repeated
  //   return this._apollo.watchQuery({ 
  //     query: GET_ALL_MOLDS_TO_CSV,       
  //   }).valueChanges;
  // }

  getAllMoldsCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  // getAllVariablesToCsv$(): Observable<any> {//warning repeated
  //   return this._apollo.watchQuery({ 
  //     query: GET_ALL_MOLDS_TO_CSV,       
  //   }).valueChanges;
  // }

  getAllVariablesCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  // getAllChecklistTemplatesToCsv$(): Observable<any> {//warning repeated
  //   return this._apollo.watchQuery({ 
  //     query: GET_ALL_MOLDS_TO_CSV,       
  //   }).valueChanges;
  // }

  getAllChecklistTemplatesCsvData$(fileName: string): Observable<any> {
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

  getChecklistTemplatesDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_CHECKLIST_TEMPLATES,
      variables
    }).valueChanges    
  }


  

  

  //====customers
  
  // getAllCustomersToCsv$(): Observable<any> { //warning repeated
  //   return this._apollo.watchQuery({ 
  //     query: GET_ALL_MOLDS_TO_CSV,       
  //   }).valueChanges;
  // }
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
    const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = data.mainImageName ? `${environment.serverUrl}/${data.mainImagePath.replace(data.mainImageName, data.mainImageGuid + '.' + extension)}` : '';
    
    return {
      ...data,
      mainImage,
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
  
  // getAllManufacturersToCsv$(): Observable<any> {//warning repeated
  //   return this._apollo.watchQuery({ 
  //     query: GET_ALL_MOLDS_TO_CSV,       
  //   }).valueChanges;
  // }
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

  // getAllPlantsToCsv$(): Observable<any> {//warning repeated
  //   return this._apollo.watchQuery({ 
  //     query: GET_ALL_MOLDS_TO_CSV,       
  //   }).valueChanges;
  // }

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
      company: this.mapDetailTranslationsData(data.company),
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
      mutation: INACTIVATE_PLANT, 
      variables,       
    });
  }  

  // getAllCompaniesToCsv$(): Observable<any> {//warning repeated
  //   return this._apollo.watchQuery({ 
  //     query: GET_ALL_MOLDS_TO_CSV,       
  //   }).valueChanges;
  // }

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
    const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = data.mainImageName ? `${environment.serverUrl}/${data.mainImagePath.replace(data.mainImageName, data.mainImageGuid + '.' + extension)}` : '';
    
    return {
      ...data,
      mainImage,
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
      mutation: INACTIVATE_COMPANY, 
      variables,       
    });
  }
  
  //======providers


  getAllProvidersCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getProvidersDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_PROVIDERS,
      variables
    }).valueChanges    
  }
  
  addProviderTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_PROVIDER_TRANSLATIONS, 
      variables,       
    });
  } 
  
  getProviderDataGql$(parameters: any): Observable<any> {
    const providerId = { providerId: parameters.providerId};

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([ 
      this._apollo.query({ 
      query: GET_PROVIDER, 
      variables: providerId,      
      }),
      
      this._apollo.query({ 
        query: GET_PROVIDER_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  updateProviderCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPDATE_PROVIDER, 
      variables,      
    })
  }
  
  mapOneProvider(paramsData: any): CompanyDetail {
    const { oneProvider } = paramsData?.providerGqlData?.data;
    const { data } = oneProvider;
    const translations = paramsData?.providerGqlTranslationsData?.data;
    
    
    return {
      ...data,
      translations: this.mapTranslations(translations),
    }
  }

  deleteProviderTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_PROVIDER_TRANSLATIONS, 
      variables,       
    });
  }

  updateProviderStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }

//======equipments

// getAllEquipmentsToCsv$(): Observable<any> {//warning repeated
//   return this._apollo.watchQuery({ 
//     query: GET_ALL_MOLDS_TO_CSV,       
//   }).valueChanges;
// }

getAllEquipmentsCsvData$(fileName: string): Observable<any> {
  return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
    map(data => data)
  );
}

getEquipmentsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
  const variables = {      
    ...(recordsToSkip !== 0) && { recordsToSkip },
    ...(recordsToTake !== 0) && { recordsToTake },
    ...(orderBy) && { orderBy },
    ...(filterBy) && { filterBy },
  }
  
  return this._apollo.watchQuery({ 
    query: GET_EQUIPMENTS,
    variables
  }).valueChanges    
}

addEquipmentTransations$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: ADD_EQUIPMENT_TRANSLATIONS, 
    variables,       
  });
} 

getEquipmentDataGql$(parameters: any): Observable<any> {
  const equipmentId = { equipmentId: parameters.equipmentId};

  const variables = {
    ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
    ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
    ...(parameters.order) && { orderBy: parameters.order },
    ...(parameters.filter) && { filterBy: parameters.filter },
  }

  return combineLatest([ 
    this._apollo.query({ 
    query: GET_EQUIPMENT, 
    variables: equipmentId,      
    }),
    
    this._apollo.query({ 
      query: GET_EQUIPMENT_TRANSLATIONS, 
      variables, 
    })
  ]);
}

updateEquipmentCatalog$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: UPDATE_EQUIPMENT, 
    variables,      
  })
}

mapOneEquipment(paramsData: any): EquipmentDetail {
  const { oneEquipment } = paramsData?.equipmentGqlData?.data;
  const { data } = oneEquipment;
  const translations = paramsData?.equipmentGqlTranslationsData?.data;
  const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
  const mainImage = data.mainImageName ? `${environment.serverUrl}/${data.mainImagePath.replace(data.mainImageName, data.mainImageGuid + '.' + extension)}` : '';
  
  return {
    ...data,
    mainImage,
    translations: this.mapTranslations(translations),
  }
}

deleteEquipmentTranslations$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: DELETE_EQUIPMENT_TRANSLATIONS, 
    variables,       
  });
}

updateEquipmentStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
  return this._apollo.mutate({
    mutation: INACTIVATE_EQUIPMENT, 
    variables,       
  });
}

  //======departments

getAllDepartmentsCsvData$(fileName: string): Observable<any> {
  return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
    map(data => data)
  );
}

getDepartmentsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
  const variables = {      
    ...(recordsToSkip !== 0) && { recordsToSkip },
    ...(recordsToTake !== 0) && { recordsToTake },
    ...(orderBy) && { orderBy },
    ...(filterBy) && { filterBy },
  }
  
  return this._apollo.watchQuery({ 
    query: GET_DEPARTMENTS,
    variables
  }).valueChanges    
}

addDepartmentTransations$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: ADD_DEPARTMENT_TRANSLATIONS, 
    variables,       
  });
} 

getDepartmentDataGql$(parameters: any): Observable<any> {
  const departmentId = { departmentId: parameters.departmentId};

  const variables = {
    ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
    ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
    ...(parameters.order) && { orderBy: parameters.order },
    ...(parameters.filter) && { filterBy: parameters.filter },
  }

  return combineLatest([ 
    this._apollo.query({ 
    query: GET_DEPARTMENT, 
    variables: departmentId,      
    }),
    
    this._apollo.query({ 
      query: GET_DEPARTMENT_TRANSLATIONS, 
      variables, 
    })
  ]);
}

updateDepartmentCatalog$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: UPDATE_DEPARTMENT, 
    variables,      
  })
}

mapOneDepartment(paramsData: any): DepartmentDetail {
  const { oneDepartment } = paramsData?.departmentGqlData?.data;
  const { data } = oneDepartment;
  const translations = paramsData?.departmentGqlTranslationsData?.data;
  const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
  const mainImage = data.mainImageName ? `${environment.serverUrl}/${data.mainImagePath.replace(data.mainImageName, data.mainImageGuid + '.' + extension)}` : '';
  
  return {
    ...data,
    mainImage,
    translations: this.mapTranslations(translations),
  }
}

deleteDepartmentTranslations$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: DELETE_DEPARTMENT_TRANSLATIONS, 
    variables,       
  });
}

updateDepartmentStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
  return this._apollo.mutate({
    mutation: INACTIVATE_DEPARTMENT, 
    variables,       
  });
}

  //======uoms



getAllUomsCsvData$(fileName: string): Observable<any> {
  return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
    map(data => data)
  );
}

getUomsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
  const variables = {      
    ...(recordsToSkip !== 0) && { recordsToSkip },
    ...(recordsToTake !== 0) && { recordsToTake },
    ...(orderBy) && { orderBy },
    ...(filterBy) && { filterBy },
  }
  
  return this._apollo.watchQuery({ 
    query: GET_UOMS,
    variables
  }).valueChanges    
}

addUomTransations$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: ADD_UOM_TRANSLATIONS, 
    variables,       
  });
} 

getUomDataGql$(parameters: any): Observable<any> {
  const departmentId = { departmentId: parameters.departmentId};

  const variables = {
    ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
    ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
    ...(parameters.order) && { orderBy: parameters.order },
    ...(parameters.filter) && { filterBy: parameters.filter },
  }

  return combineLatest([ 
    this._apollo.query({ 
    query: GET_UOM, 
    variables: departmentId,      
    }),
    
    this._apollo.query({ 
      query: GET_UOM_TRANSLATIONS, 
      variables, 
    })
  ]);
}

updateUomCatalog$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: UPDATE_UOM, 
    variables,      
  })
}

mapOneUom(paramsData: any): UomDetail {
  const { oneUom } = paramsData?.departmentGqlData?.data;
  const { data } = oneUom;
  const translations = paramsData?.departmentGqlTranslationsData?.data;
  
  
  return {
    ...data,
    translations: this.mapTranslations(translations),
  }
}

deleteUomTranslations$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: DELETE_UOM_TRANSLATIONS, 
    variables,       
  });
}

updateUomStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
  return this._apollo.mutate({
    mutation: INACTIVATE_UOM, 
    variables,       
  });
}

  
  //======positions

getAllPositionsCsvData$(fileName: string): Observable<any> {
  return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
    map(data => data)
  );
}

getPositionsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
  const variables = {      
    ...(recordsToSkip !== 0) && { recordsToSkip },
    ...(recordsToTake !== 0) && { recordsToTake },
    ...(orderBy) && { orderBy },
    ...(filterBy) && { filterBy },
  }
  
  return this._apollo.watchQuery({ 
    query: GET_POSITIONS,
    variables
  }).valueChanges    
}

addPositionTransations$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: ADD_POSITION_TRANSLATIONS, 
    variables,       
  });
} 

getPositionDataGql$(parameters: any): Observable<any> {
  const positionId = { positionId: parameters.positionId};

  const variables = {
    ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
    ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
    ...(parameters.order) && { orderBy: parameters.order },
    ...(parameters.filter) && { filterBy: parameters.filter },
  }

  return combineLatest([ 
    this._apollo.query({ 
    query: GET_POSITION, 
    variables: positionId,      
    }),
    
    this._apollo.query({ 
      query: GET_POSITION_TRANSLATIONS, 
      variables, 
    })
  ]);
}

updatePositionCatalog$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: UPDATE_POSITION, 
    variables,      
  })
}

mapOnePosition(paramsData: any): PositionDetail {
  const { onePosition } = paramsData?.positionGqlData?.data;
  const { data } = onePosition;
  const translations = paramsData?.positionGqlTranslationsData?.data;
  const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
  const mainImage = data.mainImageName ? `${environment.serverUrl}/${data.mainImagePath.replace(data.mainImageName, data.mainImageGuid + '.' + extension)}` : '';
  
  return {
    ...data,
    mainImage,
    translations: this.mapTranslations(translations),
  }
}

deletePositionTranslations$(variables: any): Observable<any> {
  return this._apollo.mutate({
    mutation: DELETE_POSITION_TRANSLATIONS, 
    variables,       
  });
}

updatePositionStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
  return this._apollo.mutate({
    mutation: INACTIVATE_POSITION, 
    variables,       
  });
}

  
  //======partNumbers


  getAllPartNumbersCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getPartNumbersDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_PROVIDERS,
      variables
    }).valueChanges    
  }
  
  addPartNumberTransations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: ADD_PROVIDER_TRANSLATIONS, 
      variables,       
    });
  } 
  
  getPartNumberDataGql$(parameters: any): Observable<any> {
    const partNumberId = { partNumberId: parameters.partNumberId};

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([ 
      this._apollo.query({ 
      query: GET_PROVIDER, 
      variables: partNumberId,      
      }),
      
      this._apollo.query({ 
        query: GET_PROVIDER_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  updatePartNumberCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPDATE_PROVIDER, 
      variables,      
    })
  }
  
  mapOnePartNumber(paramsData: any): CompanyDetail {
    const { onePartNumber } = paramsData?.partNumberGqlData?.data;
    const { data } = onePartNumber;
    const translations = paramsData?.partNumberGqlTranslationsData?.data;
    
    
    return {
      ...data,
      translations: this.mapTranslations(translations),
    }
  }

  deletePartNumberTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_PROVIDER_TRANSLATIONS, 
      variables,       
    });
  }

  updatePartNumberStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }
  
  
//refactor
  
getAllToCsv$(): Observable<any> {//warning repeated
  return this._apollo.watchQuery({ 
    query: GET_ALL_MOLDS_TO_CSV,       
  }).valueChanges;
}
  
// End ======================  
}
