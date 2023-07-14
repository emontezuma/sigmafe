import { LevelAlert } from "src/app/shared/models/settings.models";

export interface NextMaintenance {
    strategy: 'hits' | 'days' | 'hours' | 'specific-date' | 'hits-or-hours' | 'hits-or-days';    
    specificDate: string;
    hits: number;
    days: number;
    hours: number;
    timeToLeft: number;
    hitsToLeft: number;
    alarmed: boolean;
}

export interface LastMaintenance {
    vendorName: string;
    date: string;
}

export interface LastHit {
    location: string;
    date: string;
}
export interface Location {
    code: string;
    description: string;
    locatedBy: string;
    locatedSince: string;
}

export interface SimpleTable {
    code: string;
    description: string;
}

export interface MoldHitsQuery {
    id: string;
    name: string;
    hits: number;
    limit: number;
    mainImage: string;
    location: Location;
    lastMaintenance: LastMaintenance;
    nextMaintenance: NextMaintenance;
    levelAlert: LevelAlert;
    leftDaysWarning: number;
    leftDaysAlarmed: number;
    lastHit: LastHit;
    status: SimpleTable;
    warned: boolean;
    alarmed: boolean;
}

export interface MoldsHitsQueryData {
    molds: MoldHitsQuery[];
    page: number;
    pageSize: number;
    moreData: boolean;
    totalRecs: number;
}

export interface MoldsState {
    loading: boolean;
    moldsHitsQueryData: MoldsHitsQueryData;
}

