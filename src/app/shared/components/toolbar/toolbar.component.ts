import { AfterViewInit, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';

import { AppState } from 'src/app/state/app.state';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ButtonActions, ButtonState, ShowElement, ToolbarControl, Screen } from 'src/app/shared/models/screen.models';
import { SmallFont, SpinnerFonts, SpinnerLimits } from '../../models/colors.models';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements AfterViewInit {
@Input() toolbar: ToolbarControl;

// Variables ================
  showSearchBox: ShowElement;
  toolbarHeight: number = 64;
  changeState$: Observable<ButtonState>;
  showSearch$: Observable<ShowElement>;
  screenData$: Observable<Screen>;
  scrollbarActivated: boolean = false;
  mostRight: number = 0;
  mostLeft: number = 0;
  totalElementsWidth: number = 0;
  screenWidth: number = 0;
  // TEMP
  stopTimer: boolean = false;
  firstTime: boolean = true;
  timeOutforTimer: number = 0;
  timeOutCountdown: number = 0;
  everySecond$: Observable<boolean>;
  timeInterval$: Observable<number>;

  intervalSeconds: any;
  classLegacy: string = 'spinner-card-font';
  classWarm: string = 'spinner-accent';
  limits: SpinnerLimits[] = [];
  toolbarTooltip = {
    left: $localize`Mover a la izquierda`,
    right: $localize`Mover a la derecha`,
  }
  fonts: SpinnerFonts[] = [{
    start: 0,
    finish: 100,
    size: 1.6,
    weight: 500,
  },{
    start: 100,
    finish: 999,
    size: 1.4,
    weight: 300,
  }];
  smallFont: SmallFont = {
    size: 1.4,
    weight: 300,
  }  

  constructor (
    private _sharedService: SharedService,
    private _store: Store<AppState>,
  ) { }

// Hooks ====================
  ngOnInit(): void {
    this.totalElementsWidth = (this.toolbar.showSpinner ? 55 : 0) + (this.toolbar.elements.length - 1) * 5;
    this.screenData$ = this._store.select(selectSharedScreen).pipe(
      tap(screenData => {
        this.screenWidth = screenData.innerWidth;
        this.validateScrollbar();
      })
    );
    this.showSearch$ = this._sharedService.showSearch.pipe(
      tap((searchBox) => {
        this.showSearchBox = searchBox;
      })
    );
    this.changeState$ = this._sharedService.buttonStateChange.pipe(
      tap((buttonState) => {
        const element = this.toolbar.elements.find((element) => {
          return element.action === buttonState.action
        });
        if (element) {
          element.disabled = !buttonState.enabled;
        }
      })
    );
    this.everySecond$ = this._sharedService.pastSecond.pipe(
      tap((pulse) => {     
        if (this.stopTimer || this.timeOutforTimer == 0) return;
        if (this.timeOutCountdown === 0) {
          this._sharedService.setTimeCompleted(true);
          return;
        }
        // Hay un issue que hace que el primer segundo se consuma muy rapido
        if (this.timeOutCountdown === this.timeOutforTimer && this.firstTime) {
          this.firstTime = false;
          return;
        }
        this.timeOutCountdown = this.timeOutCountdown - 1;
      })
    );
    this.timeInterval$ = this._sharedService.timeInterval.pipe(
      tap((interval) => {      
        this.firstTime = true;
        this.timeOutforTimer = interval;
        this.timeOutCountdown = this.timeOutforTimer;      
        this.toolbar.showSpinner = interval > 0;
      })
    );
  }

  ngAfterViewInit(): void {
    const toolbarElements = document.getElementsByName("toolbar-element");
    toolbarElements.forEach((element) => {       
      this.totalElementsWidth = this.totalElementsWidth + element.clientWidth;
    });    
    this.validateScrollbar();
  }
  
// Functions ================
  validateScrollbar() {
    this.scrollbarActivated = this.totalElementsWidth - (this.screenWidth - 32) >= 0;
    this._sharedService.setScrollbarInToolbar(this.scrollbarActivated);
  }
  sendSearchText(e: any) {
    this._sharedService.setText(e, this.showSearchBox.from);
  }

  trackByFn(index: any, item: any) { 
    return index;
  }

  handleClick(index: number, action: ButtonActions, field: string) {
    this._sharedService.setToolbarClick(action, this.toolbar.from, index, field);
  }

  handleSelection(event: any, field: string) {
    this._sharedService.setToolbarClick(event.selection, this.toolbar.from, event.index, field);
  }

  handleStopTimer() {
    this.stopTimer = !this.stopTimer    
    this._sharedService.setToolbarStopTimer(this.stopTimer);
  }

  moveToolbar(button: string) {
  }

// End ======================
}
