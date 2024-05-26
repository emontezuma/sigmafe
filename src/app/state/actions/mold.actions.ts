import { createAction, props } from '@ngrx/store';
import { MoldDetail } from '../../molds/models';

export const loadMoldData = createAction(
    '[Mold] Load Mold Data',
    props<{ moldId: number, skipRecords: number, takeRecords: number, order?: any, filter?: any }>()
)

export const loadedMoldData = createAction(
    '[Mold] Loaded Mold Data sucesssfully',
    props<{ moldDetail: MoldDetail }>()
);

export const updateMoldTranslations = createAction(
    '[Mold] Update Mold Translations',
    props<{ translations: any[] }>()
);
