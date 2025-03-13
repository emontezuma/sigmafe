import {  GeneralCatalogInternalData, GeneralTranslation, GeneralValues, HarcodedChecklistReportPeriodOfTime, PageInfo } from 'src/app/shared/models';

export interface QueriesData {
  queriesPaginated?: Queries;
}

export interface QueryData {
  oneQuery?: QueryItem;
  translations?: any;
}

export interface Queries {
  items?: QueryItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface QueryItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: QueryDetail;
}

export interface QueryDetail {
  name?: string;
  id?: number;
  userId?: number;
  customerId?: number;
  alarmed?: string;
  byDefault?: string;
  partNumbers?: string;
  molds?: string;
  variables?: string;
  periodTime?: string;
  fromDate?: string;
  toDate?: string;
  public?: string;
  checklistState?: string;
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

export interface QueriesState {
  loading: boolean;
  queriesData: QueriesData;
}

export interface QueryState {
  loading: boolean;
  moldDetail: QueryDetail;
}

export interface QueryCatalog {
  id: string;
  name: string;
  imagePath: string;
  status: string;
  updatedAt: string;
}

export const emptyQueryCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    recipientId: null,

    plantId:null,
    name: null,
    imagePath: null,    
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyQueryItem: QueryDetail = {  
  name: null,
  id: null,
  customerId: null,
  alarmed: '',
  byDefault: GeneralValues.NO,
  partNumbers: GeneralValues.YES,
  molds: GeneralValues.YES,
  variables: GeneralValues.YES,
  public: GeneralValues.NO,
  checklistState: 'closed',
  periodTime: HarcodedChecklistReportPeriodOfTime.CURRENT_DAY,
  fromDate: null,
  toDate: null,
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
};
