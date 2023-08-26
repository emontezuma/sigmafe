import { SimpleTable } from "src/app/shared/models/helpers.models";
import { LevelAlert } from "src/app/shared/models/settings.models";

export interface NextMaintenance {
    strategy: 'hits' | 'days' | 'hours' | 'specific-date' | 'hits-or-hours' | 'hits-or-days';    
    specificDate: string;
    hits: number | null;
    days: number | null;
    hours: number | null;
    timeToLeft: number | null;
    hitsToLeft: number | null;
    alarmed: boolean | undefined | null;
}

export interface LastMaintenance {
    vendorName: string | null;
    date: string | null;
}

export interface LastHit {
    location: string;
    date: string;
}
export interface Location {
    code: string;
    description: string;
    locatedBy: string | null;
    locatedSince: string | null;
}

export interface MoldHitsQuery {
    id: string;
    name: string;
    hits: number | null;
    limit: number | null;
    mainImage: string;
    location: Location | null;
    lastMaintenance: LastMaintenance | null;
    nextMaintenance: NextMaintenance | null;
    levelAlert: LevelAlert | null | undefined;
    leftDaysWarning: number;
    leftDaysAlarmed: number;
    lastHit: LastHit | null;
    status: SimpleTable | null;
    warned: boolean | undefined | null;
    alarmed: boolean | undefined | null;
}

export interface MoldsHitsQueryData {
    molds: MoldHitsQuery[];
    page: number;
    pageSize: number;
    moreData: boolean;
    totalRecords: number;
}

export interface MoldsState {
    loading: boolean;
    moldsHitsQueryData: MoldsHitsQueryData;
}

