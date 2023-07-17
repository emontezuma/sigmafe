import { createAction, props } from '@ngrx/store';
import { ColorsData } from '../../shared/models/colors.models';

export const loadColorsData = createAction(
    '[Colors] Load Colors Data'
)

export const loadedColorsData = createAction(
    '[Colors] Loaded Colors Data sucesssfully',
    props<{ colorsData: ColorsData }>()
);
