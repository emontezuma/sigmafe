import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError, } from 'rxjs/operators';

import { ChecklistsService } from '../../checklists/services/checklists.service';
 
@Injectable()
export class ChecklistFillingEffects {
 
  loadChecklistFilling$ = createEffect(() => this.actions$.pipe(
    ofType('[Checklists] Load Checklist Filling Data'),
    exhaustMap(() => this.checklistsService.getChecklistFillingData()
      .pipe(
        map(checklistFillingData => ({ type: '[Checklists] Loaded Checklist Filling Data sucesssfully', checklistFillingData })),
        catchError(() => EMPTY)
      ))
    )
  );
 
  constructor(
    private actions$: Actions,
    private checklistsService: ChecklistsService,
  ) { }
}