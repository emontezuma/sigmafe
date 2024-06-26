import { GeneralCatalogInternalData, GeneralTranslation, GeneralValues, PageInfo } from 'src/app/shared/models';

export interface ChecklistTemplatesData {
  checklistTemplatesPaginated?: ChecklistTemplates;
}

export interface ChecklistTemplateData {
  oneChecklistTemplate?: ChecklistTemplateItem;
  translations?: any;
}

export interface ChecklistTemplates {
  items?: ChecklistTemplateItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface ChecklistTemplateItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: ChecklistTemplateDetail;
}

export interface ChecklistTemplateDetail {
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
  valueType?: string,
  status?: string;
  showNotes?: string;
  translations?: GeneralTranslation[];
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
  
}

export interface ChecklistTemplatesState {
  loading: boolean;
  checklistTemplatesData: ChecklistTemplatesData;
}

export interface ChecklistTemplateState {
  loading: boolean;
  moldDetail: ChecklistTemplateDetail;
}

export interface ChecklistTemplateCatalog {
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

export const emptyChecklistTemplateCatalog = {  
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

export const emptyChecklistTemplateItem: ChecklistTemplateDetail = {  
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
  byDefault: '',
  byDefaultDateType: '-',
};

export interface ChecklistTemplatePossibleValue {
  order?: number;
  value?: string;
  byDefault?: boolean;
  alarmedValue?: boolean;  
}
