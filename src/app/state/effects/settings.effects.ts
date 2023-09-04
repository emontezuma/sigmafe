import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError, } from 'rxjs/operators';

import { SettingsService } from '../../shared/services/settings.service';
 
@Injectable()
export class SettingsEffects {
 
  loadSettings$ = createEffect(() => this.actions$.pipe(
    ofType('[Settings] Load Settings Data'),
    exhaustMap(() => this.settingsService.getSettingsData()
      .pipe(
        map(settingsData => ({ type: '[Settings] Loaded Settings Data sucesssfully', settingsData })),
        catchError(() => EMPTY)
      ))
    )
  );
 
  constructor (
    private actions$: Actions,
    private settingsService: SettingsService,
  ) { }
}