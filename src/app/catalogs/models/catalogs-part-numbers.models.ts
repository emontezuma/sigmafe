import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface PartNumbersData {
  partNumbersPaginated?: PartNumbers;
}

export interface PartNumberData {
  onePartNumber?: PartNumberItem;
  translations?: any;
}

export interface PartNumbers {
  items?: PartNumberItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface PartNumberItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: PartNumberDetail;
}

export interface PartNumberDetail {
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

export interface PartNumbersState {
  loading: boolean;
  partNumbersData: PartNumbersData;
}

export interface PartNumberState {
  loading: boolean;
  moldDetail: PartNumberDetail;
}

export interface PartNumberCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  status: string;
  updatedAt: string;
}

export const emptyPartNumberCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,

    name: null,
    mainImagePath: null,    
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyPartNumberItem: PartNumberDetail = {  
  name: null,
  id: null,
  customerId: null,



  mainImagePath: null,    
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
