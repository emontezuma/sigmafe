import { Component } from '@angular/core';

import { SharedService } from 'src/app/shared/services/shared.service';
import { ShowElement } from 'src/app/shared/models/screen.models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(
    private sharedService: SharedService,     
    ) { }

// Variables ================
  showSearchBox: ShowElement;

  // Hooks ====================
  ngOnInit(): void {
    this.sharedService.show.subscribe((searchBox) => {
      this.showSearchBox = searchBox;
    })
  }

// Functions ================
  sendSearchText(e: any) {
    this.sharedService.setText(e, this.showSearchBox.from);
  }

// End ======================
}
