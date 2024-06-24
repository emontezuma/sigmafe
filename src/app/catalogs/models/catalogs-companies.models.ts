import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface CompaniesData {
  companiesPaginated?: Companies;
}

export interface CompanyData {
  oneCompany?: CompanyItem;
  translations?: any;
}

export interface Companies {
  items?: CompanyItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface CompanyItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: CompanyDetail;
}

export interface CompanyDetail {
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

export interface CompaniesState {
  loading: boolean;
  companiesData: CompaniesData;
}

export interface CompanyState {//warning
  loading: boolean;
  moldDetail: CompanyDetail;
}

export interface CompanyCatalog {
  id: string;
  name: string;
  mainImagePath: string;

  status: string;
  updatedAt: string;
}



export const emptyCompanyCatalog = {  
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

export const emptyCompanyItem: CompanyDetail = {  
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
