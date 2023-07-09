import { LevelAlert } from "src/app/shared/models/settings.models";

export interface LastMaintenance {
    vendorName: string;
    date: string;
    nextMaintenance: string;
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

export interface Mold {
    id: string;
    name: string;
    hits: number;
    limit: number;
    mainImage: string;
    location: Location;
    lastMaintenance: LastMaintenance;
    levelAlert: LevelAlert;
    leftDaysWarning: number;
    leftDaysAlarmed: number;
    status: SimpleTable;
}

export interface MoldsData {
    molds: Mold[];
    page: number;
    pageSize: number;
    moreData: boolean;
}

export interface MoldsState {
    loading: boolean;
    moldsData: MoldsData;
}

