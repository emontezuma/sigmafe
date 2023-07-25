export enum Colors {
    GREEN = 'green',
    BLACK = 'black',
    WHITE = 'white',
    CARBON = '#505050',
    ORANGE = 'orange',
    ORANGERED = 'orangered',
    RED = 'red',
    GRAY = 'lightgray',
    SILVER = 'silver',
    PRIMARY = 'dodgerblue',
    DODGERBLUE = 'dodgerblue',
    BLUE = 'blue',
    NONE = 'none',
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

export interface StatusColors {
    ok: string,
    warn: string,
    alarm: string,
    none: string,
}

export interface PagesColors {
    fore: string,
    foreContrast: string,
    background: string,
    shadow: string,
    buttonBorderColor: string,
    primary: string,
    disabled: string,
    border: string,
    none: string,
}

export interface FixedColors {
    white: string,
    carbon: string,    
    red: string,    
    green: string,    
    gray: string,    
    orange: string,    
    orangered: string,    
    dodgerblue: string,    
    blue: string,    
    black: string,   
}

export interface ColorsData {
    id: string,
    default: string,
    name: string,
    customized: string,
    fixed: string,
    selected: string,
    status: StatusColors,   
    page: PagesColors,
    fixedColors: FixedColors,
}

export interface ColorsState {
    loading: boolean,
    colorsData: ColorsData,
}
