import { createAction, props } from '@ngrx/store';
import { ProfileData } from '../../shared/models/profile.module';

export const loadProfileData = createAction(
    '[Profile] Load Profile Data'
)

export const loadedProfileData = createAction(
    '[Profile] Loaded Profile Data sucesssfully',
    props<{ profileData: ProfileData }>()
);
