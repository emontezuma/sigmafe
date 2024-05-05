import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA  } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';
import { SnackMessage, Screen } from '../../models/screen.models';

@Component({
  selector: 'app-snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.scss']
})
export class SnackComponent implements OnInit, AfterViewInit{
  maxWidth: number = 0;
  screenData$: Observable<Screen>;  

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
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.screenData$ = this._store.select(selectSharedScreen).pipe(
        tap(screenData => {
          this.maxWidth = screenData.innerWidth * 0.33;
        })
      );
    });
  }
  

// Functions ================
  handleClick() {
    this._snackBarRef.dismissWithAction();
  }
  
// End ======================
}
