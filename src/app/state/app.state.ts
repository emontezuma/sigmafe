import { ActionReducerMap } from "@ngrx/store";
import { SharedState } from "../shared/models/screen.models";
import { sharedReducer } from "./reducers/screen.reducer";

export interface AppState {
    shared: SharedState,
}

export const reducers: ActionReducerMap<AppState> = {
    shared: sharedReducer,
}
