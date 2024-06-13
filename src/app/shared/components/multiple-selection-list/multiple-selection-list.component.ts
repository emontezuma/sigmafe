import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SystemTables, GeneralCatalogMappedItem, GeneralCatalogParams, SimpleTable, GeneralValues } from '../../models';
import { MatSelectChange } from '@angular/material/select';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-multiple-selection-list',
  templateUrl: './multiple-selection-list.component.html',
  styleUrls: ['./multiple-selection-list.component.scss']
})
export class MultipleSelectionListComponent {
  @ViewChild('selection', { static: false }) selection: ElementRef;
  @ViewChild("multipleSelection", { static: false }) multipleSelection: MatSelectionList;
  
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
  multiSelectionForm = new FormGroup({
    searchInput: new FormControl(''),
  });
  selections: SimpleTable[] = [];
  
// Hooks ====================
  ngOnInit(): void {
    this.selections = this.getSelectOptions();
    this.textToSearch$ = this.multiSelectionForm.controls.searchInput.valueChanges.pipe(
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
    if (this.focused) {
      setTimeout(() => {
        this.selection.nativeElement.focus();
      }, 50)
    }
  }

// Functions ================
handleSelectionChange(event: MatSelectChange) {
  
}

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

  chengeSelection(event: any) { }

  get SystemTables () {
    return SystemTables;
  }

  getSelectOptions(): SimpleTable[] {
    if (this.catalog === SystemTables.CHECKLIST_TEMPLATES_YELLOW || this.catalog === SystemTables.CHECKLIST_TEMPLATES_RED) {
      return [
        { id: 'y', description: $localize`TODOS los Templates de checklist activos` },  
        { id: 'n', description: $localize`Los Templates de checklist de la lista` },  
      ]
    }
    return [];    
  }

  selectItem(item: any) {
    if (this.formField.value !== GeneralValues.YES) {
      item.valueRight = !!item.valueRight ? null : item.id;
    }    
    console.log(item);
  }
  
// End ======================
}
