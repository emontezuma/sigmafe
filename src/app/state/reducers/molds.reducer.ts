import { createReducer, on } from '@ngrx/store';
import * as moldsActions from '../actions/molds.actions';
import { MoldsState } from '../../molds/models';

export const initialState: MoldsState = {
  loading: false,
  moldsData: {
    molds: {
      items: [],      
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    }
  }  
};

export const moldsReducer = createReducer(
  initialState,
  on(moldsActions.loadMoldsData, ( state, { skipRecords, takeRecords} ) => ({
    ...state,
    loading: true,
    skipRecords,
    takeRecords,
  })),
  on(moldsActions.loadedMoldsData, (state, { moldsData } ) => ({
    ...state,
    loading: false,
    moldsData: {
      ...moldsData,
      molds: {
        ...moldsData.molds,
        pageInfo: {
          ...moldsData.molds.pageInfo,
          forcedUpdate: true,
        }
      }
    }
  })),
  on(moldsActions.prepareForcedUpdateFlag, ( state ) => ({ 
    ...state,        
    moldsData: {
      ...state.moldsData,
      molds: {
        ...state.moldsData.molds,
        pageInfo: {
          ...state.moldsData.molds.pageInfo,
          forcedUpdate: false,
        }
      }
    }
  })),
);
  