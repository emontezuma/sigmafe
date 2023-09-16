export interface Attachment {
    index: number;
    id: string;
    icon: string;    
}

export interface SimpleTable {
    code: string;
    description?: string;
}

export interface Priority {
    code: string;
    number?: number;
    order?: string;
    description?: string;
}

export enum RecordStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    READY_TO_BE_PURGED = 'readyToBePurged',
}

export interface DatesDifference {
    message: string,
    totalSeconds: number,
    seconds: string,
    minutes: string,
    hours: string,
    days: string,
}

export enum CapitalizationMethod {
    UPPERCASE = 'uppercase',
    LOWERCASE = 'lowercase',
    FIRST_LETTER_PHRASE = 'firstLetterPhrase',  
    FIRST_LETTER_WORD = 'firstLetterWord',  
}  
