import { Attachment, ChecklistTemplatePossibleValue, GeneralCatalogInternalData, GeneralCatalogMappedItem, GeneralTranslation, GeneralValues, LineButton, PageInfo } from 'src/app/shared/models';

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
  templateType?: GeneralCatalogMappedItem,
  sigmaType?: GeneralCatalogInternalData,
  valueType?: string,
  status?: string;
  showNotes?: string;
  translations?: GeneralTranslation[];  
  allowNoCapture?: string;
  allowComments?: string;
  showChart?: string;
  allowAlarm?: string;
  notifyAlarm?: string;  
  lastGeneratedDate?: string; 
  generationCount?: number;
  attachments?: Attachment[];  
  attachmentsList?: string
  createdById?: any;
  createdAt?: string;
  updatedById?: any;
  updatedAt?: string;
  deletedById?: any;
  deletedAt?: any;
  deletedBy?: any;
  updatedBy?: any;
  createdBy?: any;
  allowDiscard?: string;
  allowRejection?: string;
  allowManualMode?: string;
  allowPartialSaving?: string;
  allowApprovalByGroup?: string;
  allowExpiring?: string;
  requiresApproval?: string;
  cancelOpenChecklists?: string;
  allowReassignment?: string;
  initialState?: string;
  requiresActivation?: string;
  allowRestarting?: string;
  
  expiringMessageSubject?: string;    
  expiringMessageBody?: string;
  expiringNotificationMode?: string;
  expiringChannels?: string;
  notifyExpiring?: string;
  
  alarmNotificationMode?: string;
  alarmNotificationChannels?: string;
  alarmNotificationMessageSubject?: string;
  alarmNotificationMessageBody?: string;
  
  approvalNotificationMode?: string;
  approvalRequestChannels?: string;
  approvalRequestMessageSubject?: string;
  approvalRequestMessageBody?: string;
  notifyApproval?: string;
  
  anticipationMessageSubject?: string;
  anticipationNotificationMode?: string;
  anticipationChannels?: string;
  anticipationMessageBody?: string;
  notifyAnticipation?: string;
  anticipationSeconds?: number;    
  
  notifyGeneration?: string;
  generationNotificationMode?: string;
  generationChannels?: string;    
  generationMessageSubject?: string;
  generationMessageBody?: string;    

  moldStates?: string;    
  
  molds?: string;
  expiringRecipient?: GeneralCatalogInternalData;
  approvalRecipient?: GeneralCatalogInternalData;
  alarmRecipient?: GeneralCatalogInternalData;
  anticipationRecipient?: GeneralCatalogInternalData;
  generationRecipient?: GeneralCatalogInternalData;
  timeToFill?: number;    

  approver?: GeneralCatalogInternalData,
  lines?: [],  
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
  name: '',
  reference: '',
  notes: '',
  prefix: '',
  mainImageGuid: '',
  mainImagePath: '',
  mainImageName: '',
  mainImage: '',
  id: null,
  customerId: null,
  templateType: null,
  sigmaType: null,
  status: '',
  showNotes: '',  
  allowNoCapture: '',
  allowComments: '',
  showChart: '',
  allowAlarm: '',
  notifyAlarm: '',  
  lastGeneratedDate: '',     
  createdById: null,
  createdAt: null,
  updatedById: null,
  updatedAt: '',
  deletedById: null,
  deletedAt: null,
  deletedBy: null,
  updatedBy: null,
  createdBy: null,
  allowDiscard: '',
  allowRejection: '',
  allowManualMode: '',
  allowPartialSaving: '',
  allowApprovalByGroup: '',  
  allowExpiring: '',
  requiresApproval: '',
  moldStates: '',
  cancelOpenChecklists: '',
  allowReassignment: '',
  initialState: '',
  requiresActivation: '',
  allowRestarting: '',
  
  expiringMessageSubject: '',    
  expiringMessageBody: '',
  expiringNotificationMode: '',
  expiringChannels: '',
  notifyExpiring: '',
  
  alarmNotificationMode: '',
  alarmNotificationChannels: '',
  alarmNotificationMessageSubject: '',
  alarmNotificationMessageBody: '',
  
  approvalNotificationMode: '',
  approvalRequestChannels: '',
  approvalRequestMessageSubject: '',
  approvalRequestMessageBody: '',
  notifyApproval: '',
  
  anticipationMessageSubject: '',
  anticipationNotificationMode: '',
  anticipationChannels: '',
  anticipationMessageBody: '',
  notifyAnticipation: '',
  anticipationSeconds: null,
  
  notifyGeneration: '',
  generationNotificationMode: '',
  generationChannels: '',    
  generationMessageSubject: '',
  generationMessageBody: '',    
  
  molds: '',
  expiringRecipient: null,
  approvalRecipient: null,
  alarmRecipient: null,
  anticipationRecipient: null,
  generationRecipient: null,
  timeToFill: null,    
  approver: null,    
  attachments: [],
  translations: [],  
  lines: [],  
};

export interface ChecklistTemplateLine {
  checklistTemplateId?: number;
  id?: number;
  buttons: LineButton[];
  comments: any[];
  customerId?: number;
  line?: number;
  order?: number;
  loading?: boolean;
  enabled?: boolean;
  error?: boolean;
  validate?: boolean;
  variableId?: number;
  recipientId?: number;
  useVariableSettings?: string;
  name?: string;
  notes?: string;
  minimum?: string;
  maximum?: string;
  required?: string;
  byDefault?: string;
  allowNoCapture?: string;
  allowComments?: string;
  possibleValues?: string;
  possibleValue?: string;
  byDefaultDateType?: string;
  valueType?: string;
  sensorId?: number;
  uomId?: number;
  uomName?: string;  
  uomPrefix?: string;
  showChart?: string;
  useVariableAttachments?: string;
  showLastValue?: string;
  showParameters?: string;
  showNotes?: string;
  allowAlarm?: string;
  notifyAlarm?: string;  
  recipient?: GeneralCatalogInternalData,  
  status?: string;
  uom?: GeneralCatalogInternalData,
  attachments?: Attachment[];
  attachmentsList?: string;
  valuesList?: ChecklistTemplatePossibleValue[];
  friendlyVariableValueType?: string;
  variableAttachments?: Attachment[];  
}

