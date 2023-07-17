import { Component, Input } from '@angular/core';
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
export class MoldHitsCounterComponent {
@Input() mold: MoldHitsQuery;

// Variables ================
  hits = 0;
  valueToChart = 0;
  settingsData: SettingsData;
  digitPair: number[] = [];
  digitOdd: number[] = [];
  showNumber: string[] = [];
  chartData: EChartsOption = { };
  progressBackgroundColor: string = 'none';
  progressBarColor: string = 'lightgray';
  progressForeColor: string = 'lightgray';
  warningLevel = 0;
  alarmLevel = 0;
  leftColor: string = 'lightgray';
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
    }, 200);    
  }

// Functions ================
  calcData() {
    this.elapsedTimeLabel = this.sharedService.labelElapsedTime(this.mold.lastHit?.date);
    this.leftColor = this.mold.nextMaintenance.alarmed ? this.settingsData?.alarmedColor : this.settingsData?.okColor;
  }
  
  assignSettings() {
    this.progressBarColor = this.settingsData?.waitingColor;
    this.progressForeColor = this.settingsData?.waitingColor;
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
    this.progressBarColor = this.mold.warned ? this.settingsData?.warningColor : this.mold.alarmed ? this.settingsData?.alarmedColor : this.settingsData?.okColor;
    this.progressBackgroundColor = this.mold.alarmed ? this.settingsData?.alarmedColor : 'none';
    this.progressForeColor = this.mold.alarmed ? '#FFFFFF' : '#606060';    
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
              color: this.progressBarColor,
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
                  color: this.progressBarColor,
                  
                },
                unit: {                
                  fontSize: 12,
                  fontWeight: 'bolder',
                  color: this.progressBarColor,
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
