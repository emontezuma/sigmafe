import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SimpleMenuOption, ButtonActions } from '../../models';

@Component({
  selector: 'app-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss']
})
export class ButtonMenuComponent {
  @Input() options: SimpleMenuOption[] = [];
  @Input() animatingQuestion: boolean;
  @Input() caption: string;      
  @Input() tooltip: string;      
  @Output() selection = new EventEmitter< { index: number, selection: string } >();

  selectedOption: SimpleMenuOption;

  constructor ( ) { }

// Hooks ====================
  ngOnInit(): void {
    this.selectedOption = this.options.find(option => option.default);    
  }

  ngOnDestroy() {
    if (this.selection) this.selection.unsubscribe();
  }

// Functions ================
  setOption(index: number, selection: string) {
    if (!selection && this.options?.length) {
      this.selectedOption = this.options[0];
    }
    this.selectedOption = this.options.find(option => option.value === selection);
    if (this.selectedOption) {
      this.selection.emit({ index, selection });
    }    
  }

  get ButtonActions() {
    return ButtonActions;
  }

// End ======================
}
