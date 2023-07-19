import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { ColorsState } from '../../shared/models/colors.models';

export const selectColorsFeature = ( state: AppState ) => state.colors;

export const selectColorsData = createSelector(
    selectColorsFeature,
    (state: ColorsState) => state.colorsData
);

export const selectLoadingColorsState = createSelector(
    selectColorsFeature,
    (state: ColorsState) => state.loading
);
