import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';

import { MoldHitsQuery } from '../../models/molds.models';
import { numbers } from '../../../shared/animations/shared.animations';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { SettingsData } from '../../../shared/models/settings.models';
import { SharedService } from '../../../shared/services/shared.service';
import { SmallFont, SpinnerFonts, SpinnerLimits } from 'src/app/shared/models/colors.models';

@Component({
  selector: 'app-mold-hits-counter',
  templateUrl: './mold-hits-counter.component.html',
  animations: [ numbers ],
  styleUrls: ['./mold-hits-counter.component.scss']
})
export class MoldHitsCounterComponent implements AfterViewInit {
@Input() mold: MoldHitsQuery;
@ViewChild('moldProgressBar') private moldProgressBar: ElementRef;
  
// Variables ================
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
  elapsedTimeLabel: string = '';
  lastChartValue: number = 0;  
  limits: SpinnerLimits[] = [{
    start: 0,
    finish: 67,
  },{
    start: 67,
    finish: 95,
  },{
    start: 95,
    finish: 0,
  }];
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
  showPrefix = false;

  constructor (
    private store: Store<AppState>,
    private sharedService: SharedService,
  ) { }

// Hooks ====================
  ngOnInit() {
    this.store.select(selectSettingsData).subscribe( settingsData => {
      this.settingsData = settingsData;
      this.assignSettings(); 
      this.calcData();
    });
    this.hits = this.mold.hits ?? 0;    
    this.numberToArray(this.hits);      
    setInterval(() => {
      this.hits = this.hits + 1;
      this.numberToArray(this.hits);    
      this.prepareDataToChart (this.hits, this.mold.limit ?? 0)
    }, 1000);    
  }

  ngAfterViewInit(): void {
    const progressBars = document.getElementsByName("active-progress-bar");
    progressBars.forEach((element) => {
      element?.style.setProperty('--mdc-linear-progress-track-color', 'var(--z-colors-page-background-color)');     
    })
  }
// Functions ================
  calcData() {
    this.elapsedTimeLabel = this.sharedService.labelElapsedTime(this.mold.lastHit?.date);
    this.maintenanceClass = this.mold.nextMaintenance?.alarmed ? 'meter-31' : 'meter-32'
  }
  
  assignSettings() {
    this.borderColorClass = 'meter-0';
    this.progressForeColorClass = this.settingsData?.waitingColor;
  }

  numberToArray(current: number | null) {
    if (!current) current = 1;
    const before = current - 1;    
    for (let i = 0; i < current.toString().length; i++) {
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
  }

  setProgressColors() {
    this.borderColorClass = this.mold.warned ? 'meter-2' : this.mold.alarmed ? 'meter-3' : 'meter-1';
    this.progressBackgroundColorClass = this.mold.alarmed ? 'meter-11' : 'meter-10';
    this.progressForeColorClass = this.mold.alarmed ? 'meter-20' : 'meter-21';    
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

// Getters ==================

  get lastHitDate() {
    return this.mold?.lastHit?.date ?? '';
  }
  
// End ======================
}
