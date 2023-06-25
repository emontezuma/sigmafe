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
    caption: string;
    tooltip: string;
    icon: string;
    primary: boolean;
}
export interface SharedState {
    screen: Screen;
    withToolbar: boolean;
}
