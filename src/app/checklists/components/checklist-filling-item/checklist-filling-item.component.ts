import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { ChecklistAnswerType, ChecklistFillingItem, ChecklistQuestionStatus } from '../../models/checklists.models';
import { AppState } from 'src/app/state/app.state';
import { updateChecklistQuestion } from 'src/app/state/actions/checklists.actions';
import { dissolve } from '../../../shared/animations/shared.animations';

@Component({
  selector: 'app-checklist-filling-item',
  templateUrl: './checklist-filling-item.component.html',
  animations: [ dissolve ],
  styleUrls: ['./checklist-filling-item.component.scss']
})
export class ChecklistFillingItemsComponent implements AfterViewInit, OnDestroy {
  @Input() item: ChecklistFillingItem;
  @Input() inactive: boolean;

  constructor (
    private store: Store<AppState>,    
  ) { }

// Hooks ====================
  ngAfterViewInit(): void {
    const chip = document.getElementsByName("chip");    
    chip.forEach((element) => {
      element?.style.setProperty('--mdc-chip-label-text-color', 'var(--theme-warn-contrast-500)');     
    });    
  }

  ngOnDestroy(): void {
    // Turn off the subscriptions    
  }

// Functions ================

  setAnswer(e: any) {    
    if(this.item.answerType === ChecklistAnswerType.YES_NO) {
      let answer = undefined;
      let status = ChecklistQuestionStatus.COMPLETED;
      let actionRequired = false;
      if (e !== undefined) {
        answer = e.value;
        if (this.item.attachmentRequired && !this.item.attachmentCompleted) {
          status = ChecklistQuestionStatus.ATTACHMENT_MISSING;
          actionRequired = true;
        }        
      } else {        
        status = ChecklistQuestionStatus.READY;
      }
      if (
        answer !== this.item.answer ||
        status !== this.item.status ||
        actionRequired !== this.item.actionRequired
      ) {
        const newItem: ChecklistFillingItem = { 
          ...this.item, 
          answer,
          status,
          actionRequired,
        };
        this.store.dispatch(updateChecklistQuestion({ item: newItem }));        
      }        
    }      
  }

// End ======================
}
