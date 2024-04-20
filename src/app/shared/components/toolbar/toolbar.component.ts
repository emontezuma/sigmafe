import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from 'src/app/state/app.state';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ButtonActions, ShowElement, ToolbarControl } from 'src/app/shared/models/screen.models';
import { SmallFont, SpinnerFonts, SpinnerLimits } from '../../models/colors.models';
import { selectSharedScreen } from 'src/app/state/selectors/screen.selectors';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements AfterViewInit {
@ViewChild('toolbarBox') toolbarBox: ElementRef;
@Input() toolbar: ToolbarControl;

// Variables ================
  showSearchBox: ShowElement;
  toolbarHeight: number = 64;
  changeStateSubscriber: Subscription;
  showSearchSubscriber: Subscription;
  screenDataSubscriber: Subscription;
  scrollbarActivated: boolean = false;
  mostRight: number = 0;
  mostLeft: number = 0;
  // TEMP
  stopTimer: boolean = false;
  firstTime: boolean = true;  
  timeOutforTimer: number = 0;  
  timeOutCountdown: number = 0;  
  everySecondSubscriber: Subscription;
  timeIntervalSubscriber: Subscription;
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
    private sharedService: SharedService,
    private store: Store<AppState>,
  ) { }

// Hooks ====================
  ngOnInit(): void {
    this.screenDataSubscriber = this.store.select(selectSharedScreen).subscribe(screenData => {      
      this.scrollbarActivated = screenData.innerWidth <= (this.toolbarBox.nativeElement.clientWidth + 30);
      this.sharedService.setScrollbarInToolbar(this.scrollbarActivated);      
    });    
    this.showSearchSubscriber = this.sharedService.showSearch.subscribe((searchBox) => {
      this.showSearchBox = searchBox;
    });
    this.changeStateSubscriber = this.sharedService.buttonStateChange.subscribe((buttonState) => {
      const element = this.toolbar.elements.find((element) => {
        return element.action === buttonState.action
      });
      if (element) {
        element.disabled = !buttonState.enabled;
      }
    });    
    this.everySecondSubscriber = this.sharedService.pastSecond.subscribe((pulse) => {
      if (this.stopTimer || this.timeOutforTimer == 0) return;
      if (this.timeOutCountdown === 0) {
        this.sharedService.setTimeCompleted(true);
        return;
      }
      // Hay un issue que hace que el primer segundo se consuma muy rapido
      if (this.timeOutCountdown === this.timeOutforTimer && this.firstTime) {
        this.firstTime = false;
        return;
      }

      this.timeOutCountdown = this.timeOutCountdown - 1;        
    });
    this.timeIntervalSubscriber = this.sharedService.timeInterval.subscribe((interval) => {      
      this.firstTime = true;
      this.timeOutforTimer = interval;  
      this.timeOutCountdown = this.timeOutforTimer;  
      this.toolbar.showSpinner = interval > 0;      
    });
  }

  ngAfterViewInit(): void {
    console.log(this.toolbarBox);
  }

  ngOnDestroy(): void {
    if (this.showSearchSubscriber) this.showSearchSubscriber.unsubscribe();
    if (this.changeStateSubscriber) this.changeStateSubscriber.unsubscribe();
    if (this.everySecondSubscriber) this.everySecondSubscriber.unsubscribe();
    if (this.timeIntervalSubscriber) this.timeIntervalSubscriber.unsubscribe();    
  }

// Functions ================
  sendSearchText(e: any) {
    this.sharedService.setText(e, this.showSearchBox.from);
  }

  trackByFn(index: any, item: any) { 
    return index; 
  }

  handleClick(index: number, action: ButtonActions, field: string) {
    this.toolbar.elements[index].loading = true;
    setTimeout(() => {
      this.toolbar.elements[index].loading = false;
      // TODO que hacer en tiempos muy largos
    }, 5000);
    this.sharedService.setToolbarClick(action, this.toolbar.from, index, field);
  }

  handleSelection(event: any, field: string) {
    this.sharedService.setToolbarClick(event.selection, this.toolbar.from, event.index, field);
  }

  handleStopTimer() {
    this.stopTimer = !this.stopTimer    
    this.sharedService.setToolbarStopTimer(this.stopTimer);
  }

  moveToolbar(button: string) {
  }

// End ======================
}
