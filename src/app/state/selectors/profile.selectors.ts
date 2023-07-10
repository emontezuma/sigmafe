import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { ProfileState } from '../../shared/models/profile.module';

export const selectProfileFeature = ( state: AppState ) => state.profile;

export const selectProfileData = createSelector(
    selectProfileFeature,
    (state: ProfileState) => state.profileData
);

export const selectLoadingState = createSelector(
    selectProfileFeature,
    (state: ProfileState) => state.loading
);
