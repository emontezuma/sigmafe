import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { SharedState } from '../../shared/models/screen.models';

export const selectScreenFeature = ( state: AppState ) => state.shared;

export const selectWithToolbar = createSelector(
    selectScreenFeature,
    (state: SharedState) => state.withToolbar
);

export const selectSharedScreen = createSelector(
    selectScreenFeature,
    (state: SharedState) => state.screen
);


  