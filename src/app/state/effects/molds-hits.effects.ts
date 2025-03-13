import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import { MoldsService } from '../../molds/services/molds.service';
import { MoldsHitsQueryData } from 'src/app/molds';
import { environment } from 'src/environments/environment';
 
@Injectable()
export class MoldsHitsEffects {
  loadMoldsHits$ = createEffect(() => this.actions$.pipe(
    ofType('[Molds] Load Molds Hits Data'),
    mergeMap(() => this._moldsService.getMoldsHitsQueryDataGql$()
      .pipe(
        map((moldsHitsQueryGqlData: any) => {
          const dataMapped = moldsHitsQueryGqlData?.data?.moldsUnlimited.map((item) => {
            const extension = item.data.mainImageName ? item.data.mainImageName.split('.').pop() : '';
            return {
              ...item,
              data: {
                ...item.data,                            
                mainImage: item.data.mainImageName ? `${environment.serverUrl}/${environment.uploadFolders.completePathToFiles}/${item.data.mainImagePath}` : '',
              }
            }
          });
          const moldsHitsQueryData: MoldsHitsQueryData = {
            pageInfo: null,
            data: dataMapped,
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