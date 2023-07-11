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
    availableHeight: number;
    availableWidth: number;
    height: number;
    innerHeight: number;
    innerWidth: number;
    orientation: string;
    outerHeight: number;
    outerWidth: number;
    width: number;
}

export interface ToolbarButtons  {
    type: 'button' | 'divider' | 'searchbox';
    caption: string;
    showTooltip: boolean;
    tooltip: string;
    showIcon: boolean;
    icon: string;
    iconSize: string;
    primary: boolean;
    disabled: boolean;
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

export interface ToolbarElement {
    from: string;
    show: boolean;
    buttons: ToolbarButtons[];
}

export enum ApplicationModules {
    MOLDS_HITS_VIEW = 'Molds-hits-view',
}


