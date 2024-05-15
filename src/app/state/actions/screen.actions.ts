import { createAction, props } from '@ngrx/store';
import { Screen } from '../../shared/models/screen.models';

export const changeScreenState = createAction(
    '[Shared] changeScreenState',
    props<{ screen: Screen }>()
);

export const changeScreenAllHeight = createAction(
    '[Shared] changeScreenAllHeight',
    props<{ allHeight: number }>()
);
