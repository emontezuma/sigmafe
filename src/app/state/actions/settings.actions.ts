import { createAction, props } from '@ngrx/store';
import { SettingsData } from '../../shared/models/settings.models';

export const loadSettingsData = createAction(
    '[Settings] Load Settings Data'
)

export const loadedSettingsData = createAction(
    '[Settings] Loaded Settings Data sucesssfully',
    props<{ settingsData: SettingsData }>()
);
