import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { SharedService } from 'src/app/shared/services/shared.service';
import { ShowElement, ToolbarElement } from 'src/app/shared/models/screen.models';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements AfterViewInit {
@ViewChild('toolbarBox') toolbarBox: ElementRef;
@Input() toolbar: ToolbarElement;

// Variables ================
  showSearchBox: ShowElement;
  toolbarHeight: number = 64;

  constructor(
    private sharedService: SharedService,
    private store: Store<AppState>,  
    ) { }

// Hooks ====================
  ngOnInit(): void {
    this.sharedService.showSearch.subscribe((searchBox) => {
      this.showSearchBox = searchBox;
    });    
  }

  ngAfterViewInit(): void {
    if (!this.toolbarBox)
      setTimeout(() => {
        this.getElementWidth();
      }, 100);
    else {
      this.getElementWidth();
    }
  }

// Functions ================
  getElementWidth() {
    this.sharedService.setToolbarWidth(this.toolbarBox.nativeElement.clientWidth as number);        
  }

  sendSearchText(e: any) {
    this.sharedService.setText(e, this.showSearchBox.from);
  }

  trackByFn(index: any, item: any) { 
    return index; 
  }

// End ======================
}
