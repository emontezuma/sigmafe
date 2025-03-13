import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, ViewChild, AfterViewInit, ElementRef, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, startWith, tap, throttleTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SystemTables, GeneralCatalogMappedItem, GeneralCatalogParams, SimpleTable, GeneralValues, GeneralMultipleSelcetionItems } from '../../models';
import { MatSelectChange } from '@angular/material/select';
import { CdkScrollable } from "@angular/cdk/scrolling";

@Component({
  selector: 'app-multiple-selection-list',
  templateUrl: './multiple-selection-list.component.html',
  styleUrls: ['./multiple-selection-list.component.scss']
})
export class MultipleSelectionListComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('selection', { static: false }) selection: ElementRef;
  @ViewChild("multipleSelection", { read: ElementRef } ) multipleSelection: ElementRef;
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
  
  @Input() formField: FormControl;  
  // @Input() list: GeneralCatalogItem[];
  @Input() list: GeneralCatalogMappedItem[];  
  @Input() currentSelections: GeneralMultipleSelcetionItems[];  
  @Input() defaultValue?: string;
  @Input() defaultSearchText?: string;
  @Input() placeHolder: string;
  @Input() totalCount: number;
  @Input() catalog: string;
  @Input() loading: boolean;
  @Input() focused: boolean;   
  @Input() bordered: boolean;   
  @Input() showSelect: boolean;     
  @Input() selectOptions: SimpleTable[];   
  
  // @Output() optionSelected = new EventEmitter<{ catalogName: string, selectedData: GeneralCatalogItem}>();
  @Output() multipleSelectionChanged = new EventEmitter<string>();
  @Output() getMoreData = new EventEmitter<GeneralCatalogParams>();
  
  textToSearch$: Observable<any>;
  scroll$: Observable<any>;

  private textToSearch: string;
  selectedOption: boolean = false;
  multiSelectionForm = new FormGroup({
    searchInput: new FormControl(this.defaultSearchText),
  });
  multipleSelectionHeight: number;
  
// Hooks ====================
  ngOnInit(): void {

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
    );
    this.multiSelectionForm.controls.searchInput.setValue(this.defaultValue);
  }
  
  ngOnDestroy() {    
    if (this.multipleSelectionChanged) this.multipleSelectionChanged.unsubscribe();
    if (this.getMoreData) this.getMoreData.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {    
    /* if (this.focused) {
      setTimeout(() => {
        this.selection.nativeElement.focus();
      }, 50)
    }   */  

    //if (JSON.stringify(changes['list'].currentValue) != JSON.stringify(changes['list'].previousValue)) {
      if (this.currentSelections.length > 0) {
        for (const item of this.list) {        
          const itemHasChanged = this.currentSelections.find(cs => cs.id === item.id && cs.valueRight !== item.valueRight)
          if (itemHasChanged) {
            item.valueRight = itemHasChanged.valueRight;
          }
          item.sortedField = item.valueRight ? `-${item.translatedName}`: item.translatedName;
        } 
        if (this.list.length > 0) {
          for (const item of this.currentSelections) {        
            const itemShadow = this.list.find(cs => cs.id === item.id);
            if (!itemShadow) {
              this.list.push({
                ...item,
                sortedField: item.valueRight ? `-${item.translatedName}`: item.translatedName,            
              });            
            }          
          } 
        }

        this.list.sort((a, b) => {        
          return a.sortedField < b.sortedField ? -1 : 1;        
        })
  
       /*  this.currentSelections.forEach((item) => {
          let itemHasChanged = this.list.find(cs => cs.id === item.id && cs.valueRight !== item.valueRight);
          console.log('1', itemHasChanged);
          if (itemHasChanged) {
            itemHasChanged.valueRight = item.valueRight;
          } else {
            this.list.push(item);
            itemHasChanged = item;
            itemHasChanged.valueRight = item.id;            
          }
          itemHasChanged.sortedField = itemHasChanged.valueRight ? `-${itemHasChanged.translatedName}`: itemHasChanged.translatedName;
          console.log('2', itemHasChanged);
        })
          
        this.list.sort((a, b) => {        
          return a.sortedField < b.sortedField ? -1 : 1;        
        }) */
      } 
    //}
    
  }

  ngAfterViewInit() {
    if (this.multipleSelection) {
      this.multipleSelectionHeight = this.multipleSelection.nativeElement.offsetHeight;
    }
    if (!this.cdkScrollable) return;
    this.scroll$ = this.cdkScrollable.elementScrolled()
    .pipe(
      throttleTime(300),
      tap(data => { 
        if ((this.multipleSelectionHeight + data.srcElement.scrollTop) >= data.srcElement.scrollHeight * 0.8) {
          this.getMoreData.emit({
            catalogName: this.catalog,
            textToSearch: this.textToSearch,
            initArray: false,
          });          
        }              
      })
    );
  }

// Functions ================
  handleSelectionChange(event: MatSelectChange) {    
    if (event.value === 's' || event.value === 'u') {    
      this.loading = true;
      this.list = this.list.map((r) => {
        this.updateSelections(r, event.value);
        return {
          ...r,
          valueRight: event.value === 's' ? r.id : null,
        }
      }).sort((a, b) => a.translatedName < b.translatedName ? -1 : 0);      
      setTimeout(() => {
        this.multipleSelectionChanged.emit(this.catalog);
        this.formField.setValue('n');
        this.loading = false;
      }, 150);
    }  
  }

  onKey(event: any) { }

  displayFn(data: any): string {
    return data && data.translatedName ? data.translatedName : '';
  }

  handleOptionSelected(event: any) {
    this.selectedOption = true;    
  }

  handleKeyDown(event: KeyboardEvent) { }

  chengeSelection(event: any) { 
    if (this.formField.disabled) {
      event.option.selected = false;
    }
  }

  selectItem(item: any) {
    if (this.formField.disabled) return;
    if (this.formField.value === GeneralValues.NO) {
      // Update the general array to be stored
      this.updateSelections(item);      
      this.multipleSelectionChanged.emit(this.catalog);
    }
  }

  updateSelections(item: any, action: string = '') {
    const originalValueRight = item.valueRight;
    if (action === 'u') {
      item.valueRight = null;
    } else if (action === 's') {
      item.valueRight = item.id;
    } else {
      item.valueRight = !!item.valueRight ? null : item.id;
    }
    
    const itemIndexChanged = this.currentSelections.findIndex(r => r.id === item.id && r.valueRight !== item.valueRight)
    if (itemIndexChanged !== -1) {
      this.currentSelections[itemIndexChanged].valueRight = item.valueRight;
    } else {
      this.currentSelections.push( 
        { ...item,
        originalValueRight, 
        catalogDetailId: item.catalogDetailId,  
      });
    }
  }

  getItemsSelected() {
    if (this.list.length > 0 && this.list[0]) {
      return this.list.filter(r => r.valueRight).length;
    }

    return 0;    
  }

  get SystemTables () {
    return SystemTables;
  }

  get GeneralValues() {
    return GeneralValues; 
  }
  
// End ======================
}
