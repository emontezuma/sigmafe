export interface Attachment {
    index: number;
    id: string;
    icon: string;    
}

export interface SimpleTable {
    id?: string;
    code?: string;
    description?: string;
}

export interface Priority {
    id?: string;
    code?: string;
    number?: number;
    order?: string;
    description?: string;
}

export enum RecordStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    READY_TO_BE_PURGED = 'readyToBePurged',
}

export interface DatesDifference {
    message: string;
    totalSeconds: number;
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
}

export enum CapitalizationMethod {
    UPPERCASE = 'uppercase',
    LOWERCASE = 'lowercase',
    FIRST_LETTER_PHRASE = 'firstLetterPhrase',  
    FIRST_LETTER_WORD = 'firstLetterWord',  
}

export interface PageInfo {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
    totalRecords?: number;
    inactiveRecords?: number;
    activeRecords?: number;
    forcedUpdate?: boolean;
  }
 
  export enum originProcess {
    CATALOGS_MOLDS = 'catalogs-molds',
}
  
export enum SystemTables {
    PROVIDERS = 'providers',
    MANUFACTURERS = 'manufacturers',
    LINES = 'lines',
    MOLD_MAINTENANCE_STATES = 'mold-maintenance-states',
    EQUIPMENTS = 'equipments',
    PARTNUMBERS = 'partNumbers',
    MOLD_TYPES = 'moldTypes',
    MOLD_CLASSES = 'moldClasses',
    MOLDS = 'molds',
    ACTION_PLANS = 'action-plans',
    UOMS = 'uoms',
    SENSORS = 'sensors',
    SIGMA_TYPES = 'sigmaTypes',
    GEN_VALUES_YES_NO = 'gen-values-yes-no',
    RESET_VALUE_MODES = 'variable-reset-value-modes',
    VARIABLE_VALUE_TYPES = 'variable-value-types',
    MOLD_LABEL_COLORS = 'mold-label-color',
    MOLD_STATES = 'mold-states',
    MOLD_CONTROL_STRATEGIES = 'mold-control-strategies',
    CHECKLIST_TEMPLATES_YELLOW = 'mold-checklist-templates-yellow',
    CHECKLIST_TEMPLATES_RED = 'mold-checklist-templates-red',
    CHECKLIST_TEMPLATES = 'checklist-templates',
}

export enum GeneralValues {
    N_A = 'n/a',
    YES = 'y',
    NO = 'n',
    FREE_TEXT = 'free-text',
}

export enum TemplatesHardcodedlValues {
    BY_TYPE = 't',
    BY_SETTING = 's',
    ALL_TEMPLATES = 'y',
    FREE_TEXT = 'free-text',
}

export enum ScreenDefaultValues {
    N_A = 'N/A',
}
  
export interface OptionData {  
    label?: number;
    value?: string;
    disabled?: boolean;    
  }
  