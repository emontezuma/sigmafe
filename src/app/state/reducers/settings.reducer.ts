import { createReducer, on } from '@ngrx/store';
import * as settingsActions from '../actions/settings.actions';
import { SettingsState } from '../../shared/models/settings.models';

export const initialState: SettingsState = {
  loading: true,
  settingsData: {
    waitingColor: 'gray',
    okColor: 'green',
    warningColor: '.orange',
    alarmedColor: 'red',
    levelAlert: {
      useGeneral: null,
      warning: 0,
      alarm: 0,
    },
    animate: false,
    timeOutFortDialog: 0,
    catalog: {
      pageSize: 50,
    },
    attachments: {
      variables: 10,
      checklistTemplateHeader: 5
    }
  },  
};

export const settingsReducer = createReducer(
  initialState,
  on(settingsActions.loadSettingsData, ( state ) => ({ ...state, loading: true })),
  on(settingsActions.loadedSettingsData, (state, { settingsData } ) => ({ ...state, loading: false, settingsData })),
);
  