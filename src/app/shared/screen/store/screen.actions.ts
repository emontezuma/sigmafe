import { createAction, props } from '@ngrx/store';
import { ScreenObject } from '../models/store/shared';

export const changeScreenState = createAction(
    '[Shared] changeScreenState',
    props<{ screenSize: ScreenObject }>()
);

export const setToolbar = createAction(
    '[Shared] SetToolbar',
    props<{ withToolbar: boolean }>()
);