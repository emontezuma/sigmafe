import { createAction, props } from '@ngrx/store';
import { MoldsData } from '../../molds/models/molds.models';

export const loadMoldsData = createAction(
    '[Molds] Load Molds Data'
)

export const loadedMoldsData = createAction(
    '[Molds] Loaded Molds Data sucesssfully',
    props<{ moldsData: MoldsData }>()
);
