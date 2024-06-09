import { Component, EventEmitter, Input, Output, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
    
@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnChanges {
  @ViewChild('selection', { static: false }) selection: ElementRef;
  
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
  @Input() bordered: boolean;  
  @Input() focused: boolean;     
  @Input() rightSuffix: string;       

  @Output() inputKeydown = new EventEmitter<KeyboardEvent>();

// Hooks ====================
  ngOnDestroy() {
    if (this.inputKeydown) this.inputKeydown.unsubscribe();
  }

  ngOnChanges(): void { 
    if (this.focused) {
      setTimeout(() => {
        this.selection.nativeElement.focus();
        console.log('focused')
      }, 100)
    }
  }

// Functions ================
  handleInput(event: any) {
    this.inputKeydown.emit(event);
  }
  
// End ======================
}
