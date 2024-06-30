import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface LinesData {
  linesPaginated?: Lines;
}

export interface LineData {
  oneLine?: LineItem;
  translations?: any;
}

export interface Lines {
  items?: LineItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface LineItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: LineDetail;
}

export interface LineDetail {
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
  plantId?: number;
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

export interface LinesState {
  loading: boolean;
  linesData: LinesData;
}

export interface LineState {
  loading: boolean;
  moldDetail: LineDetail;
}

export interface LineCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  status: string;
  updatedAt: string;
}

export const emptyLineCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    plantId:null,
    name: null,
    mainImagePath: null,    
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyLineItem: LineDetail = {  
  name: null,
  id: null,
  customerId: null,
  plantId:null,
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
