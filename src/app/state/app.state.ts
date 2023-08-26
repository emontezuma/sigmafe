import { ActionReducerMap } from "@ngrx/store";
import { SharedState } from "../shared/models/screen.models";
import { sharedReducer } from "./reducers/screen.reducer";
import { MoldsState } from "../molds/models/molds.models";
import { moldsReducer } from "./reducers/molds.reducer";
import { SettingsState } from "../shared/models/settings.models";
import { settingsReducer } from "./reducers/settings.reducer";
import { ProfileState } from "../shared/models/profile.models";
import { profileReducer } from "./reducers/profile.reducer";
import { ColorsState } from "../shared/models/colors.models"
import { colorsReducer } from "./reducers/colors.reducer";
import { ChecklistFillingState } from "../checklists/models/checklists.models";
import { checklistFillingReducer } from "./reducers/checklists.reducer";

export interface AppState {
    shared: SharedState,
    molds: MoldsState,
    settings: SettingsState,
    profile: ProfileState,
    colors: ColorsState,
    checklistFilling: ChecklistFillingState,
}

export const reducers: ActionReducerMap<AppState> = {
    shared: sharedReducer,
    molds: moldsReducer,
    settings: settingsReducer,
    profile: profileReducer,
    colors: colorsReducer,
    checklistFilling: checklistFillingReducer,
}
