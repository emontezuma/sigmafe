import { ActionReducerMap } from "@ngrx/store";
import { SharedState } from "../shared/models/screen.models";
import { sharedReducer } from "./reducers/screen.reducer";
import { MoldsState } from "../molds/models/molds.models";
import { moldsReducer } from "./reducers/molds.reducer";
import { SettingsState } from "../shared/models/settings.models";
import { settingsReducer } from "./reducers/settings.reducer";

export interface AppState {
    shared: SharedState,
    molds: MoldsState,
    settings: SettingsState,
}

export const reducers: ActionReducerMap<AppState> = {
    shared: sharedReducer,
    molds: moldsReducer,
    settings: settingsReducer,
}
