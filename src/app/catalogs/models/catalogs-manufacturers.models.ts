import {  GeneralTranslation,  PageInfo} from 'src/app/shared/models';

export interface ManufacturersData {
  manufacturersPaginated?: Manufacturers;
}

export interface ManufacturerData {
  oneManufacturer?: ManufacturerItem;
  translations?: any;
}

export interface Manufacturers {
  items?: ManufacturerItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface ManufacturerItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: ManufacturerDetail;
}

export interface ManufacturerDetail {
  name?: string;
  reference?: string;
  notes?: string;
  prefix?: string;
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

export interface ManufacturersState {
  loading: boolean;
  manufacturersData: ManufacturersData;
}

export interface ManufacturerState {
  loading: boolean;
  moldDetail: ManufacturerDetail;
}

export interface ManufacturerCatalog {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
}

export const emptyManufacturerCatalog = {
  friendlyStatus: null,
  data: {
    id: null,
    name: null,
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyManufacturerItem: ManufacturerDetail = {
  name: null,
  id: null,
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
