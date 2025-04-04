import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms'
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {
  @Input() textToSearch: string;
  @Input() placeHolder: string;
  @Input() maxLength: string;
  @Input() formField: FormControl;          
  @Output() searchBy = new EventEmitter<string>();

  
// Hooks ====================
  ngOnInit() {
    if (this.textToSearch) {
      this.formField.setValue(this.textToSearch);  
    }
    if (!this.maxLength) {
      this.maxLength = "30";
    }
    this.formField.valueChanges.pipe(debounceTime(200))
    .subscribe(changedValue => {
      this.searchBy.emit(changedValue);
    });    
  }

  ngOnDestroy() {
    if (this.searchBy) this.searchBy.unsubscribe();
  }

// End ======================
}