import { PageInfo } from "src/app/shared/models";

export interface MoldsData {
    molds?: Molds;
  }
  
  export interface Molds {
    items?: MoldItem[];
    pageInfo?: PageInfo;
    totalCount?: number;
  }
  
  export interface MoldItem {
    serialNumber?: string;
    description?: string;
    manufacturerId?: number;
    providerId?: number;
    manufacturingDate?: string;
    startingDate?: any
    MoldLastMaintenanceId?: any
    hits?: number;
    previousHits?: number;
    lastHit?: string;
    lastResettingId?: any
    thresholdType?: string;
    thresholdYellow?: number;
    thresholdRed?: number;
    thresholdState?: string;
    thresholdDateYellow?: number;
    thresholdDateRed?: number;
    receiverId?: number;
    label?: string;
    state?: string;
    nextMaintenance?: string;
    equipmentId?: number;
    lineId?: number;
    partNumberId?: number;
    position?: number;
    mainImagePath?: string;
    strategy?: string;
    lastLocationId?: any
    thresholdYellowDateReached?: any
    thresholdRedDateReached?: any
    id?: number;
    customerId?: number;
    status?: string;
    createdById?: any
    createdAt?: string;
    updatedById?: any
    updatedAt?: string;
    deletedById?: any
    deletedAt?: any
    deletedBy?: any
    updatedBy?: any
    createdBy?: any
    customer?: MoldRelateddata;
    lastLocation?: any
    partNumber?: MoldRelateddata;
    line?: MoldRelateddata;
    equipment?: MoldRelateddata;
    provider?: MoldRelateddata;
    lastResetting?: MoldLastResetting;
    lastMaintenance?: MoldLastMaintenance;
    manufacturer?: MoldRelateddata;
    receiver?: any
  }
  
  export interface MoldRelateddata {
    name?: string;
    reference?: string;
    id?: number;
    status?: string;
  }

  export interface MoldLastMaintenance {
    maintenanceDate?: string;
    state?: string;
    operatorName?: string;
    startDate?: string;
    finishedDate?: string;
    status?: string;        
    provider?: MoldRelateddata;
  }

  export interface MoldLastResetting {
    resettingDate?: string;
    user?: MoldRelateddata;
    userId?: number;
}
  
  export interface MoldsState {
    loading: boolean;
    moldsData: MoldsData;
}
