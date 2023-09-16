import { Component, OnInit, Inject, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../state/app.state'; 
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { SettingsData } from '../../models/settings.models';
import { SharedService } from '../../services/shared.service';
import { SmallFont, SpinnerFonts, SpinnerLimits } from '../../models/colors.models';

@Component({
  selector: 'app-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent {

// Variables ================
defaultButtonIcons: string[] = [
  'check',
  'cancel',
];
loading: boolean = false;
settingDataSubscriber: Subscription;
everySecondSubscriber: Subscription;
settingsData: SettingsData;
closed: boolean = false;
timeOutforDefaultButton: number = 0;
defaultAction: string = 'cancel';
classLegacy: string = 'spinner-card-font';
limits: SpinnerLimits[] = [];
fonts: SpinnerFonts[] = [{
  start: 0,
  finish: 100,
  size: 1.2,
  weight: 500,
},{
  start: 100,
  finish: 999,
  size: 1,
  weight: 300,
}];
smallFont: SmallFont = {
  size: 0.8,
  weight: 300,
}  

constructor (
  private store: Store<AppState>,
  public dialogRef: MatDialogRef<GenericDialogComponent>,
  public sharedService: SharedService,
  @Inject(MAT_DIALOG_DATA) public data: any
) {
  this.settingDataSubscriber = this.store.select(selectSettingsData).subscribe( settingsData => {
    this.settingsData = settingsData;
    if (this.settingsData.timeOutFortDialog && this.settingsData.timeOutFortDialog > 0) {
      this.timeOutforDefaultButton = this.settingsData.timeOutFortDialog;
      this.everySecondSubscriber = this.sharedService.pastSecond.subscribe((pulse) => {
        this.timeOutforDefaultButton = this.timeOutforDefaultButton - 1;
        if (this.timeOutforDefaultButton === 0) {
          this.data.action = this.defaultAction;
          this.everySecondSubscriber.unsubscribe();
          this.dialogRef.close(this.data);
        }    
      });
    }
  });
} 

// Hooks ====================
  ngOnInit() : void {
    if (!this.data.buttons || this.data.buttons.length === 0) {
      this.data.buttons.push({
        showIcon: true,
        icon: 'check',
        showCaption: true,
        caption: $localize`Aceptar`,
        showTooltip: true,
        class: 'primary',
        tooltip: $localize`Cierra esta ventana`,
        disabled: false,
        loading: false,
        action: 'cancel',
        default: true,
      });      
    } else {
      this.defaultAction = this.data.buttons.find((button) => button.default).action;
    }
  }

  ngOnDestroy(): void {
    if (this.settingDataSubscriber) this.settingDataSubscriber.unsubscribe();
    if (this.everySecondSubscriber) this.everySecondSubscriber.unsubscribe();
  }

// Functions ================
  trackByFn(index: any, item: any) { 
    return index; 
  }

  handleClick(index: number, action: string) {
    if (action === 'cancel') {
      this.closed = true;
    }    
    this.data.buttons[index].loading = true;
    setTimeout(() => {      
      this.data.action = this.data.buttons[index].action;
      this.dialogRef.close(this.data);
    }, 1000);    
  }

  handleCloseButtonClick() {
    this.closed = true;
    this.data.action = 'cancel'; 
    this.dialogRef.close(this.data);
  }

// End ======================
}
