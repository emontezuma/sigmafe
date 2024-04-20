import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import { MoldsService } from '../../molds/services/molds.service';
 
@Injectable()
export class MoldsEffects {
  loadMolds$ = createEffect(() => this.actions$.pipe(
    ofType('[Molds] Load Molds Data'),
    mergeMap((action: any) => this._moldsService.getMoldsDataGql$(action.skipRecords, action.takeRecords, action.order)
      .pipe(        
        map((moldsGqlData: any) => {
          const moldsData = moldsGqlData?.data;
          console.log(moldsData);
          return {
            type: '[Molds] Loaded Molds Data sucesssfully', moldsData 
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