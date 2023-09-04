import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-question-toolbar',
  templateUrl: './question-toolbar.component.html',
  styleUrls: ['./question-toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() buttons: any[];

  constructor (    
  ) { }

// Hooks ====================

// Functions ================
  handleClick(id: number) {
    
  }

// End ======================
}
