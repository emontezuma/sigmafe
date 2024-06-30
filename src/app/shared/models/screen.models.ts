export interface Platform {
  ANDROID: boolean;
  BLINK: boolean;
  EDGE: boolean;
  FIREFOX: boolean;
  IOS: boolean;
  SAFARI: boolean;
  TRIDENT: boolean;
  WEBKIT: boolean;
  isBrowser: boolean;
}
export interface Screen {
  platform: Platform;
  size: string;
  innerHeight: number;
  innerWidth: number;
  orientation: string;
  outerHeight: number;
  outerWidth: number;
  allHeight?: number;
}

export enum dialogByDefaultButton {
  ACCEPT = 'accept',
  ACCEPT_AND_CANCEL = 'accept-and-cancel',
}

export enum ButtonActions {
  START = 'start',
  NEW = 'new',
  SAVE = 'save',
  CANCEL = 'cancel',
  CLOSE = 'close',
  COPY = 'copy',
  EXPORT_TO_EXCEL = 'exportToExcel',
  EXPORT_TO_CSV = 'exportToCsv',
  RELOAD = 'reload',
  UPLOAD_FILE = 'uploadFile',
  RESET = 'reset',
  ALL = 'all',
  WARNED = 'warned',
  ALARMED = 'alarmed',
  YELLOW = 'yellow',
  RED = 'red',
  DODGERBLUE = 'dodgerblue',
  ORANGE = 'orange',
  GREEN = 'green',
  BACK = 'back',
  INACTIVATE = 'inactivate',
  REACTIVATE = 'rectivate',
  DELETE = 'delete',
  TRANSLATIONS = 'translations',
  MACROS = 'macros',
  INITIALIZE = 'initialize',
  OK = 'ok',
}
export interface ToolbarElement {
  id?: string;
  type?:
    | 'button'
    | 'divider'
    | 'searchbox'
    | 'button-menu'
    | 'label'
    | 'spinner'
    | string;
  field?: string;
  caption?: string;
  tooltip?: string;
  icon?: string;
  iconSize?: string;
  class?: string;
  elementType?: string;
  classAlarmed?: string;
  disabled?: boolean;
  locked?: boolean;
  showCaption?: boolean;
  showIcon?: boolean;
  showTooltip?: boolean;
  action?: ButtonActions;
  loading?: boolean;
  alignment?: 'left' | 'right' | string;
  options?: SimpleMenuOption[];
  showBadge?: boolean;
  badgeText?: string;
  badgeSize?: any;
  badgeStyle?: any;

}
export interface SharedState {
  screen: Screen;
}

export interface SearchBox {
  textToSearch: string;
  from: string;
}

export interface SnackMessage {
  message?: string;
  duration?: number;
  snackClass?: string;
  icon?: string;
  buttonText?: string;
  buttonIcon?: string;
  showProgressBar?: boolean;
  progressBarColor?: string;

}

export interface ToolbarButtonClicked {
  action: ButtonActions | undefined;
  from: string;
  buttonIndex: number;
  field: string;
}

export interface ShowElement {
  from: string;
  show: boolean;
}

export interface AnimationStatus {
  fromState: string;
  toState: string;
  isFinished: boolean;
}

export interface GoTopButtonStatus {
  from: string;
  status: string;
}

export interface ToolbarControl {
  from: string;
  show: boolean;
  showSpinner?: boolean;
  toolbarClass?: string;
  dividerClass?: string;
  elements: ToolbarElement[];
  alignment?: string;
}

export enum ApplicationModules {
  MOLDS_HITS_VIEW = 'molds-hits-view',
  CHECKLIST_FILLING = 'checklist-filling',
  GENERAL = 'general',
  MOLDS_CATALOG = 'molds-catalog',
  MOLDS_CATALOG_EDITION = 'molds-catalog-edition',
  VARIABLES_CATALOG = 'variables-catalog',
  VARIABLES_CATALOG_EDITION = 'variables-catalog-edition',
  CUSTOMERS_CATALOG = 'customers-catalog',
  CUSTOMERS_CATALOG_EDITION = 'customers-catalog-edition',
  MANUFACTURERS_CATALOG = 'manufacturers-catalog',
  MANUFACTURERS_CATALOG_EDITION = 'manufacturers-catalog-edition',
  PLANTS_CATALOG = 'plants-catalog',
  PLANTS_CATALOG_EDITION = 'plants-catalog-edition',
  COMPANIES_CATALOG = 'companies-catalog',
  COMPANIES_CATALOG_EDITION = 'companies-catalog-edition',
  PROVIDERS_CATALOG = 'providers-catalog',
  PROVIDERS_CATALOG_EDITION='providers-catalog-edition',
  CHEKLIST_TEMPLATES_CATALOG = 'checklist-templates-catalog',
  CHEKLIST_TEMPLATES_CATALOG_EDITION = 'checklist-templates-edition',
  EQUIPMENTS_CATALOG = 'equipments-catalog',
  EQUIPMENTS_CATALOG_EDITION = 'equipments-catalog-edition',
  DEPARTMENTS_CATALOG = 'departments-catalog',
  DEPARTMENTS_CATALOG_EDITION = 'departments-catalog-edition',
  UOMS_CATALOG = 'uoms-catalog',
  UOMS_CATALOG_EDITION = 'uoms-catalog-edition',
  POSITIONS_CATALOG = 'positions-catalog',
  POSITIONS_CATALOG_EDITION = 'positions-catalog-edition',
  PART_NUMBERS_CATALOG = 'part-numbers-catalog',
  PART_NUMBERS_CATALOG_EDITION = 'part-numbers-catalog-edition',
  LINES_CATALOG = 'lines-catalog',
  LINES_CATALOG_EDITION = 'lines-catalog-edition',
  TABLES_CATALOG = 'tables-catalog',
  TABLES_CATALOG_EDITION = 'tables-catalog-edition',
}

export enum ScreenSizes {
  NORMAL = 'normal',
  SMALL = 'small',
}

export enum toolbarMode {
  EDITING_WITH_DATA = 'editing-with-data',
  EDITING_WITH_NO_DATA = 'editing-with-no-data',  
  INITIAL_WITH_DATA = 'normal-with-data',
  INITIAL_WITH_NO_DATA = 'normal-with-no-data',
}

export interface SimpleMenuOption {
  icon?: string;
  caption?: string;
  template?: string;
  value: string;
  default?: boolean;
}

export interface ButtonState {
  action?: ButtonActions;
  enabled: boolean;
}
