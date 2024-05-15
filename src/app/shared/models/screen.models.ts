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

export enum ButtonActions {
  START = 'start',
  NEW = 'new',
  SAVE = 'save',
  CANCEL = 'cancel',
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
  DELETE = 'delete',
  TRANSLATION = 'translation',
}

export interface ToolbarElement {
  type:
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
}
export interface SharedState {
  screen: Screen;
}

export interface SearchBox {
  textToSearch: string;
  from: string;
}

export interface SnackMessage {
  message: string;
  duration: number;
  snackClass: string;
  icon: string;
  buttonText: string;
  buttonIcon: string;
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
}

export enum ScreenSizes {
  NORMAL = 'normal',
  SMALL = 'small',
}

export enum toolbarMode {
  SAVE = 'save',
  CANCEL = 'cancel',
  COPY = 'copy',
  INACTIVATE = 'inactivate',
  ACTIVATE = 'activate',
  REMOVE = 'remove',
  INITIALIZE = 'initialize',
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
