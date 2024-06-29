import {  GeneralTranslation,  PageInfo} from 'src/app/shared/models';

export interface CustomersData {
  customersPaginated?: Customers;
}

export interface CustomerData {
  oneCustomer?: CustomerItem;
  translations?: any;
}

export interface Customers {
  items?: CustomerItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface CustomerItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: CustomerDetail;
}

export interface CustomerDetail {
  name?: string;
  reference?: string;
  notes?: string;
  prefix?: string;
  mainImageGuid?: string;
  mainImagePath?: string;
  mainImageName?: string;
  mainImage?: string;
  id?: number;
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

export interface CustomersState {
  loading: boolean;
  customersData: CustomersData;
}

export interface CustomerState {
  loading: boolean;
  moldDetail: CustomerDetail;
}

export interface CustomerCatalog {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
}

export const emptyCustomerCatalog = {
  friendlyStatus: null,
  data: {
    id: null,
    name: null,
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyCustomerItem: CustomerDetail = {
  name: null,
  id: null,
  prefix: null,
  status: null,
  mainImagePath: null,    
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
