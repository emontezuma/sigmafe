export interface Attachment {
    index?: number;
    id?: string;
    icon?: string;    
    image?: string;    
    name?: string;    
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
    CATALOGS_VARIABLES = 'catalogs-variables',
    CATALOGS_VARIABLES_ATTACHMENTS = 'catalogs-variables-attachments',
    CATALOGS_VARIABLES_TEMPLATES = 'catalogs-checklist-templates',
    CATALOGS_CHEKLIST_TEMPLATE_HEADER_ATTACHMENTS = 'catalogs-checklist-template-header-attachments',
    CATALOGS_CUSTOMERS = 'catalogs-custmomers',
}
  
export enum SystemTables {
    PROVIDERS = 'providers',
    COMPANIES = 'companies',
    PLANTS = 'plants',
    USERS = 'users',
    MANUFACTURERS = 'manufacturers',
    LINES = 'lines',
    MOLD_MAINTENANCE_STATES = 'mold-maintenance-states',
    EQUIPMENTS = 'equipments',
    PARTNUMBERS = 'partNumbers',
    MOLD_TYPES = 'mold-types',
    MOLD_CLASSES = 'mold-classes',
    MOLDS = 'variable-molds',
    VARIABLE_TEMPLATE_ACTION_PLANS = 'variable-template-action-plans',
    TEMPLATE_ACTION_PLANS = 'template-action-plans',
    UOMS = 'uoms',
    SENSORS = 'sensors',
    SIGMA_TYPES = 'sigmaTypes',
    GEN_VALUES_YES_NO = 'gen-values-yes-no',
    VARIABLE_BY_DEFAULT_DATE = 'variable-by-default-date',
    RESET_VALUE_MODES = 'variable-reset-value-modes',
    VARIABLE_VALUE_TYPES = 'variable-value-types',
    MOLD_LABEL_COLORS = 'mold-label-color',
    MOLD_STATES = 'mold-states',
    MOLD_CONTROL_STRATEGIES = 'mold-control-strategies',
    CHECKLIST_TEMPLATES_YELLOW = 'mold-checklist-templates-yellow',
    CHECKLIST_TEMPLATES_RED = 'mold-checklist-templates-red',
    CHECKLIST_TEMPLATES = 'checklist-templates',
    CHECKLIST_TEMPLATE_TYPES = 'checklist-template-types',
    CHECKLIST_TEMPLATE_MACROS = 'checklist-templates-macros',    
    CHECKLIST_TEMPLATE_NOTIFYING = 'checklist-template-notifying',    
    CHANNELS = 'channels',        
    RECIPIENTS = 'recipients',        
}

export enum GeneralValues {
    N_A = 'n/a',
    YES = 'y',
    NO = 'n',
    FREE_TEXT = 'free-text',
    SPECIFIC = 'specific',
    DASH = '-',
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
  
  export enum HarcodedVariableValueType {
    NUMERIC_RANGE = 'numeric-range',
    YES_NO = 'yes-no',
    YES_NO_NA = 'yes-no-na',
    LIST = 'list',
    FREE_TEXT = 'free-text',
    NUMBER = 'number',
    DATE = 'date',
    DATE_AND_TIME = 'date-and-time',
    TIME = 'time',
}