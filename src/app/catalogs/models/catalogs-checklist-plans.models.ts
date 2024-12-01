import { GeneralCatalogInternalData, GeneralTranslation, PageInfo } from 'src/app/shared/models';
import { GeneralCatalogData } from './catalogs-shared.models';

export interface ChecklistPlansData {
  checklistPlansPaginated?: ChecklistPlans;
}

export interface ChecklistPlanData {
  oneChecklistPlan?: ChecklistPlanItem;
  translations?: any;
}

export interface ChecklistPlans {
  items?: ChecklistPlanItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface ChecklistPlanItem {
  friendlyStatus?: string;
  friendlyFrequency?: string;
  friendlyGenerationMdode?: string;
  isTranslated?: boolean;
  data: ChecklistPlanDetail;
}

export interface ChecklistPlanDetail {
  name?: string;
  reference?: string;  
  friendlyStatus?: string;
  friendlyFrequency?: string;
  friendlyGenerationMode?: string;
  checklistPlanType?: GeneralCatalogInternalData,
  friendlyGenerationMdode?: string;
  frequency?: string;
  specificDate?: string;
  hours?: string;
  notes?: string;
  prefix?: string;
  templates?: string;
  entitites?: string;
  id?: number;
  limit?: number;
  anticipationTime?: number;
  customerId?: number;
  status?: string;
  translations?: GeneralTranslation[];  
  lastGeneration?: string; 
  checklistCount?: number;
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

export interface ChecklistPlansState {
  loading: boolean;
  checklistPlansData: ChecklistPlansData;
}

export interface ChecklistPlanState {
  loading: boolean;
  moldDetail: ChecklistPlanDetail;
}

export interface ChecklistPlanCatalog {
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

export const emptyChecklistPlanCatalog = {  
  friendlyStatus: null,
  friendlyGenerationMdode: null,
  friendlyFrequency: null,
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

export const emptyChecklistPlanItem: ChecklistPlanDetail = {  
  name: '',
  reference: '',
  notes: '',
  prefix: '',
  id: null,
  customerId: null,
  checklistPlanType: null,  
  frequency: null,
  limit: 0,
  anticipationTime: 0,
  hours: null,
  specificDate: null,
  status: '',
  lastGeneration: '',     
  checklistCount: 0,     
  createdById: null,
  createdAt: null,
  updatedById: null,
  updatedAt: '',
  deletedById: null,
  deletedAt: null,
  deletedBy: null,
  updatedBy: null,
  createdBy: null,
  
  templates: '',  
  translations: [],
};

export interface ChecklistPlanPossibleValue {
  order?: number;
  value?: string;
  byDefault?: boolean;
  alarmedValue?: boolean;  
}
