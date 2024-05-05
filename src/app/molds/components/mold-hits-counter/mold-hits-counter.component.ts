import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';

import { MoldHitsQuery, MoldLabelColor, MoldTresholdState } from '../../models/molds-hits.models';
import { fromTop, numbers } from '../../../shared/animations/shared.animations';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { SettingsData } from '../../../shared/models/settings.models';
import { SmallFont, SpinnerFonts, SpinnerLimits } from 'src/app/shared/models/colors.models';
import { Observable, tap } from 'rxjs';
import { MoldStates } from 'src/app/catalogs';

@Component({
  selector: 'app-mold-hits-counter',
  templateUrl: './mold-hits-counter.component.html',
  animations: [ numbers, fromTop ],
  styleUrls: ['./mold-hits-counter.component.scss']
})
export class MoldHitsCounterComponent implements AfterViewInit {
@Input() mold: MoldHitsQuery;
@Input() intemIndex: number;

@ViewChild('moldProgressBar') private moldProgressBar: ElementRef;
  
// Variables ================
  showCard: boolean = false;
  alarmed: boolean = false;
  hits: number = 0;
  valueToPrint = 0;
  settingsData: SettingsData;
  digitPair: number[] = [];
  digitOdd: number[] = [];
  showNumber: string[] = [];  
  progressBackgroundColorClass: string = 'meter-10';
  borderColorClass: string = 'meter-0';
  progressForeColorClass: string = 'meter-20';
  warningLevel = 0;
  alarmLevel = 0;
  maintenanceClass: string = 'meter-30';
  lastChartValue: number = 0; 
  settingsData$: Observable<SettingsData>;
  limits: SpinnerLimits[] = [{
    start: 0,
    finish: 75,
  },{
    start: 75,
    finish: 90,
  },{
    start: 95,
    finish: 0,
  }];
  /*
  fonts: SpinnerFonts[] = [{
    start: 0,
    finish: 99,
    size: 2.3,
    weight: 700,
  },{
    start: 99,
    finish: 999,
    size: 1.8,
    weight: 500,
  },{
    start: 999,
    finish: 0,
    size: 1.4,
    weight: 300,
  }];
  smallFont: SmallFont = {
    size: 1.4,
    weight: 300,
  }
  */
  fonts: SpinnerFonts[] = [{
    start: 0,
    finish: 99,
    size: 3,
    weight: 700,
  },{
    start: 99,
    finish: 999,
    size: 2.4,
    weight: 500,
  },{
    start: 999,
    finish: 0,
    size: 1.9,
    weight: 300,
  }];
  smallFont: SmallFont = {
    size: 1.6,
    weight: 300,
  }
  showPrefix = false;

  constructor (
    private _store: Store<AppState>,    
  ) { }

// Hooks ====================
  ngOnInit() {
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap( settingsData => {
        this.settingsData = settingsData;
        this.assignSettings(); 
        this.calcData();
        this.hits = this.mold.hits ?? 0;    
        this.numberToArray(this.hits, this.mold.previousHits);      
        this.prepareDataToChart(this.hits, this.mold.thresholdRed ?? 0)          
      })
    )      
  }

  ngOnChanges(): void {    
    this.hits = this.mold.hits ?? 0;
    if (this.mold.updateHits) {      
      this.numberToArray(this.hits, this.mold.previousHits);      
      this.prepareDataToChart(this.hits, this.mold.thresholdRed ?? 0)    
    }    
  }

  ngAfterViewInit(): void {
    const progressBars = document.getElementsByName("active-progress-bar");
    progressBars.forEach((element) => {
      element?.style.setProperty('--mdc-linear-progress-track-color', 'var(--z-colors-page-background-color)');     
    })
  }  
  
// Functions ================
  calcData() {
    this.maintenanceClass = this.mold.nextMaintenance?.alarmed ? 'meter-31' : 'meter-32'
  }
  
  assignSettings() {
    this.borderColorClass = 'meter-0';    
  }

  numberToArray(current: number, previous: number) {    
    if (!current) {
      this.digitPair[0] = 0;            
      this.showNumber[0] = 'Pair';
      return;
    }
    console.log(this.digitPair);
    console.log(this.digitOdd);
    for (let i = 0; i < current.toString().length; i++) {
      const before = previous ?? 0;
      const base = 10 ** (current.toString().length - 1 - i);      
      const currentAmount = current.toString().substring(i);
      let beforeAmount = before.toString().substring(i);
      
      if (beforeAmount.length !== currentAmount.length) {
        beforeAmount = beforeAmount + '0';
      }
      let currentDigit = +currentAmount;
      let beforeDigit = +beforeAmount;
      if (base !== 1) {
        currentDigit = Math.floor(+currentDigit / base);
        beforeDigit = Math.floor(+beforeDigit / base);
      }
      if (beforeDigit !== currentDigit || !this.showNumber[i]) {
        this.digitPair[i] = this.showNumber[i] === 'Pair' ? +beforeDigit : +currentDigit;
        this.digitOdd[i] = this.showNumber[i] === 'Odd' ? +beforeDigit : +currentDigit;                
        this.showNumber[i] = this.showNumber[i] === 'Pair' ? 'Odd' : 'Pair';      
      }
    };
    this.mold.updateHits = false;
  }

  setProgressColors() {
    this.borderColorClass = 
      this.mold.thresholdState === MoldTresholdState.YELLOW ? 
      'meter-2' : this.mold.thresholdState === MoldTresholdState.RED ? 
      'meter-3' : 'meter-1';    
    
    this.progressBackgroundColorClass = 
      this.mold.thresholdState === MoldTresholdState.YELLOW ? 
      'meter-12' : this.mold.thresholdState === MoldTresholdState.RED ? 
      'meter-11' : 'meter-10';

    this.progressForeColorClass =
      this.mold.thresholdState === MoldTresholdState.YELLOW ? 
      'meter-22' : this.mold.thresholdState === MoldTresholdState.RED ? 
      'meter-21' : 'meter-20';    
    
      this.alarmed = this.mold.thresholdState === MoldTresholdState.YELLOW || this.mold.thresholdState === MoldTresholdState.RED;
  }

  prepareDataToChart(current: number, limit: number) {
    this.valueToPrint = +(limit > 0 ? (current / limit * 100) : 0).toFixed(0);
    if (this.lastChartValue !== this.valueToPrint) {
      this.showPrefix = this.valueToPrint > 999;
      this.valueToPrint = this.showPrefix ? 999 : this.valueToPrint;
      this.lastChartValue = this.valueToPrint;
      const fontSize = this.valueToPrint < 100 ? 30 : this.valueToPrint < 999 ? 22 : 16;
      this.setProgressColors(); // Cambiar de lugar para cuando se reciba el backend
    }    
  }

  trackByFn(index: any, item: any) { 
    return index; 
  }

  getState(state: MoldStates) {
    return state === MoldStates.IN_PRODUCTION ?
    $localize`En producción` :
    state === MoldStates.IN_REPAIRING ?
    $localize`En reparación` :
    state === MoldStates.IN_WAREHOUSE ?
    $localize`En almacén` :
    state === MoldStates.OUT_OF_SERVICE ?
    $localize`Fuera de servicio` : state
  }

  getClass(state: MoldStates) {
    return state === MoldStates.IN_PRODUCTION ?
    'state-green' :
    state === MoldStates.IN_REPAIRING ?
    'state-orangered' :
    state === MoldStates.IN_WAREHOUSE ?
    'state-dodgerblue' :
    state === MoldStates.OUT_OF_SERVICE ?
    'state-black' : 'state-null';
  }

// Getters ==================

  get lastHitDate() {
    return this.mold?.lastHit ?? '';
  }

  get MoldLabelColor() {
    return MoldLabelColor;
  }
  
// End ======================

}
