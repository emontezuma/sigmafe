import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface PositionsData {
  positionsPaginated?: Positions;
}

export interface PositionData {
  onePosition?: PositionItem;
  translations?: any;
}

export interface Positions {
  items?: PositionItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface PositionItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: PositionDetail;
}

export interface PositionDetail {
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
  recipientId?: number;

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

export interface PositionsState {
  loading: boolean;
  positionsData: PositionsData;
}

export interface PositionState {
  loading: boolean;
  moldDetail: PositionDetail;
}

export interface PositionCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  status: string;
  updatedAt: string;
}

export const emptyPositionCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    recipientId: null,

    plantId:null,
    name: null,
    mainImagePath: null,    
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyPositionItem: PositionDetail = {  
  name: null,
  id: null,
  customerId: null,
  plantId: null,
  recipientId: null,

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
