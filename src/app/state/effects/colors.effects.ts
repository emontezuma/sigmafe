import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError, } from 'rxjs/operators';

import { ColorsService } from '../../shared/services/colors.service';
 
@Injectable()
export class ColorsEffects {
 
  loadSettings$ = createEffect(() => this.actions$.pipe(
    ofType('[Colors] Load Colors Data'),
    exhaustMap(() => this.colorsService.getSettingsData()
      .pipe(
        map(colorsData => ({ type: '[Colors] Loaded Colors Data sucesssfully', colorsData })),
        catchError(() => EMPTY)
      ))
    )
  );
 
  constructor (
    private actions$: Actions,
    private colorsService: ColorsService,
  ) { }
}