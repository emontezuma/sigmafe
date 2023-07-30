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
      ok: Colors.green,
      warn: Colors.orange,
      alarm: Colors.orangered,
      none: Colors.none,
    },
    page: {
      fore: Colors.carbon,
      foreContrast: Colors.white,
      background: Colors.white,
      shadow: Colors.whitesmoke,
      buttonBorderColor: Colors.silver,
      buttonDisabledBorderColor: Colors.lightgrey,
      buttonNormalBackgroundColor: Colors.whitesmoke,
      footerFore: Colors.gray,
      footerBackground: Colors.whitesmoke,
      border: Colors.silver,      
      palettePrimaryColor: '#1e90ff',
      paletteWarnColor: '#00FF00',
      paletteAccentColor: '#FF0000',
      cardBackgroundColor: Colors.white,
      backgroundColor: Colors.whitesmoke,
      disabled: Colors.gray,
      none: Colors.none,
    },
  }  
};

export const colorsReducer = createReducer(
  initialState,
  on(colorsActions.loadColorsData, ( state ) => ({ ...state, loading: true })),
  on(colorsActions.loadedColorsData, (state, { colorsData } ) => ({ ...state, loading: false, colorsData })),
  on(colorsActions.updatePageColor, (state, { page } ) => ({ ...state, page })),
);
  