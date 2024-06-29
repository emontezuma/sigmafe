import {  GeneralCatalogInternalData, GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface PlantsData {
  plantsPaginated?: Plants;
}

export interface PlantData {
  onePlant?: PlantItem;
  translations?: any;
}

export interface Plants {
  items?: PlantItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface PlantItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: PlantDetail;
}

export interface PlantDetail {
  name?: string;
  reference?: string;
  notes?: string;
  prefix?: string;
  mainImageGuid?: string;
  mainImagePath?: string;
  mainImageName?: string;
  mainImage?: string;
  id?: number;
  company?: GeneralCatalogInternalData,
  customerId?: number;
  companyId?: number;
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

export interface PlantsState {
  loading: boolean;
  plantsData: PlantsData;
}

export interface PlantState {
  loading: boolean;
  moldDetail: PlantDetail;
}

export interface PlantCatalog {
  id: string;
  name: string;
  mainImagePath: string;

  status: string;
  updatedAt: string;
}



export const emptyPlantCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    companyId:null,
    name: null,
    mainImagePath: null,    
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyPlantItem: PlantDetail = {  
  name: null,
  id: null,
  customerId: null,
  companyId:null,
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
