import { SafeResourceUrl } from "@angular/platform-browser";

export interface Attachment {
    index?: number;
    id?: string;
    icon?: string;    
    image?: string;    
    pdfUrl?: SafeResourceUrl;    
    name?: string;    
    containerType?: string;    
}

export interface SimpleTable {
    id?: string;
    code?: string;
    description?: string;
    name?: string;
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
    CATALOGS_PLANTS = 'catalogs-plants',    
    CATALOGS_COMPANIES = 'catalogs-companies',    
    CATALOGS_LINES = 'catalogs-lines',    
    CATALOGS_MANUFACTURERS = 'catalogs-manufacturers',    
    CATALOGS_PART_NUMBERS = 'catalogs-part-numbers',    
    CATALOGS_DEPARTMENTS = 'catalogs-departments',    
    CATALOGS_VARIABLES = 'catalogs-variables',
    CATALOGS_VARIABLES_ATTACHMENTS = 'catalogs-variables-attachments',
    CATALOGS_CHECKLIST_TEMPLATES = 'catalogs-checklist-templates',
    CATALOGS_CHECKLIST_TEMPLATE_HEADER_ATTACHMENTS = 'catalogs-checklist-template-header-attachments',
    CATALOGS_CHECKLIST_TEMPLATE_LINES_ATTACHMENTS = 'catalogs-checklist-template-lines-attachments',    
    CATALOGS_CHECKLIST_LINES_ATTACHMENTS = 'catalogs-checklist-lines-attachments',
    CATALOGS_CHECKLIST_ATTACHMENTS = 'catalogs-checklist-attachments',
    CATALOGS_CUSTOMERS = 'catalogs-custmomers',
    CATALOGS_WORKGROUPS = 'catalogs-workgroups',
    CATALOGS_PROVIDERS = 'catalogs-providers',
    CHECKLIST_ATTACHMENTS = 'checklist-attachments',
}
  
export enum SystemTables {
    PROVIDERS = 'providers',
    COMPANIES = 'companies',
    VARIABLES = 'variables',
    PLANTS = 'plants',
    USERS = 'users',
    MANUFACTURERS = 'manufacturers',
    LINES = 'lines',
    MOLD_MAINTENANCE_STATES = 'mold-maintenance-states',
    EQUIPMENTS = 'equipments',
    DEPARTMENTS = 'departments',
    WORKGROUPS = 'workgroups',
    POSITIONS = 'positions',
    PARTNUMBERS = 'partNumbers',
    PARTNUMBERS_QUERY = 'part-numbers',
    MOLD_TYPES = 'mold-types',
    MOLD_CLASSES = 'mold-classes',
    MOLDS = 'molds',    
    CHECKLIST_TEMPLATE_MOLDS = 'checklist-template-molds',
    CHECKLIST_PLANS_TEMPLATES = 'checklist-plans-template',
    VARIABLE_TEMPLATE_ACTION_PLANS = 'variable-template-action-plans',
    TEMPLATE_ACTION_PLANS = 'template-action-plans',
    UOMS = 'uoms',
    SENSORS = 'sensors',
    SIGMA_TYPES = 'sigmaTypes',
    GEN_VALUES_YES_NO = 'gen-values-yes-no',
    TABLE_NAMES = 'table-names',
    CHECKLIST_PLANS_FREQUENCIES = 'checklist-plans-frequencies',
    CHECKLIST_PLANS_GENERATION_MODES = 'checklist-plans-generation-modes',
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
    CHECKLIST_TEMPLATE_INITIAL_STATES = 'checklist-templates-initial-states',   
    USER_ROLES = "user-roles",
    PASSWORD_POLICIES = "password-policies",
    MOLDS_CATALOGS_MACROS = 'molds-catalog-macros',    
    CHECKLIST_TEMPLATE_NOTIFYING = 'checklist-template-notifying',    
    CHANNELS = 'channels',        
    RECIPIENTS = 'recipients',        
    CHECKLIST_PLAN_TYPES = 'checklist-plan-types',   
    MOLD_TEMPLATE_GM = 'mold-template-gm',
    REPORTS = 'reports',
}

export enum GeneralValues {
    N_A = 'n/a',
    YES = 'y',
    YESNO = 'yes-no',
    YES_AND_NO = 'yn',
    NO = 'n',
    FREE_TEXT = 'free-text',
    SPECIFIC = 'specific',
    DASH = '-',
    PLANNED = 'planned',
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
    BY_DEPARTMENT = 'by-department',
}

export enum HarcodedChecklistPlanGenerationMode {
    BY_DEPARTMENT = 'by-department',
    BY_POSITIONS = 'by-position',
    BY_WORKGROUP = 'by-workgroup',
    BY_USER = 'by-user',
}

export enum HarcodedChecklistReportPeriodOfTime {
    SPECIFIC = 'specific',
    CURRENT_YEAR = 'current-year',
    CURRENT_MONTH = 'current-month',
    CURRENT_WEEK = 'current-week',
    CURRENT_DAY = 'current-day',
    PREVIOUS_YEAR = 'previous-year',
    PREVIOUS_MONTH = 'previous-month',
    PREVIOUS_WEEK = 'previous-week',    
}