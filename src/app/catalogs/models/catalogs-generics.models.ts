import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface GenericsData {
  genericsPaginated?: Generics;
}

export interface GenericData {
  oneGeneric?: GenericItem;
  translations?: any;
}

export interface Generics {
  items?: GenericItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface GenericItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: GenericDetail;
}

export interface GenericDetail {
  name?: string;
  reference?: string;
  notes?: string;
  prefix?: string;
  friendlyTableName?: string;
  tableName?: string;
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

export interface GenericsState {
  loading: boolean;
  genericsData: GenericsData;
}

export interface GenericState {
  
  loading: boolean;
  moldDetail: GenericDetail;
}

export interface GenericCatalog {
  id: string;
  name: string;


  status: string;
  updatedAt: string;
}



export const emptyGenericCatalog = {  
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

export const emptyGenericItem: GenericDetail = {  
  name: null,
  id: null,
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
