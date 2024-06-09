import {
  GeneralCatalogMappedItem,
  GeneralTranslatedFields,
} from 'src/app/catalogs/models';
import { GeneralTranslation } from 'src/app/catalogs/models/generics.models';
import { PageInfo } from 'src/app/shared/models';

export interface MoldsData {
  moldsPaginated?: Molds;
}

export interface MoldData {
  oneMold?: MoldItem;
  translations?: any;
}

export interface Molds {
  items?: MoldItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface MoldItem {
  friendlyStatus?: string;
  friendlyState?: string;
  friendlyThresholdState?: string;
  friendlyThresholdType?: string;
  friendlyStrategy?: string;
  friendlyLabel?: string;
  isTranslated?: boolean;
  translatedReference: string;
  translateddescription?: string;
  translatedNotes?: string;
  translatedPartNumber?: GeneralTranslatedFields;
  translatedLine?: GeneralTranslatedFields;
  translatedEquipment?: GeneralTranslatedFields;
  translatedLastMaintenance?: GeneralTranslatedFields;
  translatedManufacturer?: GeneralTranslatedFields;
  translatedLastResetting?: GeneralTranslatedFields;
  translatedProvider?: GeneralTranslatedFields;
  translatedLocation?: GeneralTranslatedFields;
  translatedMoldType?: GeneralTranslatedFields;
  translatedMoldClass?: GeneralTranslatedFields;
  data: MoldDetail;
}

export interface MoldDetail {
  serialNumber?: string;
  description?: string;
  prefix?: string;
  notes?: string;
  reference?: string;
  manufacturerId?: number;
  providerId?: number;
  manufacturingDate?: string;
  startingDate?: any;
  moldLastMaintenanceId?: any;
  hits?: number;
  previousHits?: number;
  lastHit?: string;
  lastResettingId?: any;
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
  mainImageGuid?: string;
  mainImagePath?: string;
  mainImageName?: string;
  mainImage?: string;
  strategy?: string;
  lastLocationId?: any;
  thresholdYellowDateReached?: any;
  thresholdRedDateReached?: any;
  id?: number;
  customerId?: number;
  status?: string;
  createdById?: any;
  createdAt?: string;
  updatedById?: any;
  updatedAt?: string;
  deletedById?: any;
  deletedAt?: any;
  deletedBy?: any;
  updatedBy?: any;
  createdBy?: any;
  lastLocation?: any;
  lastResetting?: MoldLastResetting;
  lastMaintenance?: MoldLastMaintenance;
  manufacturer?: GeneralCatalogMappedItem;
  provider?: GeneralCatalogMappedItem;
  partNumber?: GeneralCatalogMappedItem;
  moldType?: GeneralCatalogMappedItem;
  moldClass?: GeneralCatalogMappedItem;
  line?: GeneralCatalogMappedItem;
  equipment?: GeneralCatalogMappedItem;
  translations?: GeneralTranslation[];
}

export interface MoldLastMaintenance {
  maintenanceDate?: string;
  state?: string;
  operatorName?: string;
  startDate?: string;
  finishedDate?: string;
  status?: string;
  provider?: GeneralCatalogMappedItem;
}

export interface MoldLastResetting {
  resettingDate?: string;
  user?: GeneralCatalogMappedItem; //TODO Elvis
  userId?: number;
}

export interface MoldsState {
  loading: boolean;
  moldsData: MoldsData;
}

export interface MoldState {
  loading: boolean;
  moldDetail: MoldDetail;
}

export interface MoldCatalog {
  id: string;
  description: string;
  mainImagePath: string;
  serialNumber: string;
  label: string;
  state: string;
  status: string;
  updatedAt: string;
}

export const emptyMoldCatalog = {
  friendlyState: null,
  friendlyStatus: null,
  data: {
    id: null,
    description: null,
    mainImagePath: null,
    serialNumber: null,
    label: null,
    state: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyMoldItem: MoldDetail = {
  serialNumber: null,
  description: null,
  prefix: null,
  notes: null,
  reference: null,
  manufacturerId: null,
  providerId: null,
  manufacturingDate: null,
  startingDate: null,
  moldLastMaintenanceId: null,
  hits: null,
  previousHits: null,
  lastHit: null,
  lastResettingId: null,
  thresholdType: null,
  thresholdYellow: null,
  thresholdRed: null,
  thresholdState: null,
  thresholdDateYellow: null,
  thresholdDateRed: null,
  receiverId: null,
  label: null,
  state: null,
  nextMaintenance: null,
  equipmentId: null,
  lineId: null,
  partNumberId: null,
  position: null,
  mainImagePath: null,
  mainImageName: null,
  mainImage: null,
  strategy: null,
  lastLocationId: null,
  thresholdYellowDateReached: null,
  thresholdRedDateReached: null,
  id: null,
  customerId: null,
  status: null,
  createdById: null,
  createdAt: null,
  updatedById: null,
  updatedAt: null,
  deletedById: null,
  deletedAt: null,
  deletedBy: null,
  updatedBy: null,
  createdBy: null,
  lastLocation: null,
  lastResetting: null,
  lastMaintenance: null,
  manufacturer: null,
  translations: [],
};
