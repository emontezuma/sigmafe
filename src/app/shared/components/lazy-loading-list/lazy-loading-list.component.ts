import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GeneralCatalogMappedItem, GeneralCatalogParams } from 'src/app/catalogs';
import { SystemTables } from '../../models/helpers.models';

@Component({
  selector: 'app-lazy-loading-list',
  templateUrl: './lazy-loading-list.component.html',
  styleUrls: ['./lazy-loading-list.component.scss']
})
export class LazyLoadingListComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('selection', { static: false }) selection: ElementRef;
  
  @Input() formField: FormControl;  
  // @Input() list: GeneralCatalogItem[];
  @Input() list: GeneralCatalogMappedItem[];  
  @Input() defaultValue?: any;
  @Input() placeHolder: string;
  @Input() totalCount: number;
  @Input() catalog: string;
  @Input() loading: boolean;
  @Input() noItemsError: string;  
  @Input() leftHint: string;  
  @Input() showDataState: boolean;   
  @Input() focused: boolean;   
  
  // @Output() optionSelected = new EventEmitter<{ catalogName: string, selectedData: GeneralCatalogItem}>();
  @Output() optionSelected = new EventEmitter<{ catalogName: string, selectedData: GeneralCatalogMappedItem}>();
  @Output() getMoreData = new EventEmitter<GeneralCatalogParams>();

  textToSearch$: Observable<any>;
  private textToSearch: string;
  showError: boolean = false;
  selectedOption: boolean = false;

// Hooks ====================
  ngOnInit(): void {
    this.textToSearch$ = this.formField.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(textToSearch => {        
        if (this.selectedOption) {
          this.selectedOption = false;
          return;
        }

        if (this.textToSearch === (textToSearch?.translatedName ?? textToSearch)) return;

        this.textToSearch = textToSearch?.translatedName ?? textToSearch;
        
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
    this.showError = (!this.loading && this.list.length === 0 && !this.formField.value?.id && this.formField.touched);
    if (this.showError) {
      this.formField.setErrors({ 'incorrect': true })
    } else {
      this.formField.setErrors(null);
    }
    if (this.focused) {
      setTimeout(() => {
        this.selection.nativeElement.focus();
      }, 50)
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
    return data && data.translatedName ? data.translatedName : '';
  }

  handleOptionSelected(event: any) {
    this.selectedOption = true;
    this.optionSelected.emit({ 
      catalogName: this.catalog,
      selectedData: event?.option?.value,      
    });
  }

  handleKeyDown(event: KeyboardEvent) { }

  get SystemTables () {
    return SystemTables;
  }
  
// End ======================
}
