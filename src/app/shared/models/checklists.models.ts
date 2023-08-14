export enum ChecklistAnswerType {
    YES_NO = 'yesNo',
    YES_NO_NA = 'yesNoNa',
    FRM_TABLE = 'frmTable',
    FREE_FORM = 'freeForm',
}

export enum ChecklistAnswerDataType {
    DATE = 'date',    
    DATE_AND_TIME = 'dateAndTime',
    DATE_RANGE = 'dateRange',
    TIME = 'time',
    TEXT = 'text',
    NUMBER = 'number',
    FROM_COMBO = 'fromCombo',
}

export enum ChecklistAnswerDataValidator {        
    REQUIRED = 'required',    
    MIN_VALUE = 'minValue',
    MAX_VALUE = 'maxValue',
    MAX_MIN = 'maxMin',
    MIN_LENGTH = 'minLength',
    MAX_LENGTH = 'maxLength',
    ATTACHMENT_REQUIRED = 'attachtmentRequired',
}

export enum ChecklistAnswerAttachmentValidator {        
    ANY = 'any',
    IMAGE = 'image',
    VIDEO = 'video',
    PDF = 'pdf',   
    DOCUMENT = 'document',
    SPREADSHEET = 'spreadsheet',
    PRESENTATION = 'presentation',
}

export enum ChecklistVisualHelperSupported {        
    IMAGE = 'image',
    VIDEO = 'video',
    PDF = 'pdf',    
}

export enum ChecklistAnswerStatus {
    NOT_INITIATED = 'notInitiated',
    INITIATED = 'initiated',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    ATTACHMENT_REQUIRED = 'attachmentRequired',
}

export enum ChecklistView {
    ONE_QUESTION_PER_PAGE = 'oneQuestionByPage',
    INFINITE_LIST = 'infiniteList',
    TABLE = 'table',
    FLEXBOX = 'flexbox',    
}
