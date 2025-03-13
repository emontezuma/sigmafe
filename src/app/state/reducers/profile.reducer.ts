import { createReducer, on } from '@ngrx/store';
import * as profileActions from '../actions/profile.action';
import { ProfileState } from '../../shared/models/profile.models';

export const initialState: ProfileState = {
  loading: false,
  profileData: {
    id: null,
    customerId: null,
    languageId: null,
    animate: true,
    name: '',
    roles: '',
    mainImage: '',
    email: '',
  }  
};

export const profileReducer = createReducer(
  initialState,
  on(profileActions.loadProfileData, ( state ) => ({ ...state, loading: true })),
  on(profileActions.loadedProfileData, (state, { profileData } ) => (
    { ...state, loading: false, profileData }
  )),
);
  