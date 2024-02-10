import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';

import { SharedService } from 'src/app/shared/services/shared.service';
import { ButtonActions, ShowElement, ToolbarElement } from 'src/app/shared/models/screen.models';
import { Subscription } from 'rxjs';

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
  changeStateSubscriber: Subscription;
  showSearchSubscriber: Subscription;

  constructor (
    private sharedService: SharedService,
  ) { }

// Hooks ====================
  ngOnInit(): void {
    this.showSearchSubscriber = this.sharedService.showSearch.subscribe((searchBox) => {
      this.showSearchBox = searchBox;
    });
    this.changeStateSubscriber = this.sharedService.buttonStateChange.subscribe((buttonState) => {
      const button = this.toolbar.buttons.find((button) => {
        return button.action === buttonState.action
      });
      if (button) {
        button.disabled = !buttonState.enabled;
      }
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

  ngOnDestroy(): void {
    if (this.showSearchSubscriber) this.showSearchSubscriber.unsubscribe();
    if (this.changeStateSubscriber) this.changeStateSubscriber.unsubscribe();
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

  handleClick(index: number, action: ButtonActions) {
    this.toolbar.buttons[index].loading = true;
    setTimeout(() => {
      this.toolbar.buttons[index].loading = false;
      // TODO que hacer en tiempos muy largos
    }, 5000);
    this.sharedService.setToolbarClick(action, this.toolbar.from, index);
  }

// End ======================
}
