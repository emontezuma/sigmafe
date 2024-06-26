import { GeneralCatalogInternalData, GeneralCatalogMappedItem, GeneralCatalogPageInfo, GeneralCatalogTranslation, GeneralHardcodedValuesItem } from "src/app/shared/models";

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
