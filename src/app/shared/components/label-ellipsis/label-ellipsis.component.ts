import { Component, Input } from '@angular/core';
    
@Component({
  selector: 'app-label-ellipsis',
  templateUrl: './label-ellipsis.component.html',
  styleUrls: ['./label-ellipsis.component.scss']
})
export class LabelEllipsisComponent {
  @Input() label: string;
  @Input() lines: number;

// Functions ================
  activateTooltip(e: HTMLElement) {    
    return Math.abs(e.offsetHeight - e.scrollHeight) < 5;
  }
  
// End ======================
}
