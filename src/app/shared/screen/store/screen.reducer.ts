import { createReducer, on } from '@ngrx/store';
import * as sharedActions from './shared.actions';
import { SharedState } from '../models/store/shared';

export const initialState: SharedState = {
  screen: {
    size: "",
    availableHeight: 0,
    availableWidth: 0,
    height: 0,
    innerHeight: 0,
    innerWidth: 0,
    orientation: "",
    outerHeight: 0,
    outerWidth: 0,
    width: 0,
  },
  withToolbar: false,
};

const _sharedReducer = createReducer(
  initialState,
  on(sharedActions.changeScreenState, (state, { screenSize } ) => ({ ...state, screenSize })),
  on(sharedActions.setToolbar, (state, { withToolbar } ) => ({ ...state, withToolbar })),
);

export function sharedReducer(state, action) {
  return _sharedReducer(state, action);
}
  