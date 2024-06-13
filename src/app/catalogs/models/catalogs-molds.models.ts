import { GeneralCatalogInternalData, GeneralCatalogMappedItem, GeneralCatalogPageInfo, GeneralCatalogTranslation, GeneralHardcodedValuesItem } from "src/app/shared/models";

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

export interface GeneralCatalogItem {  
  data?: GeneralCatalogInternalData;
  translatedName?: string;
  translatedReference?: string;
  translatedDescription?: string;
  translatedPrefix: string;
  translatedNotes?: string;
  isTranslated?: boolean;
  translations?: GeneralCatalogTranslation[];
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

  export const emptyGeneralHardcodedValuesItem: GeneralHardcodedValuesItem = {
    id: 0,
    languageId: 0,
    friendlyText: '',
    value: '',
    disabled: false,
    status: '',
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
    HITS = 'hits',
    BOTH = 'both',
    DAYS = 'days',
  }

  export enum MoldControlStates {
    RED = 'red',
    YELLOW = 'yellow',
  } 
  
 export interface MoldParameters {
  settingType: string,
  skipRecords?: number,
  takeRecords?: number,
  filter?: any,
  order?: any,
  id?: number,
  customerId?: number,
  status?: string,
}
