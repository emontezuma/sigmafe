import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface TablesData {
  tablesPaginated?: Tables;
}

export interface TableData {
  oneTable?: TableItem;
  translations?: any;
}

export interface Tables {
  items?: TableItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface TableItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: TableDetail;
}

export interface TableDetail {
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

export interface TablesState {
  loading: boolean;
  tablesData: TablesData;
}

export interface TableState {
  
  loading: boolean;
  moldDetail: TableDetail;
}

export interface TableCatalog {
  id: string;
  name: string;


  status: string;
  updatedAt: string;
}



export const emptyTableCatalog = {  
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

export const emptyTableItem: TableDetail = {  
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
