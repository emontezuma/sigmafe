import { Component, EventEmitter, Input, Output, OnChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
    
@Component({
  selector: 'app-area-field',
  templateUrl: './area-field.component.html',
  styleUrls: ['./area-field.component.scss']
})
export class AreaFieldComponent implements OnChanges {
  @ViewChild('selection', { static: false }) selection: MatInput;
  private _fieldInputType = '';
  private _autosize = true;
  private _minRows = 1;
  private _maxRows = 1;

  @Input() get fieldInputType() {
    return this._fieldInputType;
  }
  set fieldInputType(value) {
    this._fieldInputType = value || 'text';
  }
  
  @Input() get autosize() {
    return this._autosize;
  }
  set autosize(value) {
    this._autosize = value || true;
  }

  @Input() get minRows() {
    return this._minRows;
  }
  set minRows(value) {
    this._minRows = value || 1;
  }

  @Input() get maxRows() {
    return this._maxRows;
  }
  set maxRows(value) {
    this._maxRows = value || 1;
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
  @Input() focused: boolean;
  @Input() bordered: boolean;  

  @Output() inputKeydown = new EventEmitter<KeyboardEvent>();

// Hooks ====================
  
  ngOnDestroy() {
    if (this.inputKeydown) this.inputKeydown.unsubscribe();
  }

  ngOnChanges() {
    if (this.focused) {
      setTimeout(() => {
        this.selection.focus();
      }, 50)
    }
  }

// Functions ================
  handleInput(event: any) {
    this.inputKeydown.emit(event);
  }
  
// End ======================
}
