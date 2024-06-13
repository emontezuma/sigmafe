import { GeneralTranslatedFields, MoldLastMaintenance } from 'src/app/shared/models';
import { PageInfo } from 'src/app/shared/models';

export interface MoldNextMaintenance {
    strategy: 'hits' | 'days' | 'hours' | 'specific-date' | 'hits-or-hours' | 'hits-or-days';    
    specificDate: string;
    hits: number | null;
    days: number | null;
    hours: number | null;
    timeToLeft: number | null;
    hitsToLeft: number | null;
    alarmed: boolean | undefined | null;
}

export interface MoldLastHit {
    location: string;
    date: string;
}
export interface MoldLocation {
    code: string;
    description: string;
    locatedBy: string | null;
    locatedSince: string | null;
}

export interface MoldHitsQuery {
    data: MoldHitsDetail;
    isTranslated?: boolean;
    friendlyState?: string;
    translatedDescription?: string;
    translatedPartNumber?: GeneralTranslatedFields; 
}

export interface MoldHitsDetail {
    id?: string;
    description?: string;
    hits?: number;
    previousHits?: number;
    thresholdRed?: number;
    mainImage?: string;
    mainImagePath?: string;
    mainImageGuid?: string;
    mainImageName?: string;
    position?: number;
    label?: string;
    lastMaintenance?: MoldLastMaintenance;
    nextMaintenance?: MoldNextMaintenance;
    thresholdDateYellow?: number;
    thresholdDateRed?: number;
    thresholdState?: string;
    lastHit?: string;
    status?: string; // SimpleTable;    
    state?: MoldStates; // SimpleTable;    
    strategy?: string;
    partNumber?: PartNumber;
    index?: number;
    updateHits?: boolean;
    elapsedTimeLabel: string;
}

export interface PartNumber {
    id: number
    status: string
    customerId: number
    name: string
    reference: string
  }

export interface MoldsHitsQueryData {
    data: MoldHitsQuery[];
    pageInfo?: PageInfo;
    totalCount?: number;
  }

export interface MoldsHitsState {
    loading: boolean;
    moldsHitsQueryData: MoldsHitsQueryData;
}

export enum MoldTresholdState {
    YELLOW = 'yellow',
    RED = 'red',
}

export enum MoldLabelColor {
    YELLOW = 'yellow',
    GREEN = 'green',
    RED = 'red',
    DODGERBLUE = 'dodgerblue',
    ORANGE = 'orange',
}

export enum MoldStates {
    IN_PRODUCTION = 'in-production',
    IN_WAREHOUSE = 'in-warehouse',
    IN_REPAIRING = 'in-reparing',
    OUT_OF_SERVICE = 'out-of-service',
  }
