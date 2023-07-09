import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { EChartsOption } from 'echarts';

import { Mold } from '../../models/molds.models';
import { numbers } from '../../../shared/animations/shared.animations';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { SettingsData } from '../../../shared/models/settings.models';
import { HelpersService } from '../../../shared/services/helpers.service';

@Component({
  selector: 'app-mold-hits-counter',
  templateUrl: './mold-hits-counter.component.html',
  animations: [ numbers ],
  styleUrls: ['./mold-hits-counter.component.scss']
})
export class MoldHitsCounterComponent {
@Input() mold: Mold;

// Variables ================
  hits = 0;
  settingsData: SettingsData;
  digitPair: number[] = [];
  digitOdd: number[] = [];
  showNumber: string[] = [];
  chartData: EChartsOption = { };
  progressBackgroundColor: string = "none";
  progressBarColor: string = "lightgray";
  progressForeColor: string = "lightgray";
  messageByProgress = false;
  warningLevel = 0;
  alarmLevel = 0;
  leftDays = 0;
  leftDaysColor: string = "lightgray";

  constructor(
    private store: Store<AppState>,
    private helpersService: HelpersService,
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

// Functions ================
  calcData() {
    this.leftDays = this.helpersService.substractDates(this.mold.lastMaintenance?.date, '', "d");
    this.leftDaysColor = this.leftDays <= this.mold.leftDaysAlarmed ? this.settingsData?.alarmedColor : this.leftDays <= this.mold.leftDaysWarning ? this.settingsData?.warningColor : this.settingsData?.okColor;
    this.warningLevel = this.mold?.levelAlert?.useGeneral ? this.settingsData?.levelAlert?.warning : this.mold.levelAlert.warning;
    this.alarmLevel = this.mold?.levelAlert?.useGeneral ? this.settingsData?.levelAlert?.alarm : this.mold.levelAlert.alarm;
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

  setProgressColors(progress: number) {
    this.progressBarColor = progress < this.warningLevel || this.warningLevel === 0 || this.alarmLevel === 0 ? this.settingsData?.okColor : progress < this.alarmLevel ? this.settingsData?.warningColor : this.settingsData?.alarmedColor;
    this.progressBackgroundColor = progress < this.alarmLevel || this.alarmLevel === 0 ? 'none' : this.settingsData?.alarmedColor;
    this.progressForeColor = progress < this.alarmLevel || this.alarmLevel === 0 ? '#000000' : '#FFFFFF';
    this.messageByProgress = progress >= this.alarmLevel && this.alarmLevel !== 0;
  }

  prepareDataToChart(current: number, limit: number) {
    const progress = +(limit > 0 ? (current / limit * 100) : 0).toFixed(0);
    const fontSize = progress < 100 ? 30 : progress < 999 ? 22 : 16;
    this.setProgressColors(progress)
    
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
            show: true,
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
              value: progress,
            }
          ]
        }
      ]
    };
  }

  trackByFn(index: any, item: any) { 
    return index; 
  }

  errorLoadingImage(event: any) {
    
  }

// End ======================
}
