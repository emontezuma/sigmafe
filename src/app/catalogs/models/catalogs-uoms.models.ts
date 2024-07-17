import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface UomsData {
  uomsPaginated?: Uoms;
}

export interface UomData {
  oneUom?: UomItem;
  translations?: any;
}

export interface Uoms {
  items?: UomItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface UomItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: UomDetail;
}

export interface UomDetail {
  name?: string;
  reference?: string;
  notes?: string;
  prefix?: string;

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

export interface UomsState {
  loading: boolean;
  uomsData: UomsData;
}

export interface UomState {
  
  loading: boolean;
  moldDetail: UomDetail;
}

export interface UomCatalog {
  id: string;
  name: string;


  status: string;
  updatedAt: string;
}



export const emptyUomCatalog = {  
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

export const emptyUomItem: UomDetail = {  
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
