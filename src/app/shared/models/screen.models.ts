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

export interface ToolbarButtons  {
    type: 'button' | 'divider' | 'searchbox';
    caption: string;
    tooltip: string;
    icon: string;
    iconSize: string;
    class: string;
    disabled: boolean;
    locked: boolean;
    showCaption: boolean;
    showIcon: boolean;
    showTooltip: boolean;
}
export interface SharedState {
    screen: Screen;
}

export interface SearchBox {
    textToSearch: string;
    from: string;
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

export interface ToolbarElement {
    from: string;
    show: boolean;
    toolbarClass: string;
    dividerClass: string;
    buttons: ToolbarButtons[];
}

export enum ApplicationModules {
    MOLDS_HITS_VIEW = 'molds-hits-view',
    CHECKLIST_FILLING = 'checklist-filling',
    GENERAL = 'general',
}

export enum ScreenSizes {
    NORMAL = 'normal',
    SMALL = 'small',
}
