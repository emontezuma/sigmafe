export enum Colors {
    GREEN = 'green',
    BLACK = '#000',
    WHITE = '#FFF',
    CARBON = '#505050',
    ORANGE = 'orange',
    REDORANGE = 'orangered',
    RED = 'red',
}

export interface SpinnerLimits {
    start: number,
    finish: number,
}

export interface SpinnerFonts {
    start: number,
    finish: number,
    size: number,
    weight: number,
}

export interface ColorVariable {
    variableName: string,
    color: string,
}

export interface SmallFont {
    size: number,
    weight: number,
}

export interface ColorsData {
    default: string,
    name: string,
    customized: string,
    fixed: string,
    selected: string,
    moldsHitsSpinner: ColorVariable[],
}

export interface ColorsState {
    loading: boolean;
    colorsData: ColorsData;
}
