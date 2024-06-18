import { PageInfo } from "./helpers.models";

export interface GeneralTranslation {
    languageId: number;
    languageName: string;
    languageIso: string;
    updatedByUserName: string;
    updatedAt: string;
    description: string;
    name: string;
    reference: string;
    notes: string;
    status: string;
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
  }

  export interface GeneralMultipleSelcetionItems {    
    id?: number;
    valueRight?: number | null;    
    originalValueRight?: number | null;
    catalogDetailId?:  number;
  }
  
export interface MoldDetail {
    serialNumber?: string;
    description?: string;
    prefix?: string;
    notes?: string;
    reference?: string;
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
    translations?: GeneralTranslation[];
    templatesYellow?: string;
    templatesRed?: string;
  }
  
  export interface GeneralTranslatedFields {
    isTranslated?: boolean;
    translatedName?: string;
    translatedReference: string;
    translateddescription?: string;
    translatedNotes?: string;
    translatedPrefix?: string;
  }
  
  export interface GeneralCatalogTranslation {
    id?: number;
    customerId?: number;
    isTranslated?: boolean;
    languageId?: number;
    name?: string;
    reference: string;
    description?: string;
    notes?: string;
    prefix?: string;
    status?: string;
  }

  export interface GeneralCatalogInternalData {  
    id?: number;
    customerId?: number,
    name?: string;
    description?: string;
    reference?: string;
    notes?: string;
    prefix?: string;
    status?: string;
    translations: GeneralCatalogTranslation[];
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
