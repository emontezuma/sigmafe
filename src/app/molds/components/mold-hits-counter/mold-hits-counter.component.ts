import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { EChartsOption } from 'echarts';

import { MoldHitsQuery } from '../../models/molds.models';
import { numbers } from '../../../shared/animations/shared.animations';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { SettingsData } from '../../../shared/models/settings.models';
import { SharedService } from '../../../shared/services/shared.service';
import { Colors, SmallFont, SpinnerFonts, SpinnerLimits } from 'src/app/shared/models/colors.models';

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
  hits = 0;
  valueToChart = 0;
  settingsData: SettingsData;
  digitPair: number[] = [];
  digitOdd: number[] = [];
  showNumber: string[] = [];
  chartData: EChartsOption = { };
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

  constructor(
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
    this.hits = this.mold.hits;
    this.numberToArray(this.hits);      
    setInterval(() => {
      this.hits = this.hits + 1;
      this.numberToArray(this.hits);    
      this.prepareDataToChart (this.hits, this.mold.limit)
    }, 1000);    
  }

  ngAfterViewInit(): void {
    const progressBars = document.getElementsByName("active-progress-bar");
    progressBars.forEach((element) => {
      element?.style.setProperty('--mdc-linear-progress-track-color', 'var(--theme-warn-100)');     
    })
  }
  
// Functions ================
  calcData() {
    this.elapsedTimeLabel = this.sharedService.labelElapsedTime(this.mold.lastHit?.date);
    this.maintenanceClass = this.mold.nextMaintenance.alarmed ? 'meter-31' : 'meter-32'
  }
  
  assignSettings() {
    this.borderColorClass = 'meter-0';
    this.progressForeColorClass = this.settingsData?.waitingColor;
  }

  numberToArray(current: number) {
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
    this.valueToChart = +(limit > 0 ? (current / limit * 100) : 0).toFixed(0);
    if (this.lastChartValue !== this.valueToChart) {
      this.showPrefix = this.valueToChart > 999;
      this.valueToChart = this.showPrefix ? 999 : this.valueToChart;
      this.lastChartValue = this.valueToChart;
      const fontSize = this.valueToChart < 100 ? 30 : this.valueToChart < 999 ? 22 : 16;
      this.setProgressColors(); // Cambiar de lugar para cuando se reciba el backend
      
      this.chartData = {
        series: [
          {
            type: 'gauge',
            startAngle: 0,
            endAngle: 360,
            min: 0,
            max: 100,
            splitNumber: 4,
            itemStyle: {
              color: this.borderColorClass,
              shadowColor: 'rgba(0,138,255,0.5)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            progress: {
              show: true,
              roundCap: false,
              width: 6
            },
            pointer: {
              show: false,
            },
            axisLine: {
              roundCap: false,
              lineStyle: {
                width: 6
              }
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              length: 15,
              distance: 1,
              lineStyle: {
                width: 2,
                color: '#aaaaaa'
              }
            },
            axisLabel: {
              show: false,            
            },
            title: {
              show: false,
            },
            detail: {
              backgroundColor: 'none',
              width: '70%',
              lineHeight: 35,
              height: 30,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              formatter: function (value) {
                if (value > 999) {
                  return '{value|>' + 999 + '}{unit|%}';
                } else {
                  return '{value|' + value.toFixed(0) + '}{unit|%}';
                }                
              },
              rich: {
                value: {
                  fontSize: fontSize,
                  fontWeight: 'bolder',
                  color: this.borderColorClass,
                  
                },
                unit: {                
                  fontSize: 12,
                  fontWeight: 'bolder',
                  color: this.borderColorClass,
                }
              }
            },
            data: [
              {
                value: this.valueToChart,
              }
            ]
          }
        ]
      };
    }    
  }

  trackByFn(index: any, item: any) { 
    return index; 
  }

  errorLoadingImage(event: any) {
    
  }

// End ======================
}
