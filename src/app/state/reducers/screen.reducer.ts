import { createReducer, on } from '@ngrx/store';
import * as sharedActions from '../actions/screen.actions';
import { SharedState } from '../../shared/models/screen.models';

export const initialState: SharedState = {
  screen: {
    platform: {
      ANDROID: false,
      BLINK: false,
      EDGE: false,
      FIREFOX: false,
      IOS: false,
      SAFARI: false,
      TRIDENT: false,
      WEBKIT: false,
      isBrowser: false,
    },
    size: '',
    availableHeight: 0,
    availableWidth: 0,
    height: 0,
    innerHeight: 0,
    innerWidth: 0,
    orientation: '',
    outerHeight: 0,
    outerWidth: 0,
    width: 0,
  },
  withToolbar: false,
};

export const sharedReducer = createReducer(
  initialState,
  on(sharedActions.changeScreenState, (state, { screen } ) => ({ ...state, screen })),
  on(sharedActions.setToolbar, (state, { withToolbar } ) => ({ ...state, withToolbar })),
);
  