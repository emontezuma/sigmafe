import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { SettingsState } from '../../shared/models/settings.models';

export const selectSettingsFeature = ( state: AppState ) => state.settings;

export const selectSettingsData = createSelector(
    selectSettingsFeature,
    (state: SettingsState) => state.settingsData
);

export const selectLoadingSettingsState = createSelector(
    selectSettingsFeature,
    (state: SettingsState) => state.loading
);
