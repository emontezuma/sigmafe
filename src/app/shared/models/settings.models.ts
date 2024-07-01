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
    timeOutFortDialog: number;
    catalog: SettingsCatalog;
    checklistTemplate?: SettingChecklistTemplate;
    attachments?: SettingAttachments;
}

export interface SettingsState {
    loading: boolean;
    settingsData: SettingsData;
}

export interface SettingsCatalog {
    pageSize?: number;    
}

export interface SettingAttachments {
    variables?: number;    
    checklistTemplateHeader?: number;    
}

export interface SettingChecklistTemplate {
    variablesLimit?: number;        
}