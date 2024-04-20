import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import { MoldsService } from '../../molds/services/molds.service';
import { MoldsHitsQueryData } from 'src/app/molds';
 
@Injectable()
export class MoldsHitsEffects {
  loadMoldsHits$ = createEffect(() => this.actions$.pipe(
    ofType('[Molds] Load Molds Hits Data'),
    mergeMap(() => this._moldsService.getMoldsHitsQueryDataGql$()
      .pipe(
        map((moldsHitsQueryGqlData: any) => {          
          const moldsHitsQueryData: MoldsHitsQueryData = {
            pageInfo: null,
            data: moldsHitsQueryGqlData?.data?.moldsUnlimited,
            totalCount: moldsHitsQueryGqlData?.data?.moldsUnlimited?.length,          }
          
          return {
            type: '[Molds] Loaded Molds Hits Data sucesssfully', moldsHitsQueryData 
          }
          
        }),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor (
    private actions$: Actions,
    private _moldsService: MoldsService,
  ) { }
}