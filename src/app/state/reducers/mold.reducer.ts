import { createReducer, on } from '@ngrx/store';
import * as moldActions from '../actions/mold.actions';
import { MoldState } from '../../molds/models';

export const initialState: MoldState = {
  loading: false,  
  moldDetail: {
    serialNumber: '',
    description: '',
    prefix: '',
    notes: '',
    reference: '',
    manufacturerId: 0,
    providerId: 0,
    manufacturingDate: '',
    startingDate: null,
    MoldLastMaintenanceId: 0,
    hits: 0,
    previousHits: 0,
    lastHit: '',
    lastResettingId: 0,
    thresholdType: '',
    thresholdYellow: 0,
    thresholdRed: 0,
    thresholdState: '',
    thresholdDaysYellow: 0,
    thresholdDaysRed: 0,
    receiverId: 0,
    label: '',
    state: '',
    nextMaintenance: '',
    equipmentId: 0,
    lineId: 0,
    partNumberId: 0,
    position: 0,
    mainImageGuid: '',
    mainImagePath: '',
    mainImageName: '',
    strategy: '',
    lastLocationId: 0,
    thresholdYellowDateReached: null,
    thresholdRedDateReached: null,
    id: 0,
    customerId: 0,
    status: '',
    createdById: 0,
    createdAt: '',
    updatedById: 0,
    updatedAt: '',
    deletedById: 0,
    deletedAt: 0,
    deletedBy: null,
    updatedBy: 0,
    createdBy: 0,
    lastLocation: null,
    lastResetting: null,
    lastMaintenance: null,
    manufacturer: null,
    provider: null,
    partNumber: null,
    moldType: null,
    moldClass: null,
    line: null,
    equipment: null,
    translations: [],
  }  
};

export const moldReducer = createReducer(
  initialState,
  on(moldActions.loadMoldData, ( state ) => ({
    ...state,
    loading: true,    
  })),

  on(moldActions.loadedMoldData, (state, { moldDetail } ) => ({
    ...state,
    moldDetail,
    loading: false,    
  })),  

  on(moldActions.updateMoldTranslations, (state, { translations } ) => ({    
    ...state,
    moldDetail: {
      ...state.moldDetail,
      translations: [...translations],
    },
  })),  
  
);
  