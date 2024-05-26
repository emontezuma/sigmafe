export enum CatalogsMolds {
  YES_NO = 'yesNo',
  YES_NO_NA = 'yesNoNa',
  SELECT = 'select',
  MULTI_SELECT = 'multiSelect',
  FREE_FORM = 'freeForm',
}

export interface GeneralCatalogData {
  loading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageInfo?: GeneralCatalogPageInfo;
  // items?: GeneralCatalogItem[];
  items?: GeneralCatalogMappedItem[];
  cadRight?: string;  
}

export interface GeneralCatalogTranslationsData {
  loading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageInfo?: GeneralCatalogPageInfo;
  // items?: GeneralCatalogItem[];
  items?: GeneralCatalogMappedItem[];
  cadRight?: string;
}

export interface MaintenanceHistoricalData {
  loading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageInfo?: GeneralCatalogPageInfo;
  items?: MaintenanceHistoricalDataItem[];
  cadRight?: string;
}

export interface GeneralHardcodedValuesData {
  loading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageInfo?: GeneralCatalogPageInfo;
  items?: GeneralHardcodedValuesItem[];
  cadRight?: string;
}

export interface GeneralCatalogPageInfo {
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface GeneralCatalogItem {  
  data?: GeneralCatalogInternalData;
  translatedName?: string;
  translatedReference?: string;
  translatedDescription?: string;
  translatedPrefix: string;
  translatedNotes?: string;
  isTranslated?: boolean;
  translations?: GeneralCatalogTranslations[];
}

export interface GeneralCatalogMappedItem {  
  id?: number;
  status?: string;
  isTranslated?: boolean;
  translatedName?: string;
  translatedDescription?: string;
  translatedReference?: string;  
  translatedNotes?: string;  
  translatedPrefix?: string;  
}

export interface GeneralCatalogTranslationsItem {  
  id?: number;
  moldId?: number;
  description?: string;
  notes?: string;
  prefix?: string;
  languageId?: number;
  createdBy?: string;
  isTranslated?: boolean;
  translatedName?: string;
  translatedDescription?: string;
  translatedReference?: string;  
  translatedNotes?: string;  
  translatedPrefix?: string;  
}

export interface GeneralCatalogInternalData {  
  id?: number;
  name?: string;
  description?: string;
  reference?: string;
  notes?: string;
  prefix?: string;
  status?: string;
}

export interface MaintenanceHistoricalDataItem {
  moldId?: number;
  id?: number;
  maintenanceDate?: string;
  state?: string;
  operatorName?: string;
  notes?: string;
  // provider?: GeneralCatalogItem;
  provider?: GeneralCatalogMappedItem
}

export interface GeneralHardcodedValuesItem {
  id?: number;
  languageId?: number;
  mainImagePath?: string;
  friendlyText?: string;
  used?: boolean;
  value: string;
  disabled: boolean;
}

export interface GeneralCatalogTranslations {
  languageId?: number;
  name?: string;
  reference: string;
  descripcion?: string;
  notes?: string;
  prefix?: string;
}

export interface GeneralTranslatedFields {
  isTranslated?: boolean;
  translatedName?: string;
  translatedReference: string;
  translatedDescripcion?: string;
  translatedNotes?: string;
  translatedPrefix?: string;
}

export interface GeneralCatalogParams {
  catalogName?: string;
  textToSearch?: string;
  initArray?: boolean;
}

export const emptyGeneralCatalogData: GeneralCatalogData = {
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

export const emptyGeneralCatalogItem: GeneralCatalogMappedItem = {
  id: 0,
  status: '',
  isTranslated: false,
  translatedName: '',
  translatedDescription: '',
  translatedReference: '',
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

  export const emptyGeneralHardcodedValuesItem: GeneralHardcodedValuesItem = {
    id: 0,
    languageId: 0,
    friendlyText: '',
    value: '',
    disabled: false,
  }  

  export const emptyMaintenanceHistoricalData: MaintenanceHistoricalData = {
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

  export enum MoldStates {
    IN_PRODUCTION = 'in-production',
    IN_WAREHOUSE = 'in-warehouse',
    IN_REPAIRING = 'in-reparing',
    OUT_OF_SERVICE = 'out-of-service',
  }

  export enum MoldThresoldTypes {
    N_A = 'n/a',
    HITS = 'hits',
    BOTH = 'both',
    DAYS = 'days',
  }

  export enum MoldControlStates {
    RED = 'red',
    YELLOW = 'yellow',
  } 
  
 