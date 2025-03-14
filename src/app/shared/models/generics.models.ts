import { Attachment, PageInfo } from "./helpers.models";
import { GeneralCatalogInternalData } from "./profile.models";

export interface GeneralTranslation {
    languageId?: number;
    languageName?: string;
    languageIso?: string;
    updatedByUserName?: string;
    updatedAt?: string;
    description?: string;
    name?: string;
    reference?: string;
    notes?: string;
    status?: string;
  }

export interface MoldLastMaintenance {
    maintenanceDate?: string;
    state?: string;
    operatorName?: string;
    startDate?: string;
    finishedDate?: string;
    status?: string;
    provider?: GeneralCatalogMappedItem;
  }
  
export interface MoldLastResetting {
    resettingDate?: string;
    user?: GeneralCatalogMappedItem; //TODO Elvis
    userId?: number;
  }
    
export interface GeneralCatalogMappedItem {  
    id?: number;
    status?: string;
    valueRight?: number;
    selected?: boolean;
    isTranslated?: boolean;
    translatedName?: string;
    translatedDescription?: string;
    translatedReference?: string;  
    translatedNotes?: string;  
    translatedPrefix?: string;
    sortedField?: string;
    catalogDetailId?:  number;
    originalValueRight?: number | null;
  }

  export interface GeneralMultipleSelcetionItems {    
    id?: number;
    valueRight?: number | null;    
    originalValueRight?: number | null;
    catalogDetailId?:  number;
    status?: string;
    selected?: boolean;
    isTranslated?: boolean;
    translatedName?: string;
    translatedDescription?: string;
    translatedReference?: string;  
    translatedNotes?: string;  
    translatedPrefix?: string;
    sortedField?: string;    
  }
  
export interface MoldDetail {
    serialNumber?: string;
    description?: string;
    prefix?: string;
    notes?: string;
    reference?: string;
    generationMode?: string;
    entities?: string;  
    manufacturerId?: number;
    providerId?: number;
    manufacturingDate?: string;
    startingDate?: any;
    moldLastMaintenanceId?: any;
    hits?: number;
    previousHits?: number;
    lastHit?: string;
    lastResettingId?: any;
    thresholdType?: string;
    thresholdYellow?: number;
    thresholdRed?: number;
    thresholdState?: string;
    thresholdDateYellow?: number;
    thresholdDateRed?: number;
    receiverId?: number;
    label?: string;
    state?: string;
    nextMaintenance?: string;
    equipmentId?: number;
    lineId?: number;
    partNumberId?: number;
    position?: number;
    mainImageGuid?: string;
    mainImagePath?: string;
    mainImageName?: string;
    mainImage?: string;
    strategy?: string;
    lastLocationId?: any;
    thresholdYellowDateReached?: any;
    thresholdRedDateReached?: any;
    id?: number;
    customerId?: number;
    status?: string;
    createdById?: any;
    createdAt?: string;
    updatedById?: any;
    updatedAt?: string;
    deletedById?: any;
    deletedAt?: any;
    deletedBy?: any;
    updatedBy?: any;
    createdBy?: any;
    lastLocation?: any;
    lastResetting?: MoldLastResetting;
    lastMaintenance?: MoldLastMaintenance;
    manufacturer?: GeneralCatalogMappedItem;
    provider?: GeneralCatalogMappedItem;
    partNumber?: GeneralCatalogMappedItem;
    moldType?: GeneralCatalogMappedItem;
    moldClass?: GeneralCatalogMappedItem;
    line?: GeneralCatalogMappedItem;
    equipment?: GeneralCatalogMappedItem;
    notifyRedRecipient?: GeneralCatalogMappedItem;
    notifyYellowRecipient?: GeneralCatalogMappedItem;
    translations?: GeneralTranslation[];
    templatesYellow?: string;
    templatesRed?: string;
    notifyYellowRecipientId?: string;
    notifyRedRecipientId?: string;
    notifyYellowState?: string;
    notifyRedState?: string;
    notifyRedChannels?: string;
    notifyRedSubject?: string;
    notifyRedBody?: string;
    notifyYellowChannels?: string;
    notifyYellowSubject?: string;
    notifyYellowBody?: string;
  }
  
  export interface GeneralTranslatedFields {
    isTranslated?: boolean;
    translatedName?: string;
    translatedReference: string;
    translateddescription?: string;
    translatedNotes?: string;
    translatedPrefix?: string;
  }
  
  export interface GqlParameters {
    settingType: string,
    skipRecords?: number,
    takeRecords?: number,
    filter?: any,
    order?: any,
    id?: number,
    customerId?: number,
    status?: string,
    process?: string,
    processId?: number,
    companyId?: number,
    initialized?: string;
    executeNow?: string;
  }
  
  export interface MoldItem {
    friendlyStatus?: string;
    friendlyState?: string;
    friendlyThresholdState?: string;
    friendlyThresholdType?: string;
    friendlyStrategy?: string;
    friendlyLabel?: string;
    isTranslated?: boolean;
    translatedReference: string;
    translateddescription?: string;
    translatedNotes?: string;
    translatedPartNumber?: GeneralTranslatedFields;
    translatedLine?: GeneralTranslatedFields;
    translatedEquipment?: GeneralTranslatedFields;
    translatedLastMaintenance?: GeneralTranslatedFields;
    translatedManufacturer?: GeneralTranslatedFields;
    translatedLastResetting?: GeneralTranslatedFields;
    translatedProvider?: GeneralTranslatedFields;
    translatedLocation?: GeneralTranslatedFields;
    translatedMoldType?: GeneralTranslatedFields;
    translatedMoldClass?: GeneralTranslatedFields;
    data: MoldDetail;
  }
  
  export const emptyMoldItem: MoldDetail = {
    serialNumber: null,
    description: null,
    prefix: null,
    notes: null,
    reference: null,
    manufacturerId: null,
    providerId: null,
    manufacturingDate: null,
    startingDate: null,
    moldLastMaintenanceId: null,
    hits: null,
    previousHits: null,
    lastHit: null,
    lastResettingId: null,
    thresholdType: null,
    thresholdYellow: null,
    thresholdRed: null,
    thresholdState: null,
    thresholdDateYellow: null,
    thresholdDateRed: null,
    receiverId: null,
    label: null,
    state: null,
    nextMaintenance: null,
    equipmentId: null,
    lineId: null,
    partNumberId: null,
    position: null,
    mainImagePath: null,
    mainImageName: null,
    mainImage: null,
    strategy: null,
    lastLocationId: null,
    thresholdYellowDateReached: null,
    thresholdRedDateReached: null,
    notifyRedRecipient: null,
    notifyYellowRecipient: null,
    notifyRedRecipientId: null,
    notifyYellowRecipientId: null,
    id: null,
    customerId: null,
    status: null,
    createdById: null,
    createdAt: null,
    updatedById: null,
    updatedAt: null,
    deletedById: null,
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    createdBy: null,
    lastLocation: null,
    lastResetting: null,
    lastMaintenance: null,
    manufacturer: null,
    templatesRed: '',
    templatesYellow: '',    
    translations: [],
    notifyYellowState: '',
    notifyRedState: '',
    notifyRedChannels: '',
    notifyRedSubject: '',
    notifyRedBody: '',
    notifyYellowChannels: '',
    notifyYellowSubject: '',
    notifyYellowBody: '',
    generationMode: null,
    entities: null,  
  };
  
  export const emptyMoldCatalog = {
    friendlyState: null,
    friendlyStatus: null,
    data: {
      id: null,
      description: null,
      mainImagePath: null,
      serialNumber: null,
      label: null,
      state: null,
      status: null,
      updatedAt: null,
    },
  };
  
  export interface MoldsData {
    moldsPaginated?: Molds;
  }
  
  export interface Molds {
    items?: MoldItem[];
    pageInfo?: PageInfo;
    totalCount?: number;
  }

  export interface GeneralCatalogPageInfo {
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  }
  
  export interface GeneralHardcodedValuesItem {
    id?: number;
    languageId?: number;
    mainImagePath?: string;
    friendlyText?: string;
    used?: boolean;
    value: string;
    disabled: boolean;
    status?: string;
    selected?: boolean;
  }
 
  export interface GeneralHardcodedValuesData {
    loading?: boolean;
    totalCount?: number;
    currentPage?: number;
    pageInfo?: GeneralCatalogPageInfo;
    items?: GeneralHardcodedValuesItem[];
    cadRight?: string;
  }

  export const emptyGeneralHardcodedValuesData: GeneralHardcodedValuesData = {
    loading: false,
    totalCount: 0,
    currentPage: 0,
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
    items: [],
    cadRight: '',
  }

  export interface GeneralCatalogParams {
    catalogName?: string;
    textToSearch?: string;
    initArray?: boolean;
  }

  export const yesNoNaByDefaultValue: GeneralHardcodedValuesItem[] = [
   { friendlyText: $localize`Sin valor por defecto`, disabled: false, value: '-'},
   { friendlyText: $localize`Valor Sí`, disabled: false, value: 'y'},
   { friendlyText: $localize`Valor No`, disabled: false, value: 'n'},
   { friendlyText: $localize`Valor No Aplica`, disabled: false, value: 'n/a'},
  ]

  export const yesNoByDefaultValue: GeneralHardcodedValuesItem[] = [
    { friendlyText: $localize`Sin valor por defecto`, disabled: false, value: '-'},
    { friendlyText: $localize`Valor Sí`, disabled: false, value: 'y'},
    { friendlyText: $localize`Valor No`, disabled: false, value: 'n'},    
   ]

   export interface ChecklistTemplatePossibleValue {
    order?: number;
    value?: string;
    byDefault?: boolean;
    alarmedValue?: boolean;  
  }
  
  export interface VariableDetail {
    name?: string;
    reference?: string;
    notes?: string;
    prefix?: string;
    valueToAlarm?: string;
    mainImageGuid?: string;
    mainImagePath?: string;
    mainImageName?: string;
    mainImage?: string;
    id?: number;
    customerId?: number;
    uom?: GeneralCatalogInternalData,
    uomName?: string;
    uomPrefix?: string;
    recipient?: GeneralCatalogInternalData,
    sigmaType?: GeneralCatalogInternalData,
    valueType?: string,
    status?: string;
    showNotes?: string;
    translations?: GeneralTranslation[];
    attachments?: Attachment[];
    required?: string;
    allowNoCapture?: string;
    allowComments?: string;
    showChart?: string;
    allowAlarm?: string;
    notifyAlarm?: string;
    accumulative?: string;  
    automaticActionPlan?: string;  
    actionPlansToGenerate?: string;  
    possibleValues?: string;  
  
    byDefault?: string; 
    byDefaultDateType?: string; 
    
    resetValueMode?: string; 
    valuesList?: ChecklistTemplatePossibleValue[]; 
    minimum?: string; 
    maximum?: string; 
    createdById?: any;
    createdAt?: string;
    updatedById?: any;
    updatedAt?: string;
    deletedById?: any;
    deletedAt?: any;
    deletedBy?: any;
    updatedBy?: any;
    createdBy?: any;  
    friendlyValueType?: string;
    uomId?: number;
    recipientId?: number;
    translatedNotes?: string;
  }

  export interface ChecklistLine {
    checklistTemplateDetailId?: number;
    buttons?: LineButton[];
    data?: any;
    id?: number;
    customerId?: number;
    line?: number;
    order?: number;
    loading?: boolean;
    enabled?: boolean;
    error?: boolean;
    validate?: boolean;
    variableId?: number;
    recipientId?: number;
    alarmed?: boolean;
    reset?: boolean;
    name?: string;
    notes?: string;
    minimum?: string;
    maximum?: string;
    valueToAlarm?: string;
    required?: boolean;
    byDefault?: string;
    allowNoCapture?: string;
    allowComments?: string;
    possibleValues?: string;
    possibleValue?: string;
    byDefaultDateType?: string;
    valueType?: string;
    sensorId?: number;
    uomId?: number;
    uomName?: string;  
    uomPrefix?: string;
    showChart?: string;
    useVariableAttachments?: string;
    showLastValue?: string;
    lastAnswer?: string;
    answeredDate?: string;
    answersCount?: number;
    alarmsCount?: number;
    showParameters?: string;
    useVariableSettings?: string;
    lastValueRecorded?: string;
    lastValueDate?: string;
    showNotes?: string;
    allowAlarm?: string;
    notifyAlarm?: string;  
    recipient?: GeneralCatalogInternalData,  
    status?: string;
    state?: string;
    uom?: GeneralCatalogInternalData,
    attachments?: Attachment[];
    attachmentsList?: string;
    valuesList?: ChecklistTemplatePossibleValue[];
    friendlyVariableValueType?: string;
    variableAttachments?: Attachment[];
    variable?: VariableDetail;
    value?: string;
    text?: string;
    icon?: string;
    actionRequired?: boolean;
    attachmentRequired?: boolean;
    attachmentCompleted?: boolean;
    lastValue?: string;
    lastValueUser?: string;
    lastValueAlarmed?: string;
    lastChecklistId?: string;
    comments?: ChecklistLineComment[];
    chartData?: [];
  }

  export interface ChecklistLineComment {
    checklistLineId?: number;
    id?: number;
    comment?: string;
    commentDate?: string;    
    commentedBy?: string;    
    commentedById?: number;    
}
  
  export interface LineButton {
    disabled: boolean,
    type: string;
    icon: string;
    tooltip: string;
    action: string;
    alarmed: boolean;
  }
  