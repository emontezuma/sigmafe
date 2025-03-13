import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import { ProfileService } from '../../shared/services/profile.service';
import { CatalogsService } from '../../catalogs/services/catalogs.service';
 
@Injectable()
export class ProfileEffects {
 
  loadProfile$ = createEffect(() => this.actions$.pipe(
    ofType('[Profile] Load Profile Data'),
    mergeMap((action: any) => {
      return this._profileService.getUserData$(action?.userId)
      .pipe(
        map((profileData) => {
          const profile = this._catalogsService.mapOneUser({
            userGqlData: profileData,  
            userGqlTranslationsData: null
          });      
          return { 
            type: '[Profile] Loaded Profile Data sucesssfully', profile 
          }
        }),
        catchError(() => EMPTY)
      )
    })
    )
  );
 
  constructor (
    private actions$: Actions,
    private _profileService: ProfileService,
    private _catalogsService: CatalogsService,
  ) { }
}