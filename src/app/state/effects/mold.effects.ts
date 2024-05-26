import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import { CatalogsService } from '../../catalogs/services/catalogs.service';
 
@Injectable()
export class MoldEffects {  
  loadMold$ = createEffect(() => this.actions$.pipe(    
    ofType('[Mold] Load Mold Data'),
    mergeMap((action: any) => this._catalogsService.getMoldDataGql$({ 
      moldId: action.moldId, 
      skipRecords: action.skipRecords, 
      takeRecords: action.takeRecords, 
      order: action.order, 
      filter: action.filter 
    }).pipe(        
      map(([ moldGqlData, moldGqlTranslationsData ]) => {
        const moldDetail = this._catalogsService.mapOneMold({
          moldGqlData, 
          moldGqlTranslationsData,
        });      
        return {
          type: '[Mold] Loaded Mold Data sucesssfully', moldDetail 
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