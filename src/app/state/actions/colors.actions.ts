import { createAction, props } from '@ngrx/store';
import { ColorsData, PageColors } from '../../shared/models/colors.models';

export const loadColorsData = createAction(
    '[Colors] Load Colors Data'
)

export const loadedColorsData = createAction(
    '[Colors] Loaded Colors Data sucesssfully',
    props<{ colorsData: ColorsData }>()
);

export const updatePageColor = createAction(
    '[Colors] Update page colors',
    props<{ page: PageColors }>()
);
