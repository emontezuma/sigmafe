import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';

import { ChecklistAnswerType, ChecklistFillingItem, ChecklistQuestionStatus } from '../../models/checklists.models';
import { AppState } from 'src/app/state/app.state';
import { selectScreenFeature } from 'src/app/state/selectors/screen.selectors';
import { updateChecklistQuestion } from 'src/app/state/actions/checklists.actions';
import { dissolve } from '../../../shared/animations/shared.animations';
import { EChartsOption } from 'echarts';
import { Observable, tap } from 'rxjs';
import { ButtonActions, SharedState } from 'src/app/shared/models/screen.models';
import { ChecklistLine, GeneralValues } from 'src/app/shared/models';

@Component({
  selector: 'app-checklist-filling-item',
  templateUrl: './checklist-filling-item.component.html',
  animations: [ dissolve ],
  styleUrls: ['./checklist-filling-item.component.scss']
})
export class ChecklistFillingItemsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('questionCard') questionCard: ElementRef;
  @Input() item: ChecklistLine;
  @Input() view: string;
  @Input() inactive: boolean;

  chartOption: EChartsOption = {
    animationDuration: 200,
    xAxis: {
      type: 'category',            
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: false,
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    grid: {
      left: 4,
      top: 2,
      right: 6,
      bottom: 2,
    },
    series: [
      {
        data: [820, 932, 901, 934, 1400, 1330, 1320, 820, 932, 901, 666, 792, 1100, 420],
        type: 'line',
        smooth: true,
        symbol: 'none',
        color: 'green',
        areaStyle: {
          opacity: 0.25
        },
        markLine: {
          symbol: 'circle',
          symbolSize: 5,
          data: [{
            symbol: "none",
            name: 'GOAL',
            yAxis: 1000,
            label: {
              show: false,
              position: 'insideEndTop',
            },
            lineStyle: {
              color: 'red',
              width: 2
            },
          },{
            symbol: "none",
            name: 'GOAL',
            yAxis: 450,
            label: {
              show: false,
              position: 'insideEndTop',
            },
            lineStyle: {
              color: 'red',
              width: 2
            },
          }]
        },        
        
      },
    ],
  };
  screen$: Observable<SharedState>;
  observer;

  showChart: string = 'N';
  miniChartWidth: number = 90;
  miniChartHeight: number = 50;

  constructor (
    private _store: Store<AppState>,
    private _host: ElementRef, 
    private _zone: NgZone
  ) { }

// Hooks ====================
  ngOnInit() {
    this.observer = new ResizeObserver(entries => {
      this._zone.run(() => {
        this.adjustCardWidth(entries[0].contentRect.width);
        console.log(this.item);
      });
    });
    this.observer.observe(this._host.nativeElement);

    this.screen$ = this._store.select(selectScreenFeature).pipe(
      tap( screenData => {
        if (this.questionCard) {
          this.checkCardWidth();
        } else {
          setTimeout(() => {
            this.checkCardWidth();
          }, 300);
        }
      })
    );
  }
  
  ngAfterViewInit(): void {
    const chip = document.getElementsByName("chip");    
    chip.forEach((element) => {
      element?.style.setProperty('--mdc-chip-label-text-color', 'var(--theme-warn-contrast-500)');     
    });    
  }

  ngOnDestroy(): void {    
    this.observer.unobserve(this._host.nativeElement);
  }

// Functions ================

  setAnswer(e: any) {    
    if (this.item.valueType === ChecklistAnswerType.YES_NO) {
      let answer = undefined;
      let status = ChecklistQuestionStatus.COMPLETED;
      let actionRequired = false;
      if (e && e.value !== undefined) {
        answer = e.value;
        if (this.item.attachmentRequired && !this.item.attachmentCompleted) {
          status = ChecklistQuestionStatus.ATTACHMENT_MISSING;
          actionRequired = true;
        }        
      } else {                
        status = ChecklistQuestionStatus.READY;
      }
      /* if (
        answer !== this.item.value ||
        status !== this.item.status ||
        actionRequired !== this.item.actionRequired
      ) {
        const newItem: ChecklistFillingItem = { 
          ...this.item, 
          answer,
          status,
          actionRequired,
        };
        this._store.dispatch(updateChecklistQuestion({ item: newItem }));        
      } */        
    }      
  }

  checkCardWidth() {
    if (this.questionCard && this.questionCard.nativeElement) {
      this.adjustCardWidth(this.questionCard.nativeElement.clientWidth);
    }
  }

  adjustCardWidth(width: number) {
    this.showChart = width > 450 && this.item.showChart;
    // this.miniChartWidth = width * 0.15;
  }

  handleButton(e: any) {
    if (e === ButtonActions.RESET) {
      this.setAnswer(undefined);
    };
  }
    
// Getters ==================
  get ChecklistQuestionStatus() {
    return ChecklistQuestionStatus;
  }

  get cornerTooltip () {
    return this.item.status === ChecklistQuestionStatus.ATTACHMENT_MISSING
    ? 'Se requiere agregar un adjunto'
    : this.item.status === ChecklistQuestionStatus.CANCELLED
    ? 'La pregunta fue cancelada y no se requiere una respuesta'
    : 'Se requiere una acción';
  }

  get GeneralValues() {
    return GeneralValues; 
  }

// End ======================
}
