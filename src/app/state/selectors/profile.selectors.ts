import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { ProfileState } from '../../shared/models/profile.models';

export const selectProfileFeature = ( state: AppState ) => state.profile;

export const selectProfileData = createSelector(
    selectProfileFeature,
    (state: ProfileState) => state.profileData
);

export const selectLoadingProfileState = createSelector(
    selectProfileFeature,
    (state: ProfileState) => state.loading
);
