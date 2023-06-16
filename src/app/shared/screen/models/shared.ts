export interface ScreenObject  {
    size: string;
    availableHeight: number,
    availableWidth: number,
    height: number,
    innerHeight: number,
    innerWidth: number,
    orientation: string,
    outerHeight: number,
    outerWidth: number,
    width: number,
}

export interface Toolbar  {
    caption: string;
    tooltip: string,
    icon: string,
    primary: boolean,
}
export interface SharedState {
    screen: ScreenObject;
    withToolbar: boolean;
}