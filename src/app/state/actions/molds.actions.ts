import { createAction, props } from '@ngrx/store';
import { MoldsData } from '../../molds/models';

export const loadMoldsData = createAction(
    '[Molds] Load Molds Data',
    props<{ skipRecords: number, takeRecords: number, order?: any }>()
)

export const loadedMoldsData = createAction(
    '[Molds] Loaded Molds Data sucesssfully',
    props<{ moldsData: MoldsData }>()
);
