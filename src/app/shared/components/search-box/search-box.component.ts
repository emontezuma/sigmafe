import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms'
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {
  @Input() textToSearch: string;
  @Input() placeHolder: string;
  @Input() maxLength: string;
  @Output() searchBy = new EventEmitter<string>();

  textBox = new FormControl;
  
// Hooks ====================
  ngOnInit() {
    if (this.textToSearch) {
      this.textBox.setValue(this.textToSearch);  
    }
    if (!this.maxLength) {
      this.maxLength = "30";
    }
    this.textBox.valueChanges.pipe(debounceTime(200))
    .subscribe(changedValue => {
      this.searchBy.emit(changedValue);
    });    
  }

// End ======================
}