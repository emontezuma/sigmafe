import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
    
@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {
  private _fieldInputType = '';

  @Input() get fieldInputType() {
    return this._fieldInputType;
  }
  set fieldInputType(value) {
    this._fieldInputType = value || 'text';
  }

  @Input() formField: FormControl;  
  @Input() leftHint: string;
  @Input() rightHint: string;
  @Input() fieldHelp: string;  
  @Input() currentErrorMessage: string;
  @Input() currentErrorIcon: string;  
  @Input() showCloseButton: boolean;  
  @Input() fieldRequired: boolean;    
  @Input() fieldMaxLength: number;    
  @Input() showRightHint: boolean;  
  @Input() initialFocus: boolean;    

  @Output() inputKeydown = new EventEmitter<KeyboardEvent>();

// Hooks ====================
  ngOnDestroy() {
    if (this.inputKeydown) this.inputKeydown.unsubscribe();
  }

// Functions ================
  handleInput(event: any) {
    this.inputKeydown.emit(event);
  }
  
// End ======================
}
