import { Attachment, ChecklistTemplatePossibleValue, GeneralCatalogInternalData, GeneralTranslation, GeneralValues, PageInfo, VariableDetail } from 'src/app/shared/models';

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

const emptyInternalCatalog = {  
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
    recipient: emptyInternalCatalog,    
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
  maximum: null,
  valueToAlarm: null,
  minimum: null,
  createdById: null,
  createdAt: null,
  updatedById: null,
  updatedAt: null,
  deletedById: null,
  deletedAt: null,
  deletedBy: null,
  updatedBy: null,
  createdBy: null,
  showNotes: GeneralValues.NO,
  required: GeneralValues.NO,
  allowNoCapture: GeneralValues.NO,
  allowComments: GeneralValues.NO,
  showChart: GeneralValues.NO,
  allowAlarm: GeneralValues.NO,
  accumulative: GeneralValues.NO,  
  automaticActionPlan: GeneralValues.NO,
  notifyAlarm: GeneralValues.NO,
  translations: [],
  attachments: [],
  byDefault: '',
  translatedNotes: '',
  byDefaultDateType: '-',
};

export interface VariablePossibleValue {
  order?: number;
  value?: string;
  byDefault?: boolean;
  alarmedValue?: boolean;  
}

export interface VariableSelection {
  id?: number;
  customerId?: number;
  name?: string;  
}


