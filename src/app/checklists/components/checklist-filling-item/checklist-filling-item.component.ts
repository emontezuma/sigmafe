import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import { ChecklistQuestionStatus } from '../../models/checklists.models';
import { AppState } from 'src/app/state/app.state';
import { selectScreenFeature } from 'src/app/state/selectors/screen.selectors';
import { dissolve } from '../../../shared/animations/shared.animations';
import { EChartsOption } from 'echarts';
import { catchError, Observable, of, tap } from 'rxjs';
import { ButtonActions, dialogByDefaultButton, SharedState } from 'src/app/shared/models/screen.models';
import { CapitalizationMethod, ChecklistLine, GeneralValues, HarcodedVariableValueType, ProfileData, RecordStatus } from 'src/app/shared/models';
import { DomSanitizer } from "@angular/platform-browser";
import { FormControl, NgForm } from '@angular/forms';
import { SharedService } from 'src/app/shared/services';
import { GenericDialogComponent } from 'src/app/shared/components';
import { ChecklistsService } from '../../services';


@Component({
  selector: 'app-checklist-filling-item',
  templateUrl: './checklist-filling-item.component.html',
  animations: [ dissolve ],
  styleUrls: ['./checklist-filling-item.component.scss']
})
export class ChecklistFillingItemsComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('questionCard') questionCard: ElementRef;
  @ViewChild('f') private thisForm: NgForm;
  @Input() item: ChecklistLine;
  @Input() view: string;
  @Input() inactive: boolean;
  @Input() readonly: boolean;
  @Input() totalItems: number;
  @Input() moldId: number;
  @Output() answer = new EventEmitter<ChecklistLine>();  
  @Output() lastItemProcessed = new EventEmitter<boolean>();     

  chartOption: EChartsOption = {
    animationDuration: 200,
    title: {
      text: $localize`Gráfica de...`,      
    },
    xAxis: [ {
      type: 'category',
      axisLabel: {
        show: true,
        rotate: 75
      },
      data: [], 
    }],
    grid: {
      bottom: 120
    },
    yAxis: {
      type: 'value',      
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        name: 'ABC',
        data: [],
        type: 'line',
        label: {
          show: true,
          fontSize: 15,
          fontWeight: 600,
          backgroundColor: 'skyblue',
          padding: 5,
          precision: 2
        },
        smooth: true,
        color: 'green',
        areaStyle: {
          opacity: 0.25
        },        
      },
    ],
  };

  inputField = new FormControl('');
  inputTimeField = new FormControl('');
  formField = new FormControl('');
  chartRange = new FormControl('0');
  chartData: number[] = [];
  
  screen$: Observable<SharedState>;
  showProfileData$: Observable<ProfileData>;
  updateChecklistComment$: Observable<any>;
  chartData$: Observable<any>;
  observer;

  errorMessage: string = '';
  userProfile: ProfileData;
  showAttachments: boolean = false;
  showChart: boolean = false;
  showComments: boolean = false;
  miniChartWidth: number = 90;
  miniChartHeight: number = 50;
  fieldType: string = "text";
  outOfRange: boolean = false;
  addingComment: boolean = false;
  possibleValues: any = {};

  constructor (
    private _store: Store<AppState>,
    private _host: ElementRef, 
    private _checklistService: ChecklistsService,
    public sanitizer: DomSanitizer,
    public _sharedService: SharedService,
    public _dialog: MatDialog,
  ) { }

// Hooks ====================
  ngOnInit() {
    /* this.observer = new ResizeObserver(entries => {
      this._zone.run(() => {
        this.adjustCardWidth(entries[0].contentRect.width);        
      });
    });
    this.observer.observe(this._host.nativeElement);    */     
    console.log(this.item)
    if (this.item.state !== ChecklistQuestionStatus.COMPLETED) {
      this.setAnswer('##item.ByDefaultValue##');
    } else {
      if (this.item.buttons?.length > 0) {
        this.item.buttons[0].disabled = true;
        this.inputField.setValue(this.item.value);
      }
    }
    if (this.item.buttons?.length > 1 && this.item.comments.length > 0) {
      this.item.buttons[1].icon = 'messages_filled';
      this.item.buttons[1].tooltip = `Gestionar comentarios (${this.item.comments.length})`;
    }
    if (this.totalItems === this.item.order + 1) {
      this.lastItemProcessed.emit(true);
    }
    if (this.item.chartData.length > 0) {
      this.chartData = this.item.chartData.map((data: any) => {
        return +data.value;
      })
      this.chartOption.series[0].data = this.chartData;      
      this.chartOption.xAxis[0].data = this.item.chartData.map((data: any) => {
        return this._sharedService.formatDate(new Date(data.answeredDate), 'yy-MMM-dd HH:mm');
      })
      this.chartOption.series[0].name = this.item.uomName + ' (' + this.item.uomPrefix + ')';
      this.chartOption.title = {
        ...this.chartOption.title,
        text: `Gráfica de ${this.item.name}`,
        subtext: `(Expresado en ${this.item.uomName})`
      }
    }    
    
    this.possibleValues = this.item.possibleValues ? JSON.parse(this.item.possibleValues) : [];    
    /* this.screen$ = this._store.select(selectScreenFeature).pipe(
      tap( screenData => {
        if (this.questionCard) {
          this.checkCardWidth();
        } else {
          setTimeout(() => {
            this.checkCardWidth();
          }, 300);
        }
      })
    ); */

    this.inputField.valueChanges.subscribe((value) => {      
      this.item.state = ChecklistQuestionStatus.ACTIVE
      
    })

    this.inputTimeField.valueChanges.subscribe((value) => {      
      this.item.state = ChecklistQuestionStatus.ACTIVE
      
    })

    this.showProfileData$ = this._sharedService.showProfileData.pipe(
      tap((userProfile) => {
        console.log(userProfile);
        this.userProfile = userProfile;
      })
    );

  }
  
  ngAfterViewInit(): void {
    const chip = document.getElementsByName("chip");    
    chip.forEach((element) => {
      element?.style.setProperty('--mdc-chip-label-text-color', 'var(--theme-warn-contrast-500)');     
    });    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item']?.currentValue?.reset) {
      this.item.reset = false;
      this.setAnswer('##item.ByDefaultValue##');
      return
    }
    this.fieldType = (this.item.valueType === HarcodedVariableValueType.NUMERIC_RANGE || this.item.valueType === HarcodedVariableValueType.NUMBER) ? "number" : "text";
    if (this.item?.attachments) {
      this.item.attachments.concat(this.item.variableAttachments);
      this.item.attachments = this.item.attachments.map((a) => {
        return {
          ...a,
          pdfUrl: this.sanitizer.bypassSecurityTrustResourceUrl(a.image),
        }
      })
    }    
  }

  ngOnDestroy(): void {    
    if (!this.observer) return;
    this.observer.unobserve(this._host.nativeElement);
  }

// Functions ================

  completeAnswer() {
    
    let erroMessage = '';
    if (this.item.required && 
        (!this.inputField.value) || 
        (this.item.valueType === HarcodedVariableValueType.DATE_AND_TIME && (!this.inputField.value || !this.inputTimeField.value))
    ) {
      erroMessage = "Este valor es requerido"
      this.item.state = ChecklistQuestionStatus.ACTIVE;
    } else {
      this.item.state = this.inputField.value ? ChecklistQuestionStatus.COMPLETED : ChecklistQuestionStatus.ACTIVE;
    }


    if (this.item.valueType === HarcodedVariableValueType.NUMERIC_RANGE && !erroMessage) {        
      this.item.alarmed = this.inputField.value &&  ((Number(this.inputField.value) < Number(this.item.minimum)) ||
                                  (Number(this.inputField.value) > Number(this.item.maximum)));              
      erroMessage = this.item.alarmed && !erroMessage ? "Valor fuera de rango": erroMessage;
    }
    this.errorMessage = erroMessage;
    this.answer.emit({
      ...this.item,
      value: this.inputField.value
    });
  }

  setAnswer(e: any) {
    if (e  === '##item.ByDefaultValue##') {      
      let newAlarmed = false;
      let newStatus = ChecklistQuestionStatus.ACTIVE;
      let value = this.item.byDefault ? this.item.byDefault : "";
      let byDefault = this.item.byDefault;
      const possibleValues = this.item.possibleValues ? JSON.parse(this.item.possibleValues) : [];
      if (value) {
        newStatus = ChecklistQuestionStatus.COMPLETED;
      }
      this.inputField.setValue(value);
      if (possibleValues?.length > 0) {
        const byDefaultObject = possibleValues.filter((v) => v.byDefault);
        if (byDefaultObject.length > 0) {
          byDefault = byDefaultObject[0].byDefault;
          value = byDefaultObject[0].value;              
          newAlarmed = byDefaultObject[0].alarmedValue;
          newStatus = ChecklistQuestionStatus.COMPLETED;
        }
      } else if (this.item.valueType !== HarcodedVariableValueType.LIST) {        
        this.completeAnswer()
      }      
      this.item.state = newStatus;      
      this.item.alarmed = newAlarmed;      
      this.item.byDefault = byDefault;      
      this.answer.emit({
        ...this.item,
        value
      });
      return;
    }
    
    if (this.item.valueType === HarcodedVariableValueType.YES_NO || this.item.valueType === HarcodedVariableValueType.YES_NO_NA) {
      let state = ChecklistQuestionStatus.COMPLETED;
      let actionRequired = false;
      const value = e && e.value ? e.value : undefined;
      if (e && e.value !== undefined) {
        this.item.alarmed = value === GeneralValues.YES && (this.item.valueToAlarm === GeneralValues.YES || this.item.valueToAlarm === GeneralValues.YESNO) || value === GeneralValues.NO && (this.item.valueToAlarm === GeneralValues.NO || this.item.valueToAlarm === GeneralValues.YESNO);
      
        if (this.item.attachmentRequired && !this.item.attachmentCompleted) {
          state = ChecklistQuestionStatus.ATTACHMENT_MISSING;
          actionRequired = true;
        }        
      } else {
        state = ChecklistQuestionStatus.ACTIVE;
      }
      
      this.item.state = state;      
      this.answer.emit({
        ...this.item,
        value
      });
      /* if (
        answer !== this.item.value ||
        status !== this.item.state ||
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
    } else if (this.item.valueType === HarcodedVariableValueType.LIST) {
      let status = ChecklistQuestionStatus.COMPLETED;
      let actionRequired = false;
      const value = e && e.value ? e.value : null;
      if (e && e.value !== undefined) {
        const objectSelected = this.possibleValues.filter((v) => v.value === value);
        if (objectSelected.length > 0) {
          this.item.alarmed = objectSelected[0].alarmedValue; 
        }
        
        if (this.item.attachmentRequired && !this.item.attachmentCompleted) {
          status = ChecklistQuestionStatus.ATTACHMENT_MISSING;
          actionRequired = true;
        }        
      } else {
        status = ChecklistQuestionStatus.ACTIVE;      
        this.item.alarmed = false;
      }
      
      this.item.state = status;      
      this.answer.emit({
        ...this.item,
        value
      });
      /* if (
        answer !== this.item.value ||
        status !== this.item.state ||
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
    } else if (!e || e?.value !== undefined) {      
      this.inputField.setValue(null);
      this.inputTimeField.setValue(null);      
    }    
  }

  /* checkCardWidth() {
    if (this.questionCard && this.questionCard.nativeElement) {
      this.adjustCardWidth(this.questionCard.nativeElement.clientWidth);
    }
  }

  adjustCardWidth(width: number) {
    this.showChart = width > 450 && this.item.showChart;
    // this.miniChartWidth = width * 0.15;
  } */

  handleButton(e: any) {
    if (e === ButtonActions.RESET) {
      this.setAnswer(undefined);
    } else if (e === ButtonActions.SHOW_ATTACHMENTS) {
      this.showAttachments = !this.showAttachments;
    } else if (e === ButtonActions.SHOW_CHARTS) {
      this.showChart = !this.showChart;    
    } else if (e === ButtonActions.ALLOW_COMMENTS) {
      this.showComments = !this.showComments;    
    };
  }

  handleRemoveComment(id: number) {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`REMOVER COMENTARIO`,  
        topIcon: 'problems',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción removerá este comentario.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.removeComment(id);
      }
    });     
  }

  removeComment(id: number) {
    const dataToSave = {
      status: RecordStatus.INACTIVE,
      id,
      customerId: 1,
    }
    try {
      this.updateChecklistComment$ = this._checklistService.updateChecklistComment$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklistComment.length > 0) {          
            this.item.comments = this.item.comments.filter((c) => c.id !== id);
            if (this.item.buttons?.length > 1 && this.item.comments.length > 0) {
              this.item.buttons[1].icon = 'messages_filled';
              this.item.buttons[1].tooltip = `Gestionar comentarios (${this.item.comments.length})`;
            } else {
              this.item.buttons[1].icon = 'messages_empty';
              this.item.buttons[1].tooltip = `Gestionar comentarios`;
            }
            const message = $localize`Comentario removido...`;
            this._sharedService.showSnackMessage({
              message,
              duration: 3000,
              snackClass: 'snack-warn',
              icon: 'check',
            }); 
          } 
        }),
        catchError((error) => {          
          const message = $localize`Se generó un error al procesar el registro. Error: ${error}`;
          this._sharedService.showSnackMessage({
            message,
            duration: 5000,
            snackClass: 'snack-warn',
            icon: 'check',
          }); 
          return of(null);  
        })
      )    
    } catch (error) {
      const message = $localize`Se generó un error al procesar el registro. Error: ${error}`;
      this._sharedService.showSnackMessage({
        message,
        duration: 5000,
        snackClass: 'snack-warn',
        icon: 'check',
      });     
    }
  }

  saveComment() {
    const dateAndTime = this._sharedService.formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss');
    const dataToSave = {
      status: RecordStatus.ACTIVE,      
      commentDate: dateAndTime,
      commentById: this.userProfile.id,
      comment: this.formField.value,
      checklistLineId: this.item.line + 1,
      customerId: 1,
    }
    try {
      this.updateChecklistComment$ = this._checklistService.updateChecklistComment$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklistComment.length > 0) {          
            const c = data?.data?.createOrUpdateChecklistComment[0];
            this.item.comments.unshift({
              checklistLineId: c.checklistLineId,
              id: c.id,
              comment: c.comment,
              commentedBy: c.commentBy?.name,
              commentedById: c.commentBy?.id,
              commentDate: c.commentDate,
            })
            this.item.buttons[1].icon = 'messages_filled';
            this.item.buttons[1].tooltip = `Gestionar comentarios (${this.item.comments.length})`;
            const message = $localize`Comentario agregado...`;
            this.addingComment = false;
            this.formField.setValue('');
            
            this._sharedService.showSnackMessage({
              message,
              duration: 3000,
              snackClass: 'snack-primary',
              icon: 'check',
            }); 
          } 
        }),
        catchError((error) => {          
          const message = $localize`Se generó un error al procesar el registro. Error: ${error}`;
          this._sharedService.showSnackMessage({
            message,
            duration: 5000,
            snackClass: 'snack-warn',
            icon: 'check',
          }); 
          return of(null);  
        })
      )    
    } catch (error) {
      const message = $localize`Se generó un error al procesar el registro. Error: ${error}`;
      this._sharedService.showSnackMessage({
        message,
        duration: 5000,
        snackClass: 'snack-warn',
        icon: 'check',
      });     
    }
  }

  handleChartDataSourceSelectionChange(option: any) {
    let recordsToTake = null;
    let fromDate = null;
    const today = new Date();

    if (option.value == 0) {
      recordsToTake = 50
    } else if (option.value == 1) {
      recordsToTake = 25
    } else if (option.value == 2) {      
      fromDate = this._sharedService.formatDate(today.setDate(today.getDate() - 30), "yyyy-MM-dd");
    } else if (option.value == 3) {      
      fromDate = this._sharedService.formatDate(today.setDate(today.getDate() - 15), "yyyy-MM-dd");
    } else {
      fromDate = this._sharedService.formatDate(today.setDate(today.getDate() - 7), "yyyy-MM-dd");
    }
    const parameters = {
      filterBy: {
        variableId: {
          eq: this.item.variableId,
        },
        ...(fromDate) && { answeredDate: {
          gt: fromDate,
        } },
        state: {
          eq: ChecklistQuestionStatus.COMPLETED
        },
        checklist: {
          moldId: {
            eq: this.moldId
          },
          and: {
            state: {
              eq: "closed"
            }            
          }     
        }
      },
      ...recordsToTake && { recordsToTake },
    }
    this.chartData$ = this._checklistService.getLastValueByMoldChecklist$(parameters)
    .pipe(
      tap((chartDataResponse) => {
        this.chartData = [];  
        const data = chartDataResponse.data?.checklistLines?.items;
        this.chartData = data.map((value: any) => {
          return +value.value;
        });        
        this.chartOption = {
          ...this.chartOption,
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                show: true,
                rotate: 75
              },
              data: data.map((data: any) => {
                return this._sharedService.formatDate(new Date(data.answeredDate), 'yy-MMM-dd HH:mm');
              })
            }
          ],
          series: [
            {
              name: this.item.uomName + ' (' + this.item.uomPrefix + ')',
              data: this.chartData,
              type: 'line',
              label: {
                show: true,
                fontSize: 15,
                fontWeight: 600,
                backgroundColor: 'skyblue',
                padding: 5,
                precision: 2
              },
              smooth: true,
              color: 'green',
              areaStyle: {
                opacity: 0.25
              },        
            },
          ],
        }
      })
    );
  }
    
// Getters ==================
  get ChecklistQuestionStatus() {
    return ChecklistQuestionStatus;
  }

  get cornerTooltip () {
    return this.item.state === ChecklistQuestionStatus.ATTACHMENT_MISSING
    ? 'Se requiere agregar un adjunto'
    : this.item.state === ChecklistQuestionStatus.CANCELLED
    ? 'La pregunta fue cancelada y no se requiere una respuesta'
    : 'Se requiere una acción';
  }

  get GeneralValues() {
    return GeneralValues; 
  }

  get HarcodedVariableValueType() {
    return HarcodedVariableValueType;
  }

  get CapitalizationMethod() {
    return CapitalizationMethod;
  }

// End ======================
}
