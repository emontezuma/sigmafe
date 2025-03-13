import { MoldDetail, MoldItem, MoldsData } from 'src/app/shared/models';

export interface MoldData {
  oneMold?: MoldItem;
  translations?: any;
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

export interface MoldFastQuery {
  reference?: string;
  description?: string;
  serialNumber?: string;
  partNumberName?: string;
  partNumberReference?: string;
  position?: number;
  hits?: number;
  lastHit?: string;  
}

export const emptyMoldFastQuery = {
  reference: '',
  description: '',
  serialNumber: '',
  partNumberName: '',
  partNumberReference: '',
  position: 0,
  hits: 0,
  lastHit: '' 
};
