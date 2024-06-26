import { GeneralCatalogInternalData, GeneralTranslation, GeneralValues, PageInfo } from 'src/app/shared/models';

export interface ChecklistTemplatesData {
  ChecklistTemplatesPaginated?: ChecklistTemplates;
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
  allowDiscard?: string,
  templateType?: GeneralCatalogInternalData,
  status?: string;  
  translations?: GeneralTranslation[];
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
  ChecklistTemplatesData: ChecklistTemplatesData;
}

export interface ChecklistTemplatestate {
  loading: boolean;
  moldDetail: ChecklistTemplateDetail;
}

export interface ChecklistTemplateCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  lastGeneratedDate: string;
  generationCount: number;
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
    templateType: emptyInternalCatalog,
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
  allowDiscard: GeneralValues.NO,
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

export interface ChecklistTemplatePossibleValue {
  order?: number;
  value?: string;
  byDefault?: boolean;
  alarmedValue?: boolean;  
}
