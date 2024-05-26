import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { MoldState } from '../../molds/models';

export const selectMoldFeature = ( state: AppState ) => state.mold;

export const selectMoldData = createSelector(
    selectMoldFeature,
    (state: MoldState) => state.moldDetail
);

export const selectLoadingMoldState = createSelector(
    selectMoldFeature,
    (state: MoldState) => state.loading
);

export const selectMoldTranslationsState = createSelector(
    selectMoldFeature,
    (state: MoldState) => state.moldDetail.translations
);
  