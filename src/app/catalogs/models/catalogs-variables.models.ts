import { GeneralCatalogInternalData, GeneralTranslation, GeneralValues, PageInfo } from 'src/app/shared/models';

export interface VariablesData {
  variablesPaginated?: Variables;
}

export interface VariableData {
  oneVariable?: VariableItem;
  translations?: any;
}

export interface Variables {
  items?: VariableItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface VariableItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: VariableDetail;
}

export interface VariableDetail {
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
  uom?: GeneralCatalogInternalData,
  sigmaType?: GeneralCatalogInternalData,
  resetValueMode?: string,
  valueType?: string,
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
  showNotes?: boolean;
  translations?: GeneralTranslation[];
  required?: string;
  allowNoCapture?: string;
  allowComments?: string;
  showChart?: string;
  allowAlarm?: string;
  notifyAlarm?: string;
  cumulative?: string;
  automaticActionPlan?: string;  
}

export interface VariablesState {
  loading: boolean;
  variablesData: VariablesData;
}

export interface VariableState {
  loading: boolean;
  moldDetail: VariableDetail;
}

export interface VariableCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  serialNumber: string;
  status: string;
  updatedAt: string;
}

export const emptyInternalCatalog = {  
  id: null,
  customerId: null,
  name: null,      
};

export const emptyVariableCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    name: null,
    mainImagePath: null,    
    uom: emptyInternalCatalog,
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyVariableItem: VariableDetail = {  
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
  showNotes: false,
  required: GeneralValues.NO,
  allowNoCapture: GeneralValues.NO,
  allowComments: GeneralValues.NO,
  showChart: GeneralValues.NO,
  allowAlarm: GeneralValues.NO,
  cumulative: GeneralValues.NO,
  automaticActionPlan: GeneralValues.NO,
  notifyAlarm: GeneralValues.NO,
  translations: [],
};
