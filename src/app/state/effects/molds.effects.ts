import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError, } from 'rxjs/operators';

import { MoldsService } from '../../molds/services/molds.service';
 
@Injectable()
export class MoldsEffects {
 
  loadMolds$ = createEffect(() => this.actions$.pipe(
    ofType('[Molds] Load Molds Data'),
    exhaustMap(() => this.moldsService.getMoldsData()
      .pipe(
        map(moldsData => ({ type: '[Molds] Loaded Molds Data sucesssfully', moldsData })),
        catchError(() => EMPTY)
      ))
    )
  );
 
  constructor(
    private actions$: Actions,
    private moldsService: MoldsService,
  ) { }
}