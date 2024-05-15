import { createAction, props } from '@ngrx/store';
import { MoldHitsDetail, MoldsHitsQueryData } from '../../molds/models';

export const loadMoldsHitsQueryData = createAction(
    '[Molds] Load Molds Hits Data'
);

export const loadedMoldsHitsQueryData = createAction(
    '[Molds] Loaded Molds Hits Data sucesssfully',
    props<{ moldsHitsQueryData: MoldsHitsQueryData }>()
);

export const updateMoldsHitsData = createAction(
    '[Molds] Update Molds Hits Data',
    props<{ hitMold: MoldHitsDetail }>()
);
