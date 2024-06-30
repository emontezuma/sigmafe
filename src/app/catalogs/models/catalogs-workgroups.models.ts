import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface WorkgroupsData {
  workgroupsPaginated?: Workgroups;
}

export interface WorkgroupData {
  oneWorkgroup?: WorkgroupItem;
  translations?: any;
}

export interface Workgroups {
  items?: WorkgroupItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface WorkgroupItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: WorkgroupDetail;
}

export interface WorkgroupDetail {
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
  approverId?: number; 
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

export interface WorkgroupsState {
  loading: boolean;
  workgroupsData: WorkgroupsData;
}

export interface WorkgroupState {
  loading: boolean;
  moldDetail: WorkgroupDetail;
}

export interface WorkgroupCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  status: string;
  updatedAt: string;
}

export const emptyWorkgroupCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    recipientId: null,
    approverId: null,
    plantId:null,
    name: null,
    mainImagePath: null,    
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyWorkgroupItem: WorkgroupDetail = {  
  name: null,
  id: null,
  customerId: null,
  plantId: null,
  recipientId: null,
  approverId: null, 
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
