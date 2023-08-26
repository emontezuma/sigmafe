import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state'; 
import { ChecklistFillingState } from '../../checklists/models/checklists.models';

export const selectChecklistFillingFeature = ( state: AppState ) => state.checklistFilling;

export const selectChecklistFillingData = createSelector(
    selectChecklistFillingFeature,
    (state: ChecklistFillingState) => state.checklistFillingData
);

export const selectLoadingChecklistFillingState = createSelector(
    selectChecklistFillingFeature,
    (state: ChecklistFillingState) => state.loading
);


  