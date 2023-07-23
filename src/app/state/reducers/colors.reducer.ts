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
    status: {
      ok: Colors.GREEN,
      warn: Colors.ORANGE,
      alarm: Colors.REDORANGE,
      none: Colors.NONE,
    },
    page: {
      fore: Colors.CARBON,
      foreContrast: Colors.WHITE,
      background: Colors.WHITE,
      shadow: Colors.GRAY,
      buttonBorderColor: Colors.SILVER,
      primary: Colors.GREEN,
      none: Colors.NONE,
    },
    fixedColors: {
      white: Colors.WHITE,
      carbon: Colors.CARBON,    
      red: Colors.REDORANGE,    
      green: Colors.GREEN,    
      gray: Colors.GRAY,  
    },
  }  
};

export const colorsReducer = createReducer(
  initialState,
  on(colorsActions.loadColorsData, ( state ) => ({ ...state, loading: true })),
  on(colorsActions.loadedColorsData, (state, { colorsData } ) => ({ ...state, loading: false, colorsData })),
);
  