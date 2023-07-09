import { createReducer, on } from '@ngrx/store';
import * as moldsActions from '../actions/molds.actions';
import { MoldsState } from '../../molds/models/molds.models';

export const initialState: MoldsState = {
  loading: false,
  moldsData: {
    molds: [],
    page: 0,
    pageSize: 0,
    moreData: false,
  }  
};

export const moldsReducer = createReducer(
  initialState,
  on(moldsActions.loadMoldsData, ( state ) => ({ ...state, loading: true })),
  on(moldsActions.loadedMoldsData, (state, { moldsData } ) => ({ ...state, loading: false, moldsData })),
);
  