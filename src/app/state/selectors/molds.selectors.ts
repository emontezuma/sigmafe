import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { MoldsState } from '../../molds/models/molds.models';

export const selectMoldsFeature = ( state: AppState ) => state.molds;

export const selectMoldsHitsQueryData = createSelector(
    selectMoldsFeature,
    (state: MoldsState) => state.moldsHitsQueryData
);

export const selectLoadingMoldsHitsState = createSelector(
    selectMoldsFeature,
    (state: MoldsState) => state.loading
);


  