import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError, } from 'rxjs/operators';

import { ProfileService } from '../../shared/services/profile.service';
 
@Injectable()
export class ProfileEffects {
 
  loadProfile$ = createEffect(() => this.actions$.pipe(
    ofType('[Profile] Load Profile Data'),
    exhaustMap(() => this.profileService.getSettingsData()
      .pipe(
        map(profileData => ({ type: '[Profile] Loaded Profile Data sucesssfully', profileData })),
        catchError(() => EMPTY)
      ))
    )
  );
 
  constructor (
    private actions$: Actions,
    private profileService: ProfileService,
  ) { }
}