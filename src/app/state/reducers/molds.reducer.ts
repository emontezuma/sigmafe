import { createReducer, on } from '@ngrx/store';
import * as moldsActions from '../actions/molds.actions';
import { MoldsState } from '../../molds/models/molds.models';

export const initialState: MoldsState = {
  loading: false,
  moldsHitsQueryData: {
    molds: [],
    page: 0,
    pageSize: 0,
    moreData: false,
    totalRecords: 0,
  }  
};

export const moldsReducer = createReducer(
  initialState,
  on(moldsActions.loadMoldsHitsQueryData, ( state ) => ({ ...state, loading: true })),
  on(moldsActions.loadedMoldsHitsQueryData, (state, { moldsHitsQueryData } ) => ({ ...state, loading: false, moldsHitsQueryData })),
);
  