import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA  } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, tap, interval } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';
import { SnackMessage, Screen } from '../../models/screen.models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.scss']
})
export class SnackComponent implements OnInit, AfterViewInit{
  maxWidth: number = 0;
  screenData$: Observable<Screen>;
  interval$: Observable<any>;
  showSnackText: boolean = false;
  barValue: number = 0;

  constructor (    
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackMessage,
    public _snackBarRef: MatSnackBarRef<SnackComponent>,    
    private _store: Store<AppState>,
  ) { 
    const specialChar = new RegExp(String.fromCharCode(160), "g");
    this.data.message = this.data.message.replace(specialChar, " ")
  }

// Hooks ====================

  ngOnInit() {    
   this.interval$ = interval(
      (this.data.duration > 0 ? this.data.duration : environment.snackByDefaultDuration) / 100
    ).pipe(
      tap((time) => {
        this.barValue = time;
      })
    ) 
  }

  ngAfterViewInit() {
    const progressBars = document.getElementsByName("active-progress-bar");
    progressBars.forEach((element) => {
      element?.style.setProperty('--mdc-linear-progress-track-color', 'var(--z-colors-page-background-color)');     
    })
    setTimeout(() => {
      this.screenData$ = this._store.select(selectSharedScreen).pipe(
        tap(screenData => {
          setTimeout(() => {
            this.maxWidth = screenData.innerWidth * 0.33;
          }, 50);
        })
      );
    });
    setTimeout(() => {
      this.showSnackText = true;  
    }, 100);
  }
  

// Functions ================
  handleClick() {
    this._snackBarRef.dismissWithAction();
  }
  
// End ======================
}
