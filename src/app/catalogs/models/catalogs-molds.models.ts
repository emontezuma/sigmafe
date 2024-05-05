export enum CatalogsMolds {
  YES_NO = 'yesNo',
  YES_NO_NA = 'yesNoNa',
  SELECT = 'select',
  MULTI_SELECT = 'multiSelect',
  FREE_FORM = 'freeForm',
}

export interface GeneralCatalogData {
  loading: boolean;
  totalCount: number;
  currentPage?: number;
  pageInfo: GeneralCatalogPageInfo;
  items: GeneralCatalogItem[];
  cadRight?: string;
}

export interface GeneralHardcodedValuesData {
  loading: boolean;
  totalCount: number;
  currentPage?: number;
  pageInfo: GeneralCatalogPageInfo;
  items: GeneralHardcodedValuesItem[];
  cadRight?: string;
}

export interface GeneralCatalogPageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GeneralCatalogItem {
  id: number;
  name: string;
  reference: string;
  translations: GeneralCatalogTranslations[];
}

export interface GeneralHardcodedValuesItem {
  id: number;
  languageId: number;
  friendlyText: string;
  value: string;
  translations: GeneralCatalogTranslations[];
}

export interface GeneralCatalogTranslations {
  name: string;
  reference: string;
  languageId: number;
}

export interface GeneralCatalogParams {
  catalogName: string;
  textToSearch: string;
  initArray: boolean;
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
  
