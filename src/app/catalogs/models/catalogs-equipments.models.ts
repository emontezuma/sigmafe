import {  GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface EquipmentsData {
  equipmentsPaginated?: Equipments;
}

export interface EquipmentData {
  oneEquipment?: EquipmentItem;
  translations?: any;
}

export interface Equipments {
  items?: EquipmentItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface EquipmentItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: EquipmentDetail;
}

export interface EquipmentDetail {
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

export interface EquipmentsState {
  loading: boolean;
  equipmentsData: EquipmentsData;
}

export interface EquipmentState {
  loading: boolean;
  moldDetail: EquipmentDetail;
}

export interface EquipmentCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  status: string;
  updatedAt: string;
}

export const emptyEquipmentCatalog = {  
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

export const emptyEquipmentItem: EquipmentDetail = {  
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
