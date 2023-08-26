import { createAction, props } from '@ngrx/store';
import { ChecklistFillingData, ChecklistFillingItem } from '../../checklists/models/checklists.models';

export const loadChecklistFillingData = createAction(
    '[Checklists] Load Checklist Filling Data'
)

export const loadedChecklistFillingData = createAction(
    '[Checklists] Loaded Checklist Filling Data sucesssfully',
    props<{ checklistFillingData: ChecklistFillingData }>()
);

export const updateChecklistQuestion = createAction(
    '[Checklists] Update Checklist Question',
    props<{ item: ChecklistFillingItem }>()
);
