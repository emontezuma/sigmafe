import { createAction, props } from '@ngrx/store';
import { ProfileData } from '../../shared/models/profile.models';

export const loadProfileData = createAction(
    '[Profile] Load Profile Data',
    props<{ userId: number }>()
)

export const loadedProfileData = createAction(
    '[Profile] Loaded Profile Data sucesssfully',
    props<{ profileData: ProfileData }>()
);
