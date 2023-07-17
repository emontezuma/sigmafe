import { createReducer, on } from '@ngrx/store';
import * as colorsActions from '../actions/colors.actions';
import { ColorsState } from '../../shared/models/colors.models';

export const initialState: ColorsState = {
  loading: true,
  colorsData: {
    default: 'S',
    name: 'S',
    customized: 'S',
    fixed: 'S',
    selected: 'S',
    moldsHitsSpinner: [],
  }  
};

export const colorsReducer = createReducer(
  initialState,
  on(colorsActions.loadColorsData, ( state ) => ({ ...state, loading: true })),
  on(colorsActions.loadedColorsData, (state, { colorsData } ) => ({ ...state, loading: false, colorsData })),
);
  