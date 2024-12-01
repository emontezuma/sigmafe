import {  GeneralCatalogInternalData, GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface RecipientsData {
  RecipientsPaginated?: Recipients;
}

export interface RecipientData {
  oneRecipient?: RecipientItem;
  translations?: any;
}

export interface Recipients {
  items?: RecipientItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface RecipientItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: RecipientDetail;
}

export interface RecipientDetail {
  name?: string;
  reference?: string;
  notes?: string;
  prefix?: string;
  emails?: string;
  phones?: string;
  mmcalls?: string;
  smartWatchService1?: string;
  smartWatchService2?: string;
  smartWatchService3?: string;
  smartWatchService4?: string;
  smartWatchService5?: string;
  phoneServices?: string;
  languageId?: number;
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
  translations?: GeneralTranslation[];  
  language?: GeneralCatalogInternalData,
}

export interface RecipientsState {
  loading: boolean;
  RecipientsData: RecipientsData;
}

export interface RecipientState {  
  loading: boolean;
  moldDetail: RecipientDetail;
}

export interface RecipientCatalog {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
}

export const emptyRecipientCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    name: null,
    emails: null,
    phones: null,
    mmcalls: null,
    smartWatchService1: null,
    smartWatchService2: null,
    smartWatchService3: null,
    smartWatchService4: null,
    smartWatchService5: null,
    phoneServices: null,
    languageId: 1,
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyRecipientItem: RecipientDetail = {  
  language: null,
  name: null,
  id: null,
  emails: null,
  phones: null,
  mmcalls: null,
  smartWatchService1: null,
  smartWatchService2: null,
  smartWatchService3: null,
  smartWatchService4: null,
  smartWatchService5: null,
  phoneServices: null,
  languageId: 1,
  customerId: null,
  prefix: null,
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

  translations: [],
};
