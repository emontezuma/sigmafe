import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import { CatalogsService } from '../../catalogs/services/catalogs.service';
 
@Injectable()
export class MoldsEffects {  
  loadMolds$ = createEffect(() => this.actions$.pipe(    
    ofType('[Molds] Load Molds Data'),
    mergeMap((action: any) => this._catalogsService.getMoldsDataGql$(
      action.skipRecords,
      action.takeRecords,
      action.order,
      action.filter
    ).pipe(
      map((moldsGqlData: any) => {
        const moldsData = moldsGqlData?.data;
        return {
          type: '[Molds] Loaded Molds Data sucesssfully', moldsData 
        }
      }),
      catchError(() => EMPTY)
    ))
  ));

  constructor (
    private actions$: Actions,
    private _catalogsService: CatalogsService,
  ) { }
}