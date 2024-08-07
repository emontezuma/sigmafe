import { Attachment, GeneralCatalogInternalData, GeneralTranslation, GeneralValues, PageInfo } from 'src/app/shared/models';
import { ChecklistTemplatePossibleValue } from './catalogs-checklist-templates.models';

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
  uomName?: string;
  uomPrefix?: string;
  recipient?: GeneralCatalogInternalData,
  sigmaType?: GeneralCatalogInternalData,
  valueType?: string,
  status?: string;
  showNotes?: string;
  translations?: GeneralTranslation[];
  attachments?: Attachment[];
  required?: string;
  allowNoCapture?: string;
  allowComments?: string;
  showChart?: string;
  allowAlarm?: string;
  notifyAlarm?: string;
  accumulative?: string;
  automaticActionPlan?: string;  
  actionPlansToGenerate?: string;  
  possibleValues?: string;  

  byDefault?: string; 
  byDefaultDateType?: string; 
  
  resetValueMode?: string; 
  valuesList?: ChecklistTemplatePossibleValue[]; 
  minimum?: string; 
  maximum?: string; 
  createdById?: any;
  createdAt?: string;
  updatedById?: any;
  updatedAt?: string;
  deletedById?: any;
  deletedAt?: any;
  deletedBy?: any;
  updatedBy?: any;
  createdBy?: any;  
  friendlyValueType?: string;
  uomId?: number;
  recipientId?: number;
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


