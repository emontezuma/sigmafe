import { VariableData } from "src/app/catalogs";
import { ChecklistLine, ChecklistTemplatePossibleValue, GeneralCatalogInternalData, VariableDetail } from "src/app/shared/models";
import { Attachment, Priority, RecordStatus, SimpleTable } from "src/app/shared/models/helpers.models";

export enum ChecklistAnswerType {
    YES_NO = 'yesNo',
    YES_NO_NA = 'yesNoNa',
    SELECT = 'select',
    MULTI_SELECT = 'multiSelect',
    FREE_FORM = 'freeForm',
}

export enum SelectionType {
    LAZY_LOADING = 'lazyLoading',
    FIRST_SEARCH = 'firstSearch',
    COMBO = 'combo',
    CHIPS = 'chips',
    COMBO_CHIPS = 'comboChips',
}

export enum ChecklistFreeFormDataType {
    DATE = 'date',
    DATE_AND_TIME = 'dateAndTime',
    DATE_RANGE = 'dateRange',
    TIME = 'time',
    TEXT = 'text',
    NUMBER = 'number',
    FROM_COMBO = 'fromCombo',
}

export enum ChecklistAnswerDataValidator {        
    REQUIRED = 'required',
    MIN_VALUE = 'minValue',
    MAX_VALUE = 'maxValue',
    MAX_MIN = 'maxMin',
    MIN_LENGTH = 'minLength',
    MAX_LENGTH = 'maxLength',
    ATTACHMENT_REQUIRED = 'attachtmentRequired',
}

export enum ChecklistAnswerAttachmentValidator {        
    ANY = 'any',
    IMAGE = 'image',
    VIDEO = 'video',
    PDF = 'pdf',
    DOCUMENT = 'document',
    SPREADSHEET = 'spreadsheet',
    PRESENTATION = 'presentation',
}

export enum ChecklistVisualHelperSupported {        
    IMAGE = 'image',
    VIDEO = 'video',
    PDF = 'pdf',
}

export enum ChecklistState {
    PLANNED = 'planned',
    CALCELLED = 'cancelled',
    READY = 'ready',
    IN_PROGRESS = 'inProgress',
    PAUSED_BY_USER = 'pausedByUser',
    PAUSED_BY_ADMIN = 'pausedByAdmin',
    COMPLETED = 'completed',
}

export enum ChecklistQuestionStatus {
    READY = 'ready',
    TAKEN = 'taken',
    CANCELLED = 'cancelled',
    ATTACHMENT_MISSING = 'attachmentMissing',
    COMPLETED = 'completed',
}

export enum variableValueStatus {
    REGULAR = 'regular',
    WARNED = 'warned',
    ALARMED = 'alarmed',
    RESETED = 'reseted',
    OVERFLOW = 'overflow',
}

export enum ChecklistView {
    ONE_QUESTION_PER_PAGE = 'oneQuestionByPage',
    INFINITE_LIST = 'infiniteList',
    TABLE = 'table',
    FLEXBOX = 'flexbox',
}

export enum ChecklistStartingMode {
    ANYTIME = 'anytime',
    STARTING_DATE = 'startingDate',
    APPROVE = 'approve',    
}

export enum CountdownType {
    REGRESSIVE_FROM_DUEDATE = 'regressiveFromDueDate',
    PROGRESSIVE_FROM_START_DATE = 'progressiveFromStartDate',
}

export interface ChecklistFillingItem {
    id?: string;
    index?: number;
    order?: number;
    text?: string;
    extendedInfo?: string;
    answerType?: ChecklistAnswerType;
    answerByDefault?: string;
    answer?: string;
    status?: ChecklistQuestionStatus;
    showExtendedInfo?: boolean;
    showVisualSupport?: boolean;
    allowNotes?: boolean;
    allowActionPlans?: boolean;
    allowAttachments?: boolean;
    allowVisualEvidence?: boolean;
    canAlarm?: boolean;
    yesyNoAlarm?: string;
    completionDate?: string;
    startedDate?: string;
    warned?: boolean;
    alarmed?: boolean;
    required?: boolean;
    attachmentRequired?: boolean;
    actionRequired?: boolean;
    attachmentCompleted?: boolean;
    icon?: string;
    alarms?: ChecklistAlarms[];
    helpers?: Attachment[];
    buttons?: any[]; // TODO define the intreface
    component?: ChecklistInnerObject;
    showChart?: boolean;
    previousValues?: previousVariableValue[];
    variable?: VariableDetail;
}

export interface ChecklistAlarms {
    comparison?: undefined | '==' | '!=' | '>' | '>=' | '<' | '<=';
    value: string;

}
export interface ChecklistAssignement {
    name?: string;
    department?: string;
    date?: string;
    type?: string;
    plantName?: string;    
    countryName?: string;    
    companyName?: string;    
}

export interface ChecklistPeriod {
    type?: undefined | 'count' | 'no-count';
    from?: string;
    to?: string;
}

export interface ChecklistPlanning {
    name?: string;
    department?: string;
    date?: string;
    type?: string;    
}

export interface ChecklistInnerObject {
    id?: string;
    number?: string;
    description?: string;
    reference?: string;
    date?: string;
    notes?: string;
    name?: string;    
    completedDate?: string;    
    lastChecklist?: ChecklistInnerObject;
    assignedTo?: ChecklistInnerObject;
    canAlarm?: boolean;
}

export interface VariablesEquipmentsValue {
    id?: string;
    number?: string;
    value?: string;
    isDefaultValue?: boolean;
    isAlarm?: boolean;
}

export interface previousVariableValue {
    value?: string;
    date?: string;    
    status?: variableValueStatus;    
}

export interface ChecklistFillingData {
    id?: string;
    number?: string;
    recordUrl?: string;
    name?: string;
    notes?: string;
    parentId?: string;
    sequence?: number;
    description?: string;
    extendedInfo?: string;
    questions?: number;
    warnedItems?: number;
    moldId?: string;
    completed?: number;
    cancelled?: number;
    alarmedItems?: number;
    valueToPrint?: number;
    canAlarm?: boolean;
    canExpire?: boolean;
    alarmed?: boolean;
    dueDateToStart?: string;
    startDate?: string;
    dueDateToFinish?: string;
    applyCountdown?: boolean,
    countdownType?: CountdownType;
    viewType?: ChecklistView;
    icon?: string;
    items?: ChecklistFillingItem[];
    lines?: ChecklistLine[];
    status?: RecordStatus;
    state?: ChecklistState;
    stateDescription?: string;
    priority?: Priority;
    type?: SimpleTable;
    class?: SimpleTable;
    project?: SimpleTable;
    assignement?: ChecklistAssignement;
    planning?: ChecklistPlanning;
    actionRequired?: boolean;
    attachmentCompleted?: boolean;
    equipment?: ChecklistInnerObject;
    mold?: ChecklistInnerObject;
    periods?: ChecklistPeriod[];
    startingMode?: ChecklistStartingMode;
    secondsToAlert?: number;
    timeToFill?: number;
    friendlyStatus?: string;
    friendlyState?: string;
    friendlyFrequency?: string;
    friendlyGenerationMode?: string;
    checklistTemplate?: checklistTemplateData;
}

export interface checklistTemplateData {
    reference?: string;
    name?: string;
} 

export interface ChecklistFillingState {
    loading: boolean;
    checklistFillingData: ChecklistFillingData;
}

export const emptyChecklistFillingData = {
    id: null,
    number: null,
    parentId: null,
    sequence: null,
    description: null,
    extendedInfo: null,
    recordUrl: null,
}
