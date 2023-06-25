import { createAction, props } from '@ngrx/store';
import { Screen } from '../../shared/models/screen.models';

export const changeScreenState = createAction(
    '[Shared] changeScreenState',
    props<{ screen: Screen }>()
);

export const setToolbar = createAction(
    '[Shared] SetToolbar',
    props<{ withToolbar: boolean }>()
);