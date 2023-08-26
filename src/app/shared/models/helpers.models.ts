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

