import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { MoldsHitsState } from '../../molds/models';

export const selectMoldsHitsFeature = ( state: AppState ) => state.moldsHits;

export const selectMoldsHitsQueryData = createSelector(
    selectMoldsHitsFeature,
    (state: MoldsHitsState) => state.moldsHitsQueryData.data
);

export const selectLoadingMoldsHitsState = createSelector(
    selectMoldsHitsFeature,
    (state: MoldsHitsState) => state.loading
);
  