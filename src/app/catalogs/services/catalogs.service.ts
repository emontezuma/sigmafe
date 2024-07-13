import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, combineLatest, map, of, tap } from 'rxjs';
import { GET_ACTION_PLANS_TO_GENERATE_LAZY_LOADING, INACTIVATE_VARIABLE, GET_PROVIDERS_LAZY_LOADING, GET_MANUFACTURERS_LAZY_LOADING, GET_GENERICS_LAZY_LOADING, GET_PART_NUMBERS_LAZY_LOADING, GET_LINES_LAZY_LOADING, GET_EQUIPMENTS_LAZY_LOADING, GET_MAINTENANCE_HISTORICAL_LAZY_LOADING, GET_ALL_MOLDS_TO_CSV, GET_MOLDS, GET_MOLD, GET_MOLD_TRANSLATIONS, INACTIVATE_MOLD, UPSERT_MOLD, DELETE_MOLD_TRANSLATIONS, UPSERT_MOLD_TRANSLATIONS, UPSERT_MAINTENANCE_HISTORY, DELETE_MAINTENANCE_HISTORY, GET_VARIABLES, UPSERT_VARIABLE_TRANSLATIONS, UPSERT_VARIABLE, DELETE_VARIABLE_TRANSLATIONS, GET_UOMS_LAZY_LOADING, GET_SIGMA_TYPES_LAZY_LOADING, GET_VARIABLE, GET_VARIABLE_TRANSLATIONS, GET_CATALOG_DETAILS_CHECKLIST_TEMPLATES_LAZY_LOADING, DELETE_CATALOG_DETAILS, UPSERT_CATALOG_DETAILS, GET_SENSORS_LAZY_LOADING, GET_CATALOG_DETAILS_MOLDS_LAZY_LOADING, GET_CUSTOMERS, GET_CUSTOMER, GET_CUSTOMER_TRANSLATIONS, UPSERT_CUSTOMER_TRANSLATIONS, UPSERT_CUSTOMER, DELETE_CUSTOMER_TRANSLATIONS, GET_MANUFACTURERS, UPSERT_MANUFACTURER_TRANSLATIONS, GET_MANUFACTURER, GET_MANUFACTURER_TRANSLATIONS, UPSERT_MANUFACTURER, DELETE_MANUFACTURER_TRANSLATIONS, GET_PLANTS, UPSERT_PLANT_TRANSLATIONS, GET_PLANT, GET_PLANT_TRANSLATIONS, UPSERT_PLANT, DELETE_PLANT_TRANSLATIONS, DELETE_COMPANY_TRANSLATIONS, UPSERT_COMPANY, GET_COMPANY_TRANSLATIONS, GET_COMPANY, UPSERT_COMPANY_TRANSLATIONS, GET_COMPANIES, GET_PROVIDERS, UPSERT_PROVIDER_TRANSLATIONS, GET_PROVIDER, GET_PROVIDER_TRANSLATIONS, UPSERT_PROVIDER, DELETE_PROVIDER_TRANSLATIONS, INACTIVATE_CUSTOMER, INACTIVATE_COMPANY, GET_EQUIPMENTS, UPSERT_EQUIPMENT_TRANSLATIONS, GET_EQUIPMENT, GET_EQUIPMENT_TRANSLATIONS, UPSERT_EQUIPMENT, DELETE_EQUIPMENT_TRANSLATIONS, INACTIVATE_EQUIPMENT, GET_CHECKLIST_TEMPLATES, INACTIVATE_PLANT, GET_COMPANIES_LAZY_LOADING, GET_ALL_ATTACHMENTS, SAVE_ATTACHMENTS, DUPLICATE_ATTACHMENTS, INACTIVATE_CHECKLIST_TMEPLATE, UPSERT_CHECKLIST_TEMPLATE, UPSERT_CHECKLIST_TEMPLATE_TRANSLATIONS, DELETE_CHECKLIST_TEMPLATE_TRANSLATIONS, GET_CHECKLIST_TEMPLATE, GET_CHECKLIST_TEMPLATE_TRANSLATIONS, GET_RECIPIENTS_LAZY_LOADING, GET_UOMS, UPSERT_UOM_TRANSLATIONS, GET_UOM, GET_UOM_TRANSLATIONS, UPSERT_UOM, DELETE_UOM_TRANSLATIONS, INACTIVATE_UOM, GET_POSITIONS, UPSERT_POSITION_TRANSLATIONS, GET_POSITION, GET_POSITION_TRANSLATIONS, UPSERT_POSITION, DELETE_POSITION_TRANSLATIONS, INACTIVATE_POSITION, GET_PART_NUMBERS, UPSERT_PART_NUMBER_TRANSLATIONS, GET_PART_NUMBER, GET_PART_NUMBER_TRANSLATIONS, UPSERT_PART_NUMBER, DELETE_PART_NUMBER_TRANSLATIONS, GET_LINES, UPSERT_LINE_TRANSLATIONS, GET_LINE, GET_LINE_TRANSLATIONS, UPSERT_LINE, DELETE_LINE_TRANSLATIONS, INACTIVATE_LINE, GET_PLANTS_LAZY_LOADING, GET_APPROVERS_LAZY_LOADING, GET_VARIABLES_LAZY_LOADING, GET_CHECKLIST_TEMPLATE_DETAILS, GET_DEPARTMENTS, UPSERT_DEPARTMENT_TRANSLATIONS, GET_DEPARTMENT, GET_DEPARTMENT_TRANSLATIONS, DELETE_DEPARTMENT_TRANSLATIONS, UPSERT_DEPARTMENT, INACTIVATE_DEPARTMENT, GET_GENERICS, UPSERT_GENERIC_TRANSLATIONS, GET_GENERIC, GET_GENERIC_TRANSLATIONS, UPSERT_GENERIC, DELETE_GENERIC_TRANSLATIONS, GET_SHIFTS, UPSERT_SHIFT_TRANSLATIONS, GET_SHIFT, GET_SHIFT_TRANSLATIONS, UPSERT_SHIFT, DELETE_SHIFT_TRANSLATIONS, INACTIVATE_SHIFT, UPSERT_CHECKLIST_TEMPLATE_DETAILS, DELETE_CHECKLIST_TEMPLATE_DETAILS, UPSERT_WORKGROUP } from 'src/app/graphql/graphql.queries';
import { ChecklistTemplateDetail, ChecklistTemplateLine, ShiftDetail, } from '../models';
import { Attachment, originProcess, GeneralCatalogMappedItem, GeneralTranslation, MoldDetail } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';
import { CompanyDetail, CustomerDetail, DepartmentDetail, EquipmentDetail, LineDetail, PlantDetail, PositionDetail, UomDetail, VariableDetail } from '../models';
import { WorkgroupDetail } from '../models/catalogs-workgroups.models';
import { SharedService } from 'src/app/shared/services';
@Injectable({
  providedIn: 'root'
})

export class CatalogsService {

  private checkListTemplateLineDataChangedBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ line: 0, data: null });
  checkListTemplateLineChanged: Observable<any> = this.checkListTemplateLineDataChangedBehaviorSubject.asObservable();
  
  constructor(
    private _apollo: Apollo,
    private _http: HttpClient,
    public _sharedService: SharedService,
  ) { }

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

  getRecipientsLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({
      query: GET_RECIPIENTS_LAZY_LOADING,
      variables,
    }).valueChanges;
  }

  getApproversLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({
      query: GET_APPROVERS_LAZY_LOADING,
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

  getPlantsLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({ 
      query: GET_PLANTS_LAZY_LOADING,
      variables,
    }).valueChanges;
  }

  geVariablesLazyLoadingDataGql$(variables: any): Observable<any> {
    return this._apollo.watchQuery({
      query: GET_VARIABLES_LAZY_LOADING,
      variables,
    }).valueChanges;
  }

  getMoldDataGql$(parameters: any): Observable<any> {

    const moldId = { moldId: parameters.moldId };

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

    const variableId = { variableId: parameters.variableId };

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    const variablesForAttachments = {
      processId: parameters.variableId,
      process: parameters.process,
      customerId: parameters.customerId,
    }

    return combineLatest([
      this._apollo.query({
        query: GET_VARIABLE,
        variables: variableId,
      }),

      this._apollo.query({
        query: GET_VARIABLE_TRANSLATIONS,
        variables,
      }),

      this._apollo.query({
        query: GET_ALL_ATTACHMENTS,
        variables: variablesForAttachments,
      }),

    ]);
  }

  getChecklistTemplateDataGql$(parameters: any): Observable<any> {

    const checklistTemplateId = { checklistTemplateId: parameters.checklistTemplateId };

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    const variablesForAttachments = {
      processId: parameters.checklistTemplateId,
      process: parameters.process,
      customerId: parameters.customerId,
    }

    const variablesForLines = {
      order: parameters.orderForDetails,
      ...(parameters.filter) && { filterBy: parameters.filter },      
    }

    return combineLatest([
      this._apollo.query({
        query: GET_CHECKLIST_TEMPLATE,
        variables: checklistTemplateId,
      }),

      this._apollo.query({
        query: GET_CHECKLIST_TEMPLATE_TRANSLATIONS,
        variables,
      }),

      this._apollo.query({
        query: GET_ALL_ATTACHMENTS,
        variables: variablesForAttachments,
      }),

      this._apollo.query({
        query: GET_CHECKLIST_TEMPLATE_DETAILS,
        variables: variablesForLines,
      }),

    ]);
  }

  getAttachmentsDataGql$(parameters: any): Observable<any> {
    const variablesForAttachments = {
      processId: parameters.processId,
      process: parameters.process,
      customerId: parameters.customerId,
    }

    return this._apollo.query({
      query: GET_ALL_ATTACHMENTS,
      variables: variablesForAttachments,
    })
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

  updateChecklistTemplateStatus$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: INACTIVATE_CHECKLIST_TMEPLATE,
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
      mutation: UPSERT_MOLD,
      variables,
    })
  }

  updateVariableCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_VARIABLE,
      variables,
    })
  }

  updateChecklistTemplateCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_CHECKLIST_TEMPLATE,
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

  deleteChecklistTemplateTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_CHECKLIST_TEMPLATE_TRANSLATIONS,
      variables,
    });
  }

  deleteChecklistTemplateDetails$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_CHECKLIST_TEMPLATE_DETAILS,
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

  addMoldTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_MOLD_TRANSLATIONS,
      variables,
    });
  }

  addOrUpdateCatalogDetails$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_CATALOG_DETAILS,
      variables,
    });
  }

  addVariableTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_VARIABLE_TRANSLATIONS,
      variables,
    });
  }

  updateChecklistTemplateTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_CHECKLIST_TEMPLATE_TRANSLATIONS,
      variables,
    });
  }

  updateChecklistTemplatLines$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_CHECKLIST_TEMPLATE_DETAILS,
      variables,
    });
  }

  addMoldMaintenanceHistory$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_MAINTENANCE_HISTORY,
      variables,
    });
  }

  mapOneMold(paramsData: any): MoldDetail {
    const { oneMold } = paramsData?.moldGqlData?.data;
    const { data } = oneMold;
    const translations = paramsData?.moldGqlTranslationsData?.data;
    // const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;
    return {
      ...data,
      mainImage,
      provider: this.mapDetailGeneralData(oneMold.translatedProvider, data.provider),
      manufacturer: this.mapDetailGeneralData(oneMold.translatedManufacturer, data.manufacturer),
      line: this.mapDetailGeneralData(oneMold.translatedLine, data.line),
      equipment: this.mapDetailGeneralData(oneMold.translatedEquipment, data.equipment),
      partNumber: this.mapDetailGeneralData(oneMold.translatedPartNumber, data.partNumber),
      notifyYellowRecipient: this.mapDetailGeneralData(oneMold.translatedNotifyYellowRecipient, data.notifyYellowRecipient),
      notifyRedRecipient: this.mapDetailGeneralData(oneMold.translatedNotifyRedRecipient, data.notifyRedRecipient),      
      moldType: this.mapDetailGeneralData(oneMold.translatedMoldType, data.moldType),
      moldClass: this.mapDetailGeneralData(oneMold.translatedMoldClass, data.moldClass),
      translations: this.mapTranslations(translations),
    }
  }

  mapOneVariable(paramsData: any): VariableDetail {
    const { oneVariable } = paramsData?.variableGqlData?.data;
    const { data } = oneVariable;

    const translations = paramsData?.variableGqlTranslationsData?.data;
    const attachments = paramsData?.variableGqlAttachments?.data?.uploadedFiles;
    // const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;
    return {
      ...data,
      friendlyValueType: oneVariable.friendlyValueType,
      mainImage,
      uom: this.mapDetailTranslationsData(data.uom),
      recipient: this.mapDetailTranslationsData(data.recipient),
      sigmaType: this.mapDetailTranslationsData(data.sigmaType),
      translations: this.mapTranslations(translations),
      attachments: this.mapAttachments(attachments?.items),
    }
  }

  mapOneChecklistTemplate(paramsData: any): ChecklistTemplateDetail {
    const { oneChecklistTemplate } = paramsData?.checklistTemplateGqlData?.data;
    const { data } = oneChecklistTemplate;

    const translations = paramsData?.checklistTemplateGqlTranslationsData?.data;
    const attachments = paramsData?.checklistTemplateGqlAttachments?.data?.uploadedFiles;
    const lines = paramsData?.checklistTemplateGqlLines?.data?.checklistTemplateDetailsUnlimited;
    // const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    // const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;
    return {
      ...data,
      mainImage,
      templateType: this.mapDetailTranslationsData(data.templateType),
      alarmRecipient: this.mapDetailTranslationsData(data.alarmRecipient),
      anticipationRecipient: this.mapDetailTranslationsData(data.anticipationRecipient),
      approvalRecipient: this.mapDetailTranslationsData(data.approvalRecipient),
      expiringRecipient: this.mapDetailTranslationsData(data.expiringRecipient),
      generationRecipient: this.mapDetailTranslationsData(data.generationRecipient),
      approver: this.mapApproverData(data.approver),
      translations: this.mapTranslations(translations),
      attachments: this.mapAttachments(attachments?.items),
      lines: this.mapChecklistTemplatesDetails(lines),
    }
  }

  mapChecklistTemplatesDetails(data: any): ChecklistTemplateLine[] {
    let order = 0;
    return data.map(line => {

      let name = '';
      if (line.variable) {
        name = line.variable.name;
        if (line.variable.translations?.length > 0 && line.variable?.translations.find((t) => t.languageId === 1)) { // TODO: tomar el lenguaje del profile
          name = line.variable.translations.find((t) => t.languageId === 1).name;
        }
      }      
      
      return {
        order: order++,
        name,        
        id: line.id,        
        checklistTemplateId: line.checklistTemplateId,
        uomName: line.variable?.uom?.['translatedName'] ?? line.variable?.uom?.name,
        valueType: line.variable?.valueType,
        uomPrefix: line.variable?.uom?.['translatedPrefix'] ?? line.variable?.uom?.prefix,
        variable: this.mapDetailTranslationsData(line.variable),
        variableId: line.variableId,
        line: line.line,                    
        customerId: line.customerId, // TODO: Get from profile
        status: line.status,            
        possibleValues: line.possibleValues,
        recipient: this.mapDetailTranslationsData(line.recipient),
        recipientId: line.recipientId,
        required: line.required,
        allowComments: line.allowComments,
        allowNoCapture: line.allowNoCapture,
        allowAlarm: line.allowAlarm,
        showChart: line.showChart,
        showParameters: line.showParameters,
        showLastValue: line.showLastValue,
        notifyAlarm: line.notifyAlarm,
        useVariableAttachments: line.useVariableAttachments,
        notes: line.notes,
        byDefault: line.byDefault,
        showNotes: line.showNotes,
        minimum: line.minimum,
        maximum: line.maximum,           
      }
    });
  }

  mapAttachments(data: any): Attachment[] {
    if (!data) return [];
    let line = 0;
    return data?.map(t => {
      return {
        index: line++,
        name: t.fileName,
        image: `${environment.serverUrl}/files/${t.path}`,
        id: t.fileId,
        icon: this.setIconName(t.fileType),
      }
    });
  }

  setIconName(fileType: string): string {
    if (fileType.toLowerCase().indexOf('image') > -1) {
      return 'field_image'
    } else if (fileType.toLowerCase().indexOf('pdf') > -1) {
      return 'file_format_pdf'
    } else if (fileType.toLowerCase().indexOf('video') > -1) {
      return 'youtube2'
    }
    return 'faq';
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
        approvalRequestMessageSubject: t.approvalRequestMessageSubject,
        approvalRequestMessageBody: t.approvalRequestMessageBody,
        anticipationMessageSubject: t.anticipationMessageSubject,
        anticipationMessageBody: t.anticipationMessageBody,
        expiringMessageSubject: t.expiringMessageSubject,
        expiringMessageBody: t.expiringMessageBody,
        generationMessageSubject: t.generationMessageSubject,
        generationMessageBody: t.generationMessageBody,
        alarmNotificationMessageSubject: t.alarmNotificationMessageSubject,
        alarmNotificationMessageBody: t.alarmNotificationMessageBody,
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

  mapApproverData(internalObjectData: any): GeneralCatalogMappedItem {
    if (!internalObjectData) return null;
    return {
      id: internalObjectData.id,
      status: internalObjectData.status,
      translatedName: internalObjectData.name,
      translatedReference: internalObjectData.reference,
      translatedNotes: '',
      translatedPrefix: '',
      translatedDescription: internalObjectData.name,
      isTranslated: true,
    }
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
  
  getCustomersDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addCustomerTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_CUSTOMER_TRANSLATIONS,
      variables,
    });
  }

  getCustomerDataGql$(parameters: any): Observable<any> {
    const customerId = { customerId: parameters.customerId };

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
      mutation: UPSERT_CUSTOMER,
      variables,
    })
  }

  mapOneCustomer(paramsData: any): CustomerDetail {
    const { oneCustomer } = paramsData?.customerGqlData?.data;
    const { data } = oneCustomer;
    const translations = paramsData?.customerGqlTranslationsData?.data;
    // const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

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

  getManufacturersDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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



  addManufacturerTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_MANUFACTURER_TRANSLATIONS,
      variables,
    });
  }

  getManufacturerDataGql$(parameters: any): Observable<any> {
    const manufacturerId = { manufacturerId: parameters.manufacturerId };

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
      mutation: UPSERT_MANUFACTURER,
      variables,
    })
  }

  mapOneManufacturer(paramsData: any): CustomerDetail {
    const { oneManufacturer } = paramsData?.manufacturerGqlData?.data;
    const { data } = oneManufacturer;
    const translations = paramsData?.manufacturerGqlTranslationsData?.data;
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

    return {
      ...data,
      mainImage,
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

  getPlantsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addPlantTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_PLANT_TRANSLATIONS,
      variables,
    });
  }

  getPlantDataGql$(parameters: any): Observable<any> {
    const plantId = { plantId: parameters.plantId };

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
      mutation: UPSERT_PLANT,
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


  getCompaniesDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addCompanyTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_COMPANY_TRANSLATIONS,
      variables,
    });
  }

  getCompanyDataGql$(parameters: any): Observable<any> {
    const companyId = { companyId: parameters.companyId };

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
      mutation: UPSERT_COMPANY,
      variables,
    })
  }

  mapOneCompany(paramsData: any): CompanyDetail {
    const { oneCompany } = paramsData?.companyGqlData?.data;
    const { data } = oneCompany;
    const translations = paramsData?.companyGqlTranslationsData?.data;
    // const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

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

  getProvidersDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addProviderTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_PROVIDER_TRANSLATIONS,
      variables,
    });
  }

  getProviderDataGql$(parameters: any): Observable<any> {
    const providerId = { providerId: parameters.providerId };

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
      mutation: UPSERT_PROVIDER,
      variables,
    })
  }

  mapOneProvider(paramsData: any): CompanyDetail {
    const { oneProvider } = paramsData?.providerGqlData?.data;
    const { data } = oneProvider;
    const translations = paramsData?.providerGqlTranslationsData?.data;
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

    return {
      ...data,
      mainImage,
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


  getEquipmentsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addEquipmentTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_EQUIPMENT_TRANSLATIONS,
      variables,
    });
  }

  getEquipmentDataGql$(parameters: any): Observable<any> {
    const equipmentId = { equipmentId: parameters.equipmentId };

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
      mutation: UPSERT_EQUIPMENT,
      variables,
    })
  }

  mapOneEquipment(paramsData: any): EquipmentDetail {
    const { oneEquipment } = paramsData?.equipmentGqlData?.data;
    const { data } = oneEquipment;
    const translations = paramsData?.equipmentGqlTranslationsData?.data;
    // const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

    return {
      ...data,
      mainImage,
      translations: this.mapTranslations(translations),
      plant: this.mapDetailTranslationsData(data.plant),
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

  getDepartmentsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addDepartmentTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_DEPARTMENT_TRANSLATIONS,
      variables,
    });
  }

  getDepartmentDataGql$(parameters: any): Observable<any> {
    const departmentId = { departmentId: parameters.departmentId };

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
      mutation: UPSERT_DEPARTMENT,
      variables,
    })
  }

  mapOneDepartment(paramsData: any): DepartmentDetail {
    const { oneDepartment } = paramsData?.departmentGqlData?.data;
    const { data } = oneDepartment;
    const translations = paramsData?.departmentGqlTranslationsData?.data;
    // const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

    return {
      ...data,
      mainImage,
      translations: this.mapTranslations(translations),
      recipient: this.mapDetailTranslationsData(data.recipient),
      plant: this.mapDetailTranslationsData(data.plant),
      approver: this.mapApproverData(data.approver),
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

  saveAttachments$(process: originProcess, processId: number, files: string[]): Observable<any> {
    if (files.length > 0) {
      return this._apollo.mutate({
        mutation: SAVE_ATTACHMENTS,
        variables: {
          process,
          processId,
          files,
        },
      });
    } else {
      return of([]);
    }
  }

  duplicateAttachmentsList$(process: originProcess, files: string[]): Observable<any> {
    if (files.length > 0) {
      return this._apollo.mutate({
        mutation: DUPLICATE_ATTACHMENTS,
        variables: {
          process,
          files,
        },
      });
    } else {
      return of([]);
    }
  }

  //======uoms

  getUomsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addUomTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_UOM_TRANSLATIONS,
      variables,
    });
  }

  getUomDataGql$(parameters: any): Observable<any> {
    const departmentId = { departmentId: parameters.departmentId };

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
      mutation: UPSERT_UOM,
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

  getPositionsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addPositionTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_POSITION_TRANSLATIONS,
      variables,
    });
  }

  getPositionDataGql$(parameters: any): Observable<any> {
    const positionId = { positionId: parameters.positionId };

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
      mutation: UPSERT_POSITION,
      variables,
    })
  }

  mapOnePosition(paramsData: any): PositionDetail {
    const { onePosition } = paramsData?.positionGqlData?.data;
    const { data } = onePosition;
    const translations = paramsData?.positionGqlTranslationsData?.data;
    const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

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

  getPartNumbersDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
    const variables = {
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }

    return this._apollo.watchQuery({
      query: GET_PART_NUMBERS,
      variables
    }).valueChanges
  }

  addPartNumberTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_PART_NUMBER_TRANSLATIONS,
      variables,
    });
  }

  getPartNumberDataGql$(parameters: any): Observable<any> {
    const partNumberId = { partNumberId: parameters.partNumberId };

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([
      this._apollo.query({
        query: GET_PART_NUMBER,
        variables: partNumberId,
      }),

      this._apollo.query({
        query: GET_PART_NUMBER_TRANSLATIONS,
        variables,
      })
    ]);
  }

  updatePartNumberCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_PART_NUMBER,
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
      mutation: DELETE_PART_NUMBER_TRANSLATIONS,
      variables,
    });
  }

  updatePartNumberStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD,
      variables,
    });
  }


  //======lines


  getLinesDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
    const variables = {
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }

    return this._apollo.watchQuery({
      query: GET_LINES,  //WARNING 
      variables
    }).valueChanges
  }

  addLineTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_LINE_TRANSLATIONS,
      variables,
    });
  }

  getLineDataGql$(parameters: any): Observable<any> {
    const lineId = { lineId: parameters.lineId };

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([
      this._apollo.query({
        query: GET_LINE,
        variables: lineId,
      }),

      this._apollo.query({
        query: GET_LINE_TRANSLATIONS,
        variables,
      })
    ]);
  }

  updateLineCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_LINE,
      variables,
    })
  }

  mapOneLine(paramsData: any): LineDetail {
    const { oneLine } = paramsData?.lineGqlData?.data;
    const { data } = oneLine;
    const translations = paramsData?.lineGqlTranslationsData?.data;
    const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

    return {
      ...data,
      mainImage,
      translations: this.mapTranslations(translations),
    }
  }

  deleteLineTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_LINE_TRANSLATIONS,
      variables,
    });
  }

updateLineStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
  return this._apollo.mutate({
    mutation: INACTIVATE_LINE, 
    variables,       
  });
}

  

  
  //======generics

  getGenericsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any>{
    const variables = {      
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }
    
    return this._apollo.watchQuery({ 
      query: GET_GENERICS,
      variables
    }).valueChanges    
  }
  
  addGenericTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_GENERIC_TRANSLATIONS, 
      variables,       
    });
  } 
  
  getGenericDataGql$(parameters: any): Observable<any> {
    const genericId = { genericId: parameters.genericId};

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([ 
      this._apollo.query({ 
      query: GET_GENERIC, 
      variables: genericId,      
      }),
      
      this._apollo.query({ 
        query: GET_GENERIC_TRANSLATIONS, 
        variables, 
      })
    ]);
  }

  updateGenericCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_GENERIC, 
      variables,      
    })
  }
  
  mapOneGeneric(paramsData: any): CompanyDetail {
    const { oneGeneric } = paramsData?.genericGqlData?.data;
    const { data } = oneGeneric;
    const translations = paramsData?.genericGqlTranslationsData?.data;
    
    
    return {
      ...data,
      translations: this.mapTranslations(translations),
    }
  }

  deleteGenericTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_GENERIC_TRANSLATIONS, 
      variables,       
    });
  }

  updateGenericStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_MOLD, 
      variables,       
    });
  }

  



  //======workgroups

  getWorkgroupsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
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

  addWorkgroupTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_DEPARTMENT_TRANSLATIONS,
      variables,
    });
  }

  getWorkgroupDataGql$(parameters: any): Observable<any> {
    const workgroupId = { workgroupId: parameters.workgroupId };

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([
      this._apollo.query({
        query: GET_DEPARTMENT,
        variables: workgroupId,
      }),

      this._apollo.query({
        query: GET_DEPARTMENT_TRANSLATIONS,
        variables,
      })
    ]);
  }

  updateWorkgroupCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_WORKGROUP,
      variables,
    })
  }

  mapOneWorkgroup(paramsData: any): WorkgroupDetail {
    const { oneWorkgroup } = paramsData?.workgroupGqlData?.data;
    const { data } = oneWorkgroup;
    const translations = paramsData?.workgroupGqlTranslationsData?.data;
    const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;

    return {
      ...data,
      mainImage,
      translations: this.mapTranslations(translations),
    }
  }

  deleteWorkgroupTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_DEPARTMENT_TRANSLATIONS,
      variables,
    });
  }

  updateWorkgroupStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_DEPARTMENT,
      variables,
    });
  }

  

  getShiftsDataGql$(recordsToSkip: number = 0, recordsToTake: number = 50, orderBy: any = null, filterBy: any = null): Observable<any> {
    const variables = {
      ...(recordsToSkip !== 0) && { recordsToSkip },
      ...(recordsToTake !== 0) && { recordsToTake },
      ...(orderBy) && { orderBy },
      ...(filterBy) && { filterBy },
    }

    return this._apollo.watchQuery({
      query: GET_SHIFTS,  //WARNING 
      variables
    }).valueChanges
  }

  addShiftTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_SHIFT_TRANSLATIONS,
      variables,
    });
  }

  getShiftDataGql$(parameters: any): Observable<any> {
    const shiftId = { shiftId: parameters.shiftId };

    const variables = {
      ...(parameters.skipRecords !== 0) && { recordsToSkip: parameters.skipRecords },
      ...(parameters.takeRecords !== 0) && { recordsToTake: parameters.takeRecords },
      ...(parameters.order) && { orderBy: parameters.order },
      ...(parameters.filter) && { filterBy: parameters.filter },
    }

    return combineLatest([
      this._apollo.query({
        query: GET_SHIFT,
        variables: shiftId,
      }),

      this._apollo.query({
        query: GET_SHIFT_TRANSLATIONS,
        variables,
      })
    ]);
  }

  updateShiftCatalog$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: UPSERT_SHIFT,
      variables,
    })
  }

  mapOneShift(paramsData: any): ShiftDetail {
    const { oneShift } = paramsData?.shiftGqlData?.data;
    const { data } = oneShift;
    const translations = paramsData?.shiftGqlTranslationsData?.data;
 

    return {
      ...data,
    
      translations: this.mapTranslations(translations),
    }
  }

  deleteShiftTranslations$(variables: any): Observable<any> {
    return this._apollo.mutate({
      mutation: DELETE_SHIFT_TRANSLATIONS,
      variables,
    });
  }

  updateShiftStatus$(variables: any): Observable<any> { //warning missing in customer and repeated here
    return this._apollo.mutate({
      mutation: INACTIVATE_SHIFT,
      variables,
    });
  }

  getAllCsvData$(fileName: string): Observable<any> {
    return this._http.get(`${environment.serverUrl}/api/file/download?fileName=${fileName}`, { responseType: 'text' }).pipe(
      map(data => data)
    );
  }

  getAllToCsv$(): Observable<any> {
    return this._apollo.watchQuery({
      query: GET_ALL_MOLDS_TO_CSV,
    }).valueChanges;
  }

  updateCheklistTemplateLineData(line: number, data: ChecklistTemplateLine) {
    this.checkListTemplateLineDataChangedBehaviorSubject.next({ line, data });
  }

  duplicateMainImage$(process: originProcess, mainImageGuid: string): Observable<any> {
    if (!mainImageGuid) return of({
      duplicated: false,            
    });
    
    const files = [mainImageGuid];
    return this.duplicateAttachmentsList$(process, files)
    .pipe(
      map((newAttachments) => {
        if (newAttachments.data.duplicateAttachments.length === 0) {
          const message = $localize`No se pudo duplicar la imagen...`;
          this._sharedService.showSnackMessage({
            message,
            snackClass: 'snack-warn',
            progressBarColor: 'warn',
            icon: 'delete',
          });
          return {
            duplicated: false,            
          }
        } else {
          return {
            duplicated: true,            
            mainImageGuid: newAttachments?.data?.duplicateAttachments[0]?.fileId,
            mainImageName: newAttachments?.data?.duplicateAttachments[0]?.fileName,
            mainImagePath: newAttachments?.data?.duplicateAttachments[0]?.path,
          }
        }        
      })
    );


  }

  //................................................................
  
  // End ======================  
}
