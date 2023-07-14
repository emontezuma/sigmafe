import { createAction, props } from '@ngrx/store';
import { MoldsHitsQueryData } from '../../molds/models/molds.models';

export const loadMoldsHitsQueryData = createAction(
    '[Molds] Load Molds Data'
)

export const loadedMoldsHitsQueryData = createAction(
    '[Molds] Loaded Molds Data sucesssfully',
    props<{ moldsHitsQueryData: MoldsHitsQueryData }>()
);
