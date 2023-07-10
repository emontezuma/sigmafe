export interface LevelAlert {
    useGeneral: boolean | null,
    warning: number,
    alarm: number,
}

export interface SettingsData {
    waitingColor: string;
    okColor: string;
    warningColor: string;
    alarmedColor: string;
    levelAlert: LevelAlert;
    animate: boolean;
}

export interface SettingsState {
    loading: boolean;
    settingsData: SettingsData;
}