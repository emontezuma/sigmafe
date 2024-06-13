import { Component, ElementRef, AfterViewInit, Inject, ViewChild, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, Subscription, fromEvent, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../state/app.state'; 
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { SettingsData } from '../../models/settings.models';
import { SharedService } from '../../services/shared.service';
import { ButtonActions, dialogByDefaultButton, SmallFont, SpinnerFonts, SpinnerLimits } from '../../models';

@Component({
  selector: 'app-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent implements AfterViewInit {
  @ViewChild('genericDialog') genericDialog: ElementRef;

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
  timeOutFortDialog: number = 0;
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
  keypressSubscription: Subscription;

  constructor (
    private _store: Store<AppState>,
    public _dialogRef: MatDialogRef<GenericDialogComponent>,
    public _sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { } 

// Hooks ====================
  ngOnInit() : void {
    if (this.data.defaultButtons === dialogByDefaultButton.ACCEPT) {
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
        cancel: true,       
      });      
    } else if (this.data.defaultButtons === dialogByDefaultButton.ACCEPT_AND_CANCEL) {
      this.data.buttons.push({
        showIcon: true,
        icon: 'check',
        showCaption: true,
        caption: $localize`Aceptar`,
        showTooltip: true,
        class: 'primary',
        tooltip: $localize`Acepta la acción y cierra la ventana`,
        disabled: false,
        loading: false,
        action: ButtonActions.OK,
        default: true,       
        cancel: false,       
      });
      this.data.buttons.push({
        showIcon: true,
        icon: 'cancel',
        showCaption: true,
        caption: $localize`Cancelar`,
        showTooltip: true,        
        tooltip: $localize`Cierra esta ventana`,
        disabled: false,
        loading: false,
        action: ButtonActions.CANCEL,
        default: false,       
        cancel: true,       
      });      
    } else {
      this.defaultAction = this.data.buttons.find((button : any) => button.default).action;
    }
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap( settingsData => {
        this.settingsData = settingsData;
        if (this.data.duration >= 0) {
          this.timeOutFortDialog = this.data.duration;
        } else {
          this.timeOutFortDialog = this.settingsData.timeOutFortDialog;;
        }
        if (this.timeOutFortDialog !== 0) this.timeOutFortDialog++;
        if (this.timeOutFortDialog && this.timeOutFortDialog > 0) {        
          this.timeOutforDefaultButton = this.timeOutFortDialog;
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

  ngOnDestro(): void {
    if (this.keypressSubscription) this.keypressSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.keypressSubscription = fromEvent(this.genericDialog.nativeElement, 'keyup').subscribe((event: KeyboardEvent) => {
      if (event.key === 'Enter' && this.data.buttons.find((button : any) => button.default)) {
        const action = this.data.buttons.find((button : any) => button.default).action;
        this.handleClick(action);            
      } else if (event.key === 'Escape' && this.data.buttons.find((button : any) => button.cancel)) {
        const action = this.data.buttons.find((button : any) => button.cancel).action;
        this.handleClick(action);
      }
    });
  }
  
// Functions ================
  trackByFn(index: any) { 
    return index; 
  }

  handleClick(action: string) {
    if (action === 'cancel') {
      this.closed = true;
    }    
    this.data.buttons.find(b => b.action === action).loading = true;
    setTimeout(() => {      
      this.data.action = action;
      this._dialogRef.close(this.data);
    }, 100);    
  }

  handleCloseButtonClick() {
    this.closed = true;
    this.data.action = 'cancel'; 
    this._dialogRef.close(this.data);
  }

// End ======================
}
