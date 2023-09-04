import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA  } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';
import { SnackMessage } from '../../models/screen.models';

@Component({
  selector: 'app-snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.scss']
})
export class SnackComponent {
  maxWidth: number = 0;
  screenDataSubscriber: Subscription;

  constructor (    
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackMessage,
    public snackBarRef: MatSnackBarRef<SnackComponent>,    
    private store: Store<AppState>,
  ) { 
    const specialChar = new RegExp(String.fromCharCode(160), "g");
    this.data.message = this.data.message.replace(specialChar, " ")
  }

// Hooks ====================

  ngOnInit() {
    this.screenDataSubscriber = this.store.select(selectSharedScreen).subscribe(screenData => {
      this.maxWidth = screenData.innerWidth * 0.33;
    });    
  }

  ngOnDestroy() : void {    
    if (this.screenDataSubscriber) this.screenDataSubscriber.unsubscribe();
  }

// Functions ================
  handleClick() {
    this.snackBarRef.dismissWithAction();
  }
  
// End ======================
}
