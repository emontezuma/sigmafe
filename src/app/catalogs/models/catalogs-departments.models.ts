import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface DepartmentsData {
  departmentsPaginated?: Departments;
}

export interface DepartmentData {
  oneDepartment?: DepartmentItem;
  translations?: any;
}

export interface Departments {
  items?: DepartmentItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface DepartmentItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: DepartmentDetail;
}

export interface DepartmentDetail {
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

export interface DepartmentsState {
  loading: boolean;
  departmentsData: DepartmentsData;
}

export interface DepartmentState {//warning
  loading: boolean;
  moldDetail: DepartmentDetail;
}

export interface DepartmentCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  status: string;
  updatedAt: string;
}

export const emptyDepartmentCatalog = {  
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

export const emptyDepartmentItem: DepartmentDetail = {  
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
