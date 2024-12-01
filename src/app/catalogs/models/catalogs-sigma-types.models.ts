import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface SigmaTypesData {
  sigmaTypesPaginated?: SigmaTypes;
}

export interface SigmaTypeData {
  oneSigmaType?: SigmaTypeItem;
  translations?: any;
}

export interface SigmaTypes {
  items?: SigmaTypeItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface SigmaTypeItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: SigmaTypeDetail;
}

export interface SigmaTypeDetail {
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

export interface SigmaTypesState {
  loading: boolean;
  sigmaTypesData: SigmaTypesData;
}

export interface SigmaTypeState {
  
  loading: boolean;
  moldDetail: SigmaTypeDetail;
}

export interface SigmaTypeCatalog {
  id: string;
  name: string;


  status: string;
  updatedAt: string;
}



export const emptySigmaTypeCatalog = {  
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

export const emptySigmaTypeItem: SigmaTypeDetail = {  
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
