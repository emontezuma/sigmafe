import {  GeneralCatalogInternalData, GeneralTranslation, PageInfo } from 'src/app/shared/models';

export interface ShiftsData {
  shiftsPaginated?: Shifts;
}

export interface ShiftData {
  oneShift?: ShiftItem;
  translations?: any;
}

export interface Shifts {
  items?: ShiftItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface ShiftItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: ShiftDetail;
}



export interface ShiftDetail {
  name?: string;
  reference?: string;
  notes?: string;
  prefix?: string;

  id?: number;
  customerId?: number;

  calendarId?: number;
  calendar?: GeneralCatalogInternalData;
  
  twoDays?: string;
  isFirstSequence?: string;
  isLastSequence?: string;
  
  fromTime?: Date;
  toTime?: Date;
  moveToDate?: number;
  sequence?: number;

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

export interface ShiftsState {
  loading: boolean;
  shiftsData: ShiftsData;
}

export interface ShiftState {
  loading: boolean;
  moldDetail: ShiftDetail;
}

export interface ShiftCatalog {
  id: string;
  name: string;
  
  status: string;
  updatedAt: string;
}

export const emptyShiftCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,

    name: null,

    calendarId:null,
  
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyShiftItem: ShiftDetail = {  
  name: null,
  id: null,
  customerId: null,

  calendarId: null,
  
  notes:null,

  twoDays:null,
  moveToDate:null,
  fromTime:null,
  toTime:null,

  sequence:null,
  isFirstSequence:null,
  isLastSequence:null,

 
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
