import { MoldStates } from "src/app/shared/models/screen.models";
import { MoldLastMaintenance } from "./molds.models";
import { PageInfo } from "src/app/shared/models/helpers.models";

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
    id?: string;
    description?: string;
    hits?: number;
    previousHits?: number;
    thresholdRed?: number;
    mainImagePath?: string;
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
