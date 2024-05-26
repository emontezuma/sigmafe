import { createReducer, on } from '@ngrx/store';
import * as moldsActions from '../actions/molds.actions';
import { MoldsState } from '../../molds/models';

export const initialState: MoldsState = {
  loading: false,
  moldsData: {
    moldsPaginated: {
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
      moldsPaginated: {
        ...moldsData.moldsPaginated,
        pageInfo: {
          ...moldsData.moldsPaginated.pageInfo,
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
        ...state.moldsData.moldsPaginated,
        pageInfo: {
          ...state.moldsData.moldsPaginated.pageInfo,
          forcedUpdate: false,
        }
      }
    }
  })),
  
);
  