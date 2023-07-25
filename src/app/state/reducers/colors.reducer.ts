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
      alarm: Colors.ORANGERED,
      none: Colors.NONE,
    },
    page: {
      fore: Colors.CARBON,
      foreContrast: Colors.WHITE,
      background: Colors.WHITE,
      shadow: Colors.GRAY,
      buttonBorderColor: Colors.SILVER,
      border: Colors.SILVER,      
      primary: Colors.GREEN,
      disabled: Colors.GRAY,
      none: Colors.NONE,
    },
    fixedColors: {
      white: Colors.WHITE,
      carbon: Colors.CARBON,    
      red: Colors.ORANGERED,    
      green: Colors.GREEN,    
      gray: Colors.GRAY,  
      blue: Colors.BLUE,  
      dodgerblue: Colors.DODGERBLUE,  
      orange: Colors.ORANGE,  
      orangered: Colors.ORANGERED,  
      black: Colors.BLACK,  
    },
  }  
};

export const colorsReducer = createReducer(
  initialState,
  on(colorsActions.loadColorsData, ( state ) => ({ ...state, loading: true })),
  on(colorsActions.loadedColorsData, (state, { colorsData } ) => ({ ...state, loading: false, colorsData })),
);
  