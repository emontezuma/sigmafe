import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { MoldsState } from '../../molds/models/molds.models';

export const selectMoldsFeature = ( state: AppState ) => state.molds;

export const selectMoldsData = createSelector(
    selectMoldsFeature,
    (state: MoldsState) => state.moldsData
);

export const selectLoadingState = createSelector(
    selectMoldsFeature,
    (state: MoldsState) => state.loading
);


  