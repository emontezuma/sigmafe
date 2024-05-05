import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GeneralCatalogItem, GeneralCatalogParams } from 'src/app/catalogs';

@Component({
  selector: 'app-auto-complete-field',
  templateUrl: './auto-complete-field.component.html',
  styleUrls: ['./auto-complete-field.component.scss']
})
export class AutoCompleteFieldComponent implements OnInit, OnDestroy, OnChanges {
  
  @Input() formField: FormControl;  
  @Input() list: GeneralCatalogItem[];
  @Input() defaultValue?: any;
  @Input() placeHolder: string;
  @Input() totalCount: number;
  @Input() catalog: string;
  @Input() loading: boolean;
  @Input() noItemsError: string;  
  @Input() leftHint: string;  
  @Input() showDataState: boolean;    
  
  @Output() optionSelected = new EventEmitter<{ catalogName: string, selectedData: GeneralCatalogItem}>();
  @Output() getMoreData = new EventEmitter<GeneralCatalogParams>();

  textToSearch$: Observable<any>;
  private textToSearch: string;
  showError: boolean = false;

// Hooks ====================
  ngOnInit(): void {
    this.textToSearch$ = this.formField.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(textToSearch => {        
        if (this.textToSearch === (textToSearch?.name ?? textToSearch)) return;

        this.textToSearch = textToSearch?.name ?? textToSearch;
        
        this.getMoreData.emit({ 
          catalogName: this.catalog,
          textToSearch: this.textToSearch,
          initArray: true,
        });    
      })
    )
  }
  
  ngOnDestroy() {    
    if (this.optionSelected) this.optionSelected.unsubscribe();
    if (this.getMoreData) this.getMoreData.unsubscribe();
  }

  ngOnChanges() {
    console.log(!this.loading, this.list.length === 0 && !this.formField.value?.id);
    this.showError = (!this.loading && this.list.length === 0 && !this.formField.value?.id);
    if (this.showError) {
      this.formField.setErrors({ 'incorrect': true })
    } else {
      this.formField.setErrors(null);
    }
  }

// Functions ================
  onScroll() {
    this.getMoreData.emit({
      catalogName: this.catalog,
      textToSearch: this.textToSearch,
      initArray: false,
    });
  }

  onKey(event: any) {
    console.log('[onKey]', event);
  }

  displayFn(data: any): string {
    return data && data.name ? data.name : '';
  }

  handleOptionSelected(event: any) {
    this.optionSelected.emit({ 
      catalogName: this.catalog,
      selectedData: event?.option?.value,
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    
  }
  
// End ======================
}