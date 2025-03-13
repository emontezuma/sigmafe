import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LineButton } from 'src/app/shared/models';

@Component({
  selector: 'app-question-toolbar',
  templateUrl: './question-toolbar.component.html',
  styleUrls: ['./question-toolbar.component.scss']
})
export class QuestionToolbarComponent {
  @Input() elements: LineButton[];
  @Output() buttonAction = new EventEmitter<string>();;

  constructor (    
  ) { }

// Hooks ====================
  ngOnDestroy() {
    if (this.buttonAction) this.buttonAction.unsubscribe();
  }

// Functions ================
  handleClick(action: string) {
    this.buttonAction.emit(action);
  }

// End ======================
}
