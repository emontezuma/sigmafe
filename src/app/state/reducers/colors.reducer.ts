import { createReducer, on } from '@ngrx/store';
import * as colorsActions from '../actions/colors.actions';
import { Colors, ColorsState } from '../../shared/models/colors.models';

export const initialState: ColorsState = {
  loading: true,
  colorsData: {
    id: '',
    default: 'S',
    name: 'S',
    customized: 'S',
    fixed: 'S',
    selected: 'S',
    status: {},
    page: {},
  }  
};

export const colorsReducer = createReducer(
  initialState,
  on(colorsActions.loadColorsData, ( state ) => ({ ...state, loading: true })),
  on(colorsActions.loadedColorsData, (state, { colorsData } ) => ({ ...state, loading: false, colorsData })),
  on(colorsActions.updatePageColor, (state, { page } ) => ({ ...state, page })),
);
  