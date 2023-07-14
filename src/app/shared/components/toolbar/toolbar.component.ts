import { Component, Input, OnChanges } from '@angular/core';

import { SharedService } from 'src/app/shared/services/shared.service';
import { ApplicationModules, ScreenSizes, ShowElement, ToolbarElement } from 'src/app/shared/models/screen.models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnChanges {
@Input() toolbar: ToolbarElement;

// Variables ================
  showSearchBox: ShowElement;
  toolbarHeight: number = 64;

  constructor(
    private sharedService: SharedService,     
    ) { }

// Hooks ====================
  ngOnInit(): void {
    this.sharedService.showSearch.subscribe((searchBox) => {
      this.showSearchBox = searchBox;
    });
  }

  ngOnChanges(): void {
    this.toolbarHeight = this.toolbar.size == ScreenSizes.NORMAL ? 64 : 40; 
  }

// Functions ================
  sendSearchText(e: any) {
    this.sharedService.setText(e, this.showSearchBox.from);
  }

  trackByFn(index: any, item: any) { 
    return index; 
  }

// End ======================
}
