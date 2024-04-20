import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-question-toolbar',
  templateUrl: './question-toolbar.component.html',
  styleUrls: ['./question-toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() elements: any[];
  @Output() buttonAction = new EventEmitter<string>();;

  constructor (    
  ) { }

// Hooks ====================

// Functions ================
  handleClick(action: string) {
    this.buttonAction.emit(action);
  }

// End ======================
}
