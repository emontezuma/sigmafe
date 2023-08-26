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

export enum ChecklistView {
    ONE_QUESTION_PER_PAGE = 'oneQuestionByPage',
    INFINITE_LIST = 'infiniteList',
    TABLE = 'table',
    FLEXBOX = 'flexbox',
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
    alarmed?: boolean;
    attachmentRequired?: boolean;
    actionRequired?: boolean;
    attachmentCompleted?: boolean;
    icon?: string;
    helpers?: Attachment[];
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

export interface ChecklistPlanning {
    name?: string;
    department?: string;
    date?: string;
    type?: string;    
}

export interface ChecklistEquipment {
    id?: string;
    number?: string;
    description?: string;
    extendedInfo?: string;
    lastChecklistDate?: string;
    lastChecklistAuditor?: string;
    CanAlarm?: boolean;
}

export interface VariablesEquipmentsValue {
    id?: string;
    number?: string;
    value?: string;
    isDefaultValue?: boolean;
    isAlarm?: boolean;
}

export interface ChecklistFillingData {
    id?: string;
    number?: string;
    description?: string;
    extendedInfo?: string;
    questions?: number;
    completed?: number;
    valueToPrint?: number;
    itemsAlarmedText?: string;
    CanAlarm?: boolean;
    alarmed?: boolean;
    dueDateToStart?: string;
    startDate?: string;
    dueDateToFinish?: string;
    applyCountdown?: boolean,
    countdownType?: CountdownType;
    viewType?: ChecklistView;
    icon?: string;
    items?: ChecklistFillingItem[];
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
    equipment?: ChecklistEquipment;
}

export interface ChecklistFillingState {
    loading: boolean;
    checklistFillingData: ChecklistFillingData;
}
