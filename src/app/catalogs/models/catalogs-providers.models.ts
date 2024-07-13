import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface ProvidersData {
  providersPaginated?: Providers;
}

export interface ProviderData {
  oneProvider?: ProviderItem;
  translations?: any;
}

export interface Providers {
  items?: ProviderItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface ProviderItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: ProviderDetail;
}

export interface ProviderDetail {
  name?: string;
  reference?: string;
  notes?: string;
  prefix?: string;
  mainImageGuid?: string;
  mainImagePath?: string;
  mainImageName?: string;
  mainImage?: string;
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
  
}

export interface ProvidersState {
  loading: boolean;
  providersData: ProvidersData;
}

export interface ProviderState {
  
  loading: boolean;
  moldDetail: ProviderDetail;
}

export interface ProviderCatalog {
  id: string;
  name: string;


  status: string;
  updatedAt: string;
}



export const emptyProviderCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    name: null,
   
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyProviderItem: ProviderDetail = {  
  name: null,
  id: null,
  mainImagePath: null,    
  mainImageGuid: null,  
  mainImageName: null,
  mainImage: null,
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
