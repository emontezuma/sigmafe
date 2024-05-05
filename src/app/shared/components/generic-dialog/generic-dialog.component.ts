import { Component, Inject, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../state/app.state'; 
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { SettingsData } from '../../models/settings.models';
import { SharedService } from '../../services/shared.service';
import { SmallFont, SpinnerFonts, SpinnerLimits } from '../../models/colors.models';
import { ButtonActions } from '../../models/screen.models';

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
settingsData$: Observable<SettingsData>;
everySecond$: Observable<boolean>;
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
  private _store: Store<AppState>,
  public _dialogRef: MatDialogRef<GenericDialogComponent>,
  public _sharedService: SharedService,
  @Inject(MAT_DIALOG_DATA) public data: any
) {
  this.settingsData$ = this._store.select(selectSettingsData).pipe(
    tap( settingsData => {
      this.settingsData = settingsData;
      if (this.settingsData.timeOutFortDialog && this.settingsData.timeOutFortDialog > 0) {
        this.timeOutforDefaultButton = this.settingsData.timeOutFortDialog;
        this.everySecond$ = this._sharedService.pastSecond.pipe(
          tap((pulse) => {
            this.timeOutforDefaultButton = this.timeOutforDefaultButton - 1;
            if (this.timeOutforDefaultButton === 0) {
              this.data.action = this.defaultAction;            
              this._dialogRef.close(this.data);
            }    
          })
        );
      }
    })
  );
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
        action: ButtonActions.CANCEL,
        default: true,
      });      
    } else {
      this.defaultAction = this.data.buttons.find((button : any) => button.default).action;
    }
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
      this._dialogRef.close(this.data);
    }, 1000);    
  }

  handleCloseButtonClick() {
    this.closed = true;
    this.data.action = 'cancel'; 
    this._dialogRef.close(this.data);
  }

// End ======================
}
