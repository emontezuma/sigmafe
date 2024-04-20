export interface Platform {
    ANDROID: boolean,
    BLINK: boolean,
    EDGE: boolean,
    FIREFOX: boolean,
    IOS: boolean,
    SAFARI: boolean,
    TRIDENT: boolean,
    WEBKIT: boolean,
    isBrowser: boolean,
}

export interface Screen  {
    platform: Platform,
    size: string;
    innerHeight: number;
    innerWidth: number;
    orientation: string;
    outerHeight: number;
    outerWidth: number;
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
}

export enum MoldStates {
    IN_PRODUCTION = 'in-production',
    IN_WAREHOUSE = 'in-warehouse',
    IN_REPAIRING = 'in-reparing',
    OUT_OF_SERVICE = 'out-of-service',
}
export interface ToolbarElement  {
    type: 'button' | 'divider' | 'searchbox' | 'button-menu' | 'label' | 'spinner' ;
    field?: string; 
    caption?: string;
    tooltip?: string;
    icon?: string;
    iconSize?: string;
    class?: string;
    classAlarmed?: string;
    disabled?: boolean;
    locked?: boolean;
    showCaption?: boolean;
    showIcon?: boolean;
    showTooltip?: boolean;
    action?: ButtonActions;
    loading?: boolean;
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

export interface animationStatus {
    fromState: string;
    toState: string;
    isFinished: boolean
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
}

export enum ScreenSizes {
    NORMAL = 'normal',
    SMALL = 'small',
}

export interface SimpleMenuOption {
    icon?: string;    
    caption?: string;
    template?: string;
    value: string;
    default?: boolean;
}

