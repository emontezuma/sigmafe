import { Component, EventEmitter, Input, Output, ViewChild, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { GeneralHardcodedValuesItem } from 'src/app/catalogs';
    
@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent implements OnChanges {
  @ViewChild('selection', { static: false }) selection: MatSelect;

  @Input() list: GeneralHardcodedValuesItem[];
  @Input() formField: FormControl;  
  @Input() leftHint: string;
  @Input() rightHint: string;
  @Input() fieldHelp: string;  
  @Input() currentErrorMessage: string;
  @Input() currentErrorIcon: string;
  @Input() fieldRequired: boolean;      
  @Input() showRightHint: boolean;  
  @Input() selectType: string;  
  @Input() focused: boolean;  

  @Output() selectSelectionChange = new EventEmitter<MatSelectChange>();

// Variables ================
  selectedLanguageImage: string = '';
  formFieldSubscription: Subscription;

// Hooks ====================

  ngOnInit(): void { 
    this.formFieldSubscription = this.formField.valueChanges.subscribe((selection) => {
      if (this.selectType === 'countries') {
        this.selectedLanguageImage = `assets/icons/languageFlag_${this.formField.value}.png`;
      }
    })
  }

  ngOnChanges(): void { 
    if (this.focused) {
      setTimeout(() => {
        this.selection.focus();
      }, 50)
    }
  }

  ngOnDestroy() {
    if (this.selectSelectionChange) this.selectSelectionChange.unsubscribe();
    if (this.formFieldSubscription) this.formFieldSubscription.unsubscribe();
  }

// Functions ================
  handleSelectionChange(event: MatSelectChange) {
    this.selectSelectionChange.emit(event);    
  }

  getItemField(id: number, field: string) {
    const item = this.list.find(item => item.id === id);
    if (item && item[field]) {
      return item[field];
    }
    
    return null;
  }

  changeImageByError(index: number) {
    if (index === 0) {
      this.selectedLanguageImage = 'assets/icons/languageFlag.png';
    } else {
      this.list[index].mainImagePath = 'assets/icons/languageFlag.png';
    }    
  }
  
// End ======================
}
