import { createReducer, on } from '@ngrx/store';
import * as moldsActions from '../actions/molds-hits.actions';
import { MoldsHitsState } from '../../molds/models';

export const initialState: MoldsHitsState = {
  loading: false,
  moldsHitsQueryData: {
    data: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
    totalCount: 0,
  }  
};

export const moldsHitsReducer = createReducer(
  initialState,
  on(moldsActions.loadMoldsHitsQueryData, ( state ) => ({ ...state, loading: true })),
  
  on(moldsActions.loadedMoldsHitsQueryData, (state, { moldsHitsQueryData } ) => ({ ...state, loading: false, moldsHitsQueryData })),

  on(moldsActions.updateMoldsHitsData, (state, { hitMold } ) => {
    const updatedMolds = state.moldsHitsQueryData?.data?.map((mold) => {
      if (mold.data.id == hitMold.id) {
       return { 
          ...mold,
          data: {
            ...mold.data,
            hits: hitMold.hits,
            previousHits: hitMold.previousHits,
            lastHit: hitMold.lastHit,          
            thresholdState: hitMold.thresholdState,
            label: hitMold.label,
            thresholdRed: hitMold.thresholdRed,
            mainImagePath: hitMold.mainImagePath,
            status: hitMold.status,
            state: hitMold.state,
          }
        }
      }
      return mold;
    });

    const moldsHitsQueryData = {
      ...state.moldsHitsQueryData,
      data: updatedMolds,
    }
    
    return {
      ...state,
      moldsHitsQueryData,
    }
  }),
);
  