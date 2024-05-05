import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { GeneralHardcodedValuesItem } from 'src/app/catalogs';
    
@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent {
  @Input() list: GeneralHardcodedValuesItem[];
  @Input() formField: FormControl;  
  @Input() leftHint: string;
  @Input() rightHint: string;
  @Input() fieldHelp: string;  
  @Input() currentErrorMessage: string;
  @Input() currentErrorIcon: string;
  @Input() fieldRequired: boolean;      
  @Input() showRightHint: boolean;  

  @Output() selectSelectionChange = new EventEmitter<MatSelectChange>();

// Hooks ====================

  ngOnInit(): void {
    console.log(this.list);
  }

// Functions ================
  handleSelectionChange(event: MatSelectChange) {
    this.selectSelectionChange.emit(event);
  }
  
// End ======================
}
