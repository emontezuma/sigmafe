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
    innerHeight: 0,
    innerWidth: 0,
    orientation: '',
    outerHeight: 0,
    outerWidth: 0,
  },
};

export const sharedReducer = createReducer(
  initialState,
  on(sharedActions.changeScreenState, (state, { screen } ) => ({ ...state, screen })),
);
  