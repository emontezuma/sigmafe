import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";
import { MatDialog } from '@angular/material/dialog';

import { routingAnimation, dissolve, fastDissolve, fromTop } from '../../../shared/animations/shared.animations';
import { SmallFont, SpinnerFonts, SpinnerLimits } from 'src/app/shared/models/colors.models';
import { ApplicationModules, ButtonActions, ButtonMenuModel, GoTopButtonStatus, ScreenSizes, SimpleMenuOption, ToolbarButtonClicked, ToolbarElement, dialogByDefaultButton, toolbarMode } from 'src/app/shared/models/screen.models';
import { AppState } from '../../../state/app.state'; 
import { SharedService } from 'src/app/shared/services/shared.service';
import { SettingsData } from 'src/app/shared/models/settings.models';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { ChecklistQuestionStatus, ChecklistFillingData, ChecklistState, emptyChecklistFillingData } from 'src/app/checklists/models/checklists.models';
import { catchError, combineLatest, EMPTY, map, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { selectChecklistFillingData, selectLoadingChecklistFillingState } from 'src/app/state/selectors/checklists.selectors';
import { GenericDialogComponent } from 'src/app/shared/components';
import { HarcodedVariableValueType, RecordStatus, CapitalizationMethod, originProcess, GeneralValues, Attachment } from 'src/app/shared/models/helpers.models';
import { CatalogsService } from 'src/app/catalogs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChecklistsService } from '../../services';
import { ChecklistTemplateDetail, ChecklistTemplateLine, emptyChecklistTemplateItem } from '../../models/catalogs-checklist-templates.models';
import { ChecklistLine } from 'src/app/shared/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-checklist-filling',
  templateUrl: './checklist-filling.component.html',
  animations: [ routingAnimation, dissolve, fastDissolve, fromTop ],
  styleUrls: ['./checklist-filling.component.scss']
})
export class ChecklistFillingComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
  @ViewChild('fileInputAttachment') FileSelectInputDialog: ElementRef;
  @ViewChild('checklistFilling') private checklistFilling: ElementRef;
  @ViewChildren('questionCards') private questionCards: QueryList<ElementRef>;
  
// Variables ===============
  panelOpenState: boolean[] = [];
  limits: SpinnerLimits[] = [];
  fonts: SpinnerFonts[] = [{
    start: 0,
    finish: 100,
    size: 1.5,
    weight: 700,
  },{
    start: 100,
    finish: 999,
    size: 1.3,
    weight: 500,
  },{
    start: 999,
    finish: 0,
    size: 1,
    weight: 300,
  }];
  fontsSmall: SpinnerFonts[] = [{
    start: 0,
    finish: 100,
    size: 1.3,
    weight: 700,
  },{
    start: 100,
    finish: 999,
    size: 1,
    weight: 500,
  }];
  smallFont: SmallFont = {
    size: 0.9,
    weight: 300,
  }  
  smallestFont: SmallFont = {
    size: 0.9,
    weight: 300,
  }  
  showPrefix = false;
  settingsData: SettingsData;
  colsBySize: number = 2;
  currentSize: ScreenSizes = ScreenSizes.NORMAL;
  loading: boolean = true;
  animate: boolean = true;
  animatingQuestion: boolean = false;
  elements: ToolbarElement[] = [];
  onTopStatus: string  = 'inactive';
  goTopButtonTimer: any;
  loaded: boolean = false;  
  editing: boolean = false;  
  firstTime: boolean = true;  
  currentTabIndex: number = 1;
  checklistProgress: number = 0;
  animationTimeout: any;
  takeRecords: number = 50;
  linesOrder: any = JSON.parse(`{ "line": "${'ASC'}" }`);
  attachmentsEnabled: boolean = false;

  scroll$: Observable<any>;
  settingsData$: Observable<SettingsData>;
  toolbarClick$: Observable<ToolbarButtonClicked>;    
  checklistFillingData$: Observable<ChecklistFillingData>;  
  checklistInUsegData$: Observable<any>;  
  showGoTop$: Observable<GoTopButtonStatus>;
  checklistFillingLoading$: Observable<boolean>;
  everySecond$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  limitTime: any;
  lapse: any;
  checklistStartDate: string = '';
  uploadFiles: Subscription;
  attachmentsTableColumns: string[] = [ 'index', 'icon', 'name', 'actions-attachments' ];
  attachmentsTable = new MatTableDataSource<Attachment>([]);
  downloadFiles: Subscription;
  checklistTemplateAttachmentLabel: string = '';

  statusTo: any[] = [
    {
      status: RecordStatus.ACTIVE,
      action: 'init'
    },{
      status: RecordStatus.ACTIVE,
      action: 'reset'
    },{
      status: RecordStatus.ACTIVE,
      action: 'reassign'
    },{
      status: RecordStatus.ACTIVE,
      action: 'unlock'
    },{
      status: RecordStatus.ACTIVE,
      action: 'save'
    },{
      status: RecordStatus.ACTIVE,
      action: 'attachments'
    },{
      status: RecordStatus.ACTIVE,
      action: 'save'
    },{
      status: RecordStatus.ACTIVE,
      action: 'cancel'
    },{
      status: RecordStatus.ACTIVE,
      action: 'discard'
    },{
      status: RecordStatus.ACTIVE,
      action: 'approve'
    },{
      status: RecordStatus.ACTIVE,
      action: 'disapprove'
    }    
  ];

  stateTo: any[] = [
    {
      state: ChecklistState.IN_PROGRESS,
      action: 'save'
    },{
      state: ChecklistState.IN_PROGRESS,
      action: 'reset'
    },{
      state: ChecklistState.IN_PROGRESS,
      action: 'attachments'
    },{
      state: ChecklistState.IN_PROGRESS,
      action: 'cancel'
    },{
      state: ChecklistState.IN_PROGRESS,
      action: 'discard'
    },{
      state: ChecklistState.IN_PROGRESS,
      action: 'approve'
    },{
      state: ChecklistState.IN_PROGRESS,
      action: 'disapprove'
    },{
      state: ChecklistState.IN_PROGRESS,
      action: 'reassign'    
    },{
      state: ChecklistState.IN_PROGRESS,
      action: 'unlock'    
    },{
      state: ChecklistState.CLOSED,
      action: 'discard'
    },{
      state: ChecklistState.COMPLETED,
      action: 'discard'    
    },{
      state: ChecklistState.CREATED,
      action: 'init'    
    },{
      state: ChecklistState.CREATED,
      action: 'reassign'    
    },{
      state: ChecklistState.CREATED,
      action: 'unlock'    
    } 
  ];

  // Checklist template
  checklistTemplate: ChecklistTemplateDetail = emptyChecklistTemplateItem;
  checklistTemplate$: Observable<any>;
  checklistTemplateLines: ChecklistTemplateLine[] = [];
  updateChecklistState$: Observable<any>;
  addAttachmentButtonClick: boolean = false;
  
  unsavedChanges: boolean = false;
  noQuestions: boolean = false;
  showSpinner: boolean = false;
  loadFromButton: number = -1;
  checklist: ChecklistFillingData = emptyChecklistFillingData;
  progressText: string = '';
  alarmedToolTip: string = '';
  countdownToolTip: string = '';
  classLegacy: string = 'spinner-card-font';
  classLegacyForTab: string = 'spinner-card-font-tab';
  pendingToolbarButtonIndex: number = null;
  layout: ButtonMenuModel = {
    caption: $localize`Layout`,
    tooltip: $localize`Cambiar el layoout del checklist`,
    options: [{
      caption: $localize`Flexbox`,
      icon: 'attachment',
      value: 'flexbox',
      },
      {
        caption: $localize`Checklist`,
        icon: 'checklist',
        value: 'checklist',
        default: true,
      },
      {
        caption: $localize`Pregunta por página`,
        template: $localize`Pregunta por página`,
        icon: 'reload',
        value: 'questionByPage',
      },
    ],
  }

  view: ButtonMenuModel = {
    caption: $localize`Vista`,
    tooltip: $localize`Cambiar la vista del checklist`,
    options: [{
        caption: $localize`Ver respondidas`,
        template: $localize`Ver respondidas`,
        icon: 'attachment',
        value: 'answered',
      },
      {
        caption: $localize`Ver sin responder`,
        template: $localize`Ver sin responder`,
        icon: 'checklist',
        value: 'unanswered',
      },
      {
        caption: $localize`Ver todas`,
        template: $localize`Ver todas`,
        icon: 'reload',
        value: 'all',
        default: true,
      },      
    ]
  };

  checklistForm = new FormGroup({
    name: new FormControl(
      '', 
      Validators.required,      
    ),
    moldStates: new FormControl(''),
    
    expiringMessageSubject:  new FormControl(''),    
    expiringMessageBody:  new FormControl(''),
    expiringNotificationMode:  new FormControl(''),
    expiringChannels:  new FormControl(''),
    
    alarmNotificationMode:  new FormControl(''),
    alarmNotificationChannels:  new FormControl(''),
    alarmNotificationMessageSubject:  new FormControl(''),
    alarmNotificationMessageBody:  new FormControl(''),
    
    approvalNotificationMode:  new FormControl(''),
    approvalRequestChannels:  new FormControl(''),
    approvalRequestMessageSubject:  new FormControl(''),
    approvalRequestMessageBody:  new FormControl(''),
    
    anticipationMessageSubject:  new FormControl(''),
    anticipationNotificationMode:  new FormControl(''),
    anticipationChannels:  new FormControl(''),
    anticipationMessageBody:  new FormControl(''),
    generationNotificationMode:  new FormControl(''),
    generationChannels:  new FormControl(''),    
    generationMessageSubject:  new FormControl(''),
    generationMessageBody:  new FormControl(''),    
    molds:  new FormControl(''),
    notes: new FormControl(''),
    mainImageName: new FormControl(''),    
    reference: new FormControl(''),    
    prefix: new FormControl(''),        
    
    timeToFill: new FormControl(0),       
  });

  selectedLayout: SimpleMenuOption = this.layout.options[0];
  selectedView: SimpleMenuOption = this.view.options[2];
  elapsedTime: string;
  showElapsedTime: string = 'noShow';  
  form = new FormGroup({
  });

  constructor (
    private _store: Store<AppState>,
    public _sharedService: SharedService,
    public _scrollDispatcher: ScrollDispatcher,
    public _dialog: MatDialog,
    private _catalogsService: CatalogsService,
    private _checklistService: ChecklistsService,
    private _route: ActivatedRoute,
    private _http: HttpClient,
    private _router: Router,
  ) { }

// Hooks ====================
  ngOnInit(): void {
    // Dispatches
    // this._store.dispatch(loadChecklistFillingData());

    this.everySecond$ = this._sharedService.pastSecond.pipe(
      tap((pulse) => {
        if (!this.checklist.startDate) return;
        const startDate = new Date(this._sharedService.convertUtcTolocal(this.checklist.startDate));
        startDate.setSeconds(startDate.getSeconds() + +this.checklist.timeToFill);          
        const limitTime = this._sharedService.formatDate(startDate ?? new Date(), 'yyyy/MM/dd HH:mm:ss');
          
        const elapsedTime = this._sharedService.datesDifferenceInSeconds(limitTime);
        if (elapsedTime.message.substring(0, 5) !== 'error') {
          if (elapsedTime.totalSeconds < 0) {          
            if (elapsedTime.totalSeconds * -1 < 600) {
              this.countdownToolTip = $localize`Falta poco para completar el checklist`;
              this.showElapsedTime = 'showAlert';
            } else {
              this.showElapsedTime = 'showNormal';
              this.countdownToolTip = $localize`Cuenta regresiva...`;
            }
          } else {
            this.showElapsedTime = 'showExpired';
            this.countdownToolTip = $localize`Checklist expirado...`;
          }
          this.elapsedTime = (elapsedTime.days !== '0' ? (elapsedTime.days + 'd ') : '') + elapsedTime.hours + ':' + elapsedTime.minutes + ':' + elapsedTime.seconds;
        } else {
          this.showElapsedTime = 'showError';
          this.elapsedTime = 'Error/Fecha';
          this.countdownToolTip = $localize`Error en la fecha`;
        }        
      })
    );
    this.checklistFillingLoading$ = this._store.select(selectLoadingChecklistFillingState).pipe(
      tap( loading => {
        this.loading = loading;
        this._sharedService.setGeneralLoading(
          ApplicationModules.CHECKLIST_FILLING,
          loading,
        );
        this._sharedService.setGeneralProgressBar(
          ApplicationModules.CHECKLIST_FILLING,
          loading,
        );      
        this.loading = loading;
        if (!loading) {          
          setTimeout(() => {
            if (this.pendingToolbarButtonIndex) {
              this.elements[this.pendingToolbarButtonIndex].loading = loading;
              this.pendingToolbarButtonIndex = null;
            }            
          }, 200);
        }
      })
    );  
    this.toolbarClick$ = this._sharedService.toolbarAction.pipe(
      tap((buttonClicked: ToolbarButtonClicked) => {      
        if (buttonClicked.from !== ApplicationModules.CHECKLIST_FILLING) {
            return
        }
        this.toolbarAction(buttonClicked);
      }
    ));
    this.settingsData$ = this._store.select(selectSettingsData).pipe(
      tap(settingsData => {
        this.settingsData = settingsData;

      })
    );
    this._sharedService.search.subscribe((searchBox) => {
      if (searchBox.from === ApplicationModules.CHECKLIST_FILLING) {
        // this.filterMoldsBy = searchBox.textToSearch;  
      }
    });
    this.checklistFillingData$ = this._store.select(selectChecklistFillingData).pipe(
      tap((checklistFillingData: ChecklistFillingData) => {        
        this.loadChecklist(checklistFillingData, !this.loading && !this.loaded);      
        if (!this.loading && !this.loaded) {
          this.loaded = true;          
        }
        if (!this.loading) {
          if (this.loadFromButton > -1) {          
            this.elements[this.loadFromButton].loading = false;
            this.loadFromButton = -1;          
          }          
        }
      })
    );
    this.showGoTop$ = this._sharedService.showGoTop.pipe(
      tap((goTop) => {
        if (goTop.status === 'temp') {
          this.onTopStatus = 'active';
          this.checklistFilling.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          // Ensure
        }      
      })
    );
    this.scroll$ = this._scrollDispatcher
    .scrolled()
    .pipe(
      tap((data: any) => {      
        this.getScrolling(data);
      })
    );
    this.parameters$ = this._route.params.pipe(
      tap((params: Params) => {
        if (params['id']) {
          this.editing = true;
          this.requestChecklistData(+params['id']);
        }
      })
    ); 

    // Settings
    this.setLayout(this.checklist?.viewType);
  }

  ngAfterViewInit(): void {
    // const progressBars = document.getElementsByName("active-progress-bar");
    // progressBars.forEach((element) => {
    //   element?.style.setProperty('--mdc-linear-progress-track-color', 'var(--z-colors-page-background-color)');     
    // });
    const chip = document.getElementsByName("chip");    
    chip.forEach((element) => {
      // element?.style.setProperty('--mdc-chip-label-text-color', 'var(--theme-warn-contrast-500)');     
    });
    this.questionCards.changes.subscribe((components: QueryList<ElementRef>) => {
      console.log(components);
    });    
  }

  ngOnDestroy(): void {
    this._sharedService.setToolbar({
      from: ApplicationModules.CHECKLIST_FILLING,
      show: false,
      showSpinner: false,
      buttonsToLeft: 8,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.CHECKLIST_FILLING,
      false,
    );   
    if (this.uploadFiles) this.uploadFiles.unsubscribe();
    if (this.downloadFiles) this.downloadFiles.unsubscribe();     
  }

// Functions ================
  animationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this.calcElements();
        this._sharedService.setToolbar({
          from: ApplicationModules.CHECKLIST_FILLING,
          show: true,
          buttonsToLeft: 8,
          showSpinner: false,
          toolbarClass: 'toolbar-grid',
          dividerClass: 'divider',
          elements: this.elements,
          alignment: 'left',
        });
        this._sharedService.setGeneralScrollBar(
          ApplicationModules.CHECKLIST_FILLING,
          true,
        );
        this._sharedService.setGeneralLoading(
          ApplicationModules.CHECKLIST_FILLING,
          false,
        ); // TODO: After recovery the data
      }, 500);
    }
  }

  requestChecklistTemplateData(checklistTemplateId: number): void { 
    let variables = undefined;
    variables = { checklistTemplateId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "checklistTemplateId": { "eq": ${checklistTemplateId} } }`);
    const filterForLines = JSON.parse(`{ "checklistTemplateDetail": { "checklistTemplateId": { "eq": ${checklistTemplateId} } } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    const process = originProcess.CATALOGS_CHECKLIST_ATTACHMENTS;
    // let getData: boolean = false;
    this.checklistTemplate$ = this._catalogsService.getChecklistTemplateDataGql$({ 
      checklistTemplateId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter, 
      filterForLines,
      process,
      customerId: 1, // TODO
      orderForDetails: this.linesOrder,
    }).pipe(
      map(([ checklistTemplateGqlData, checklistTemplateGqlTranslationsData, checklistTemplateGqlAttachments, checklistTemplateGqlLines ]) => {
        return this._catalogsService.mapOneChecklistTemplate({
          checklistTemplateGqlData,  
          checklistTemplateGqlTranslationsData,
          checklistTemplateGqlAttachments,
          checklistTemplateGqlLines,
        })
      }),
      tap((checklistTemplateData: ChecklistTemplateDetail) => {
        if (!checklistTemplateData) return;
        this.checklistTemplate =  checklistTemplateData;        
        this.checklistTemplateLines =  checklistTemplateData.lines;
        // this.checklist.lines =  [...checklistTemplateData.lines];
      }),
      switchMap((checklistTemplateData: ChecklistTemplateDetail) => {
        const lineAttachmentsObservablesArray: Observable<any>[] = [];
        const variableAttachmentsObservablesArray: Observable<any>[] = [];
        const lastValuesByChecklistLineArray: Observable<any>[] = [];
        const commentsByChecklistLineArray: Observable<any>[] = [];

        for (const line of checklistTemplateData?.lines) {
          lineAttachmentsObservablesArray.push(this.mapChecklistTemplatesDetailAttachments$(line['id']));
          variableAttachmentsObservablesArray.push(this.mapChecklistTemplatesDetailVariableAttachments$(line['variableId']));
          const parameters = {
            filterBy: {
              variableId: {
                eq: line['variableId']
              },
              state: {
                eq: ChecklistQuestionStatus.COMPLETED
              },
              checklist: {
                moldId: {
                  eq: this.checklist.moldId
                },
                and: {
                  state: {
                    eq: "closed"
                  }            
                }     
              }
            },
            recordsToTake: 50,
          }
          const parametersForComments = {
            filterBy: {
              checklistLineId: {
                eq: line['id']
              },
              status: {
                eq: 'active'
              },
            },            
          }
          lastValuesByChecklistLineArray.push(this.mapChecklistLastValues$(parameters));
          commentsByChecklistLineArray.push(this.mapChecklisLineComments$(parametersForComments));          
        }
        if (lineAttachmentsObservablesArray.length > 0) {
          return combineLatest([ combineLatest(lineAttachmentsObservablesArray), combineLatest(variableAttachmentsObservablesArray), combineLatest(lastValuesByChecklistLineArray), combineLatest(commentsByChecklistLineArray) ]);
        } else {
          return of([]);
        }
      }),
      tap((attachments: any) => {
        // this.mapLines(attachments);
        
        for (const [index, line] of this.checklistTemplateLines.entries()) {
          line.attachments = attachments[0][index]?.data?.uploadedFiles?.items?.map((a) => {
            return {
              index: a.line,
              name: a.fileName, 
              id: a.fileId, 
              image: `${environment.serverUrl}/files/${a.path}`, 
              icon: this._sharedService.setIconName(a.fileType), 
              containerType: this._sharedService.setContainerType(a.fileType), 
            }            
          });
          if (attachments.length > 1) {
            line.variableAttachments = attachments[1][index]?.data?.uploadedFiles?.items?.map((a) => {
              return {
                index: a.line,
                name: a.fileName, 
                id: a.fileId, 
                image: `${environment.serverUrl}/files/${a.path}`, 
                icon: this._sharedService.setIconName(a.fileType), 
                containerType: this._sharedService.setContainerType(a.fileType), 
              }            
            });
          };          
          line.buttons = this.mapButton(line.buttons, 'reset', line.attachments?.length + line.variableAttachments?.length);            
          line.buttons = this.mapButton(line.buttons, 'comments', line.comments?.length);
          if (line.attachments.length > 0 || line.variableAttachments.length > 0) {
            line.buttons = this.mapButton(line.buttons, 'showAttachments', line.attachments.length + line.variableAttachments.length);            
          }        

          if (line.showChart === GeneralValues.YES) {
            line.buttons = this.mapButton(line.buttons, 'chart');            
          }  
          
        }

        const lastValues = attachments[2].map((l) => {
          const data = l.data?.checklistLines?.items;
          if (data?.length > 0) {
            return {
              id: data[0].id,
              alarmed: data[0].alarmed,
              answeredDate: data[0].answeredDate,
              user: data[0].checklist?.assignedTo?.name,
              lastChecklistId: data[0].checklist?.id,
              lastValue: data[0].value,
            }
          }
          return {
            id: 0
          }
        })
        .filter((r) => r.id !== 0);

        let comments = [];  
        attachments[3].forEach((commentsResponse) => {
          const data = commentsResponse.data?.checklistComments?.items;
          comments = comments.concat(data);
        });

        let chartData = [];  
        attachments[2].forEach((chartDataResponse) => {
          const data = chartDataResponse.data?.checklistLines?.items;
          if (data?.length > 0) {
            chartData = chartData.concat(data);
          }          
        });

        comments = comments.map((c) => {
          return {
            checklistLineId: c.checklistLineId,
            id: c.id,
            comment: c.comment,
            commentedBy: c.commentBy?.name,
            commentedById: c.commentBy?.id,
            commentDate: c.commentDate,
          }
        });

        this.checklist.lines = this.checklist.lines.map(cl => {          
          let uomName = '';
          
          const { data } = cl;
          const { checklistId, checklistTemplateDetailId, variableId, equipmentId, state, line, alarmed, alarmedDate, value, answeredDate, lastAnswer, id, status } = data;
          let template: any = {};

          let lastValue = '';
          let lastValueDate = '';
          let lastValueUser = '';
          let lastValueAlarmed = '';          
          let lastChecklistId = '';
          let lineComments = [];
          let lineChartData = [];
          
          for (const cld of this.checklistTemplateLines) {
            if (cl.checklistTemplateDetailId === cld.id) {              
              uomName = cld.uomName;
              template = cld;

              for (const lv of lastValues) {
                if (cl.id === lv.id) {
                  lastValue = lv.lastValue;
                  if (template.valueType === HarcodedVariableValueType.YES_NO || template.valueType === HarcodedVariableValueType.YES_NO_NA) {
                    lastValue = lastValue === GeneralValues.YES ? "'Sí'" : lastValue === GeneralValues.NO ? "'No'" : "'N/A'";
                  }
                  lastValueDate = lv.answeredDate;
                  lastValueUser = lv.user;
                  lastValueAlarmed = lv.alarmed;
                  lastChecklistId = lv.lastChecklistId;
                  break;  
                }
              }
              
              for (const c of comments) {
                if (cl.id === c.checklistLineId) {
                  lineComments = lineComments.concat(c);                  
                }
              }

              for (const c of chartData) {
                if (cl.data?.variableId === c.variableId) {
                  lineChartData = lineChartData.concat(c);                  
                }
              }

              lineChartData
              break;  
            }
          }
          
          return {
            ...template,
            checklistId, 
            checklistTemplateDetailId, 
            variableId, 
            equipmentId,
            state, 
            line, 
            alarmedDate, 
            answeredDate, 
            lastAnswer,
            value: state === ChecklistQuestionStatus.COMPLETED || state === ChecklistState.IN_PROGRESS && this.checklist.completed === GeneralValues.YES ? value : null,
            id, 
            uomName,
            alarmed: state === ChecklistQuestionStatus.COMPLETED || state === ChecklistState.IN_PROGRESS && this.checklist.completed === GeneralValues.YES ? alarmed : false,
            lastValue,
            lastValueDate,
            lastValueUser,
            lastValueAlarmed,
            lastChecklistId,
            comments: lineComments,
            chartData: lineChartData,
          }
        })
        this.checklistTotalization();
        this.updateSelectedViewArray();
        this.evaluateButtons();
        this.setTabIndex(1);

        this.loaded = true;
        setTimeout(() => {
          // this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        }, 200);                    
        setTimeout(() => {
          if (this.pendingToolbarButtonIndex) {
            this.elements[this.pendingToolbarButtonIndex].loading = false;  
            this.pendingToolbarButtonIndex = null;
          }
        }, 200);
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
  }

  mapButton(buttons: any[], type: string, totalRecords: number = 0) {
    if (!buttons) buttons = [];
    if (type === 'showAttachments') {
      return buttons.concat({
        type: 'button',
        icon: 'attachment',
        tooltip: `Ver adjunto(s) relacionado(s) (${totalRecords})`,
        action: ButtonActions.SHOW_ATTACHMENTS,
        disabled: false,
      });      
    } else if (type === 'reset') {
      return buttons.concat({
        type: 'button',
        icon: 'cancel',
        tooltip: 'Reiniciar respuesta',
        action: ButtonActions.RESET,
        disabled: false,
      });      
    } else if (type === 'comments') {
      return buttons.concat({
        type: 'button',
        icon: 'messages_empty',
        tooltip: `Gestionar comentarios`,
        action: ButtonActions.ALLOW_COMMENTS,
        disabled: false,
      });      
    } else if (type === 'chart') {
      return buttons.concat({
        type: 'button',
        icon: 'economics',
        tooltip: `Ver el gráfico`,
        action: ButtonActions.SHOW_CHARTS,
        disabled: false,
      });      
    }
    return buttons;
  }

  mapChecklistTemplatesDetailAttachments$(processId: number): Observable<any> {
    return this._catalogsService.getAttachmentsDataGql$({
      processId,
      process: originProcess.CATALOGS_CHECKLIST_TEMPLATE_LINES_ATTACHMENTS,
      customerId: 1, //TODO get Customer from user profile
    });
  }

  mapChecklistTemplatesDetailVariableAttachments$(processId: number): Observable<any> {
    return this._catalogsService.getAttachmentsDataGql$({
      processId,
      process: originProcess.CATALOGS_VARIABLES_ATTACHMENTS,
      customerId: 1, //TODO get Customer from user profile
    });
  }

  mapChecklistLastValues$(parameters: any): Observable<any> {
    return this._checklistService.getLastValueByMoldChecklist$(parameters);
  }

  mapChecklisLineComments$(parameters: any): Observable<any> {
    return this._checklistService.getLastCommentsByChecklistLine$(parameters);
  }

  requestChecklistData(checklistId: number): void { 
    let variables = undefined;
    variables = { checklistId };

    const skipRecords = 0;
    const filter = JSON.parse(`{ "id": { "eq": ${checklistId} } }`);
    const order: any = JSON.parse(`{ "language": { "name": "${'ASC'}" } }`);
    const process = originProcess.CHECKLIST_ATTACHMENTS;
    const filterForLines = JSON.parse(`{ "data": { "checklistId": { "eq": ${checklistId} } } }`);
    // let getData: boolean = false;
    this.setViewLoading(true); 
    this.checklistFillingData$ = this._checklistService.getChecklistDataGql$({ 
      checklistId, 
      skipRecords, 
      takeRecords: this.takeRecords, 
      order, 
      filter,
      filterForLines,
      process,
      customerId: 1, // TODO
      orderForDetails: this.linesOrder,
    }).pipe(
      map(([ checklistGqlData, checklistGqlAttachments, checklistGqlLines ]) => {
        return this._checklistService.mapOneChecklist({
          checklistGqlData,  
          checklistGqlAttachments,
          checklistGqlLines,
        })
      }),
      tap((checklistData: any) => {
        if (!checklistData) return;
        this.requestChecklistTemplateData(checklistData.checklistTemplateId)
          this.checklist = checklistData;
        this.setChecklistDates();
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklist.attachments);        
        this.setAttachmentLabel();
      }),
      tap((attachments: any) => {
        // this.mapLines(attachments);
        this.updateFormFromData();        
      }),
      catchError(err => {
        console.log(err);
        alert(err.message);
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
  } 

  setChecklistDates() {
    if (this.checklist.startDate) {          
      this.checklistStartDate =  this._sharedService.capitalization(this._sharedService.formatDate(this._sharedService.convertUtcTolocal(this.checklist.startDate), 'EEEE d MMM yyyy hh:mm:ss a'), CapitalizationMethod.FIRST_LETTER_PHRASE);
      const startDate = new Date(this._sharedService.convertUtcTolocal(this.checklist.startDate));
      startDate.setSeconds(startDate.getSeconds() + +this.checklist.timeToFill);          
      this.limitTime = this._sharedService.formatDate(startDate ?? new Date(), 'yyyy/MM/dd HH:mm:ss');
      this.limitTime = this._sharedService.capitalization(this._sharedService.formatDate(this.limitTime, 'EEEE d MMM yyyy hh:mm:ss a'), CapitalizationMethod.FIRST_LETTER_PHRASE)

      const completeTime = new Date(this.checklist.timeToFill * 1000).toISOString().slice(11, 19);
      this.lapse = completeTime;
      
    } else {
      this.limitTime = $localize`Indeterminado...`;
      this.checklistStartDate =  $localize`Checklist no iniciado...`;
    }
  }

  calcElements() {    
    this.elements = [{
      type: 'button',
      caption: $localize`Regresar...`,
      tooltip:  $localize`Regresar a la lista de checklists`,
      icon: 'arrow_left',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      alignment: 'left',
      showCaption: true,
      loading: false,
      disabled: false,
      visible: true,
      action: ButtonActions.BACK,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      alignment: 'left',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: false,
      action: undefined,
      loading: false,
      visible: true,
    },{
      type: 'button',
      caption: $localize`Iniciar`,
      tooltip:  $localize`Inicia éste checklist`,
      alignment: 'left',
      icon: 'time',
      class: 'accent',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: true,
      loading: false,
      visible: true,
      action: ButtonActions.START,
    },{
      type: 'button',
      caption: $localize`Reiniciar`,
      tooltip:  $localize`Reinicia el checklist`,
      icon: 'time_cycles',
      alignment: 'left',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: true,
      visible: false,
      action: ButtonActions.RESET,
    },{
      type: 'button',
      caption: $localize`Reasignar`,
      tooltip:  $localize`Reasignar el usuario de llenador del checklist`,
      icon: 'admin',
      alignment: 'left',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: true,
      visible: false,
      action: ButtonActions.REASSIGN,
    },{
      type: 'button',
      caption: $localize`Aprobar`,
      tooltip:  $localize`Aprueba este checklist`,
      icon: 'check',
      alignment: 'left',
      class: 'primary',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: true,
      visible: false,
      action: ButtonActions.APPROVE,
    },{
      type: 'button',
      caption: $localize`Rechazar`,
      tooltip:  $localize`Rechaza este checklist`,
      icon: 'cross',
      alignment: 'left',
      class: 'warn',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: true,
      visible: false,
      action: ButtonActions.DISAPPROVE,
    },{
      type: 'button',
      caption: $localize`Descartar`,
      tooltip:  $localize`Descartar el checklist`,
      icon: 'problems',
      alignment: 'left',
      class: 'warn',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: true,
      visible: false,
      action: ButtonActions.DISCARD,
    },{
      type: 'button',
      caption: $localize`Desbloquear`,
      tooltip:  $localize`Desbloquea éste checklist`,
      icon: 'lock_open',
      class: '',
      alignment: 'left',      
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: false,
      visible: true,
      action: ButtonActions.UNLOCK,
    },{
      type: 'button',
      caption: $localize`Guardar`,
      tooltip:  $localize`Guarda éste checklist`,
      icon: 'save',
      class: 'primary',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: true,
      loading: false,
      visible: true,
      action: ButtonActions.SAVE,
    },{
      type: 'button',
      caption: $localize`Cancelar`,
      tooltip:  $localize`Cancela la edición éste checklist`,
      icon: 'cancel',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: true,
      loading: false,
      visible: true,
      action: ButtonActions.CANCEL,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: false,
      action: undefined,
      loading: false,
      visible: false,
    },{
      type: 'button',
      caption: $localize`Adjuntos`,
      tooltip: $localize`Gestionar adjuntos`,
      icon: 'attachment',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: true,
      showCaption: true,
      disabled: false,
      action: ButtonActions.UPLOAD_FILE,
      loading: false,
      visible: false,
    }];
  }

  trackByFn(index: any, item: any) { 
    return index; 
  }

  getScrolling(data: CdkScrollable) {       
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;    
    let status = 'inactive'
    if (scrollTop < 5) {
      status = 'inactive';
    } else if (this.onTopStatus !== 'temp') {
      status = 'active';
      clearTimeout(this.goTopButtonTimer);
      this.goTopButtonTimer = setTimeout(() => {
        if (this.onTopStatus !== 'inactive') {
          this.onTopStatus = 'inactive';
          this._sharedService.setGoTopButton(
            ApplicationModules.GENERAL,
            'inactive',
          );
        }
        return;
      }, 2500);
    }    
    if (this.onTopStatus !== status) {
      this.onTopStatus = status;
      this._sharedService.setGoTopButton(
        ApplicationModules.GENERAL,
        status,
      );
    }
  }

  setTabIndex(tab: any) { 
    this.currentTabIndex = 1;
    if (tab === 1 && this.checklist.state === ChecklistState.CREATED) {
      const message = $localize`Inicie el checklist para poder responder las preguntas`;
      this._sharedService.showSnackMessage({
        message,
        duration: 3000,
        snackClass: 'snack-primary',      
        icon: 'check',
      }); 
    }
  }

  setView(value: string) {
    if (!value) {
      this.selectedView = this.view.options[0];
    }
    //Init the spinner
    this.showSpinner = true;
    this.selectedView = this.view.options.find((view) =>
      view.value === value
    );
    let noQuestions = false;    
    if (this.selectedView.value === 'answered') {
      noQuestions = this.checklist.questionsCompleted === 0;
    } else if (this.selectedView.value === 'unanswered') {
      noQuestions = (this.pendingQuestions + this.attachmentMissingQuestions) === 0;
    } else {
      noQuestions = this.checklist.lines.length === 0;
    } 
    setTimeout(() => {
      this.noQuestions = noQuestions;
      this.showSpinner = false;
    }, 300);      
  }

  setLayout(value: string) {
    if (!value) {
      this.selectedLayout = this.layout.options[0];
    }
    this.selectedLayout = this.layout.options.find((layout) =>
      layout.value === value
    )
  }

  getAnswerByIndex(order: number): any {
    return this.checklist?.lines?.findIndex(answer => answer.order === order);
  }

  setAnswer(item: ChecklistLine) {    
    if (item.line > -1) {      
      const lines = this.checklist.lines.map((l) => {
        if (l.line != item.line) {
          return l;
        } else {
          return {
            ...item,
          };
        }
      });
      
      this.checklist = {
        ...this.checklist,
        lines,  
      }
      this.setToolbarMode(toolbarMode.EDITING_WITH_DATA)
      
      this.checklistTotalization();
      this.updateSelectedViewArray();
    }
  }

  reviewForAlarms() {
    // Review all the questions looking for any alarm
  }

  checklistAnimation() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    this.animatingQuestion = true;
    this.animationTimeout = setTimeout(() => {
      this.animatingQuestion = false;    
    }, 1000);

  }

  checklistTotalization() {
    this.checklist.questions = this.checklist.lines.length;
    // const completed = this.checklist.lines?.reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.COMPLETED ? 1 : 0), 0);    
    // const alarmedItems = this.checklist.lines?.reduce((acc, item) => acc + (item.alarmed ? 1 : 0), 0);
    this.checklist = {
      ...this.checklist,
      questionsCompleted: this.completedQuestions,
      alarmedItems: this.alarmedQuestions,
      alarmed: this.checklist.alarmedItems > 0,
    }
    if (this.validQuestions === 0) {
      this.checklistProgress = 0;
    } else {
      this.checklistProgress = Math.round((this.checklist.questionsCompleted ? this.checklist.questionsCompleted : 0) / this.validQuestions * 100);
    }
    
    
    if (this.validQuestions === 0) {
      this.checklistProgress = 0;
    } else {
      this.checklistProgress = Math.round((this.checklist.questionsCompleted ? this.checklist.questionsCompleted : 0) / this.validQuestions * 100);
    }
    const alarmedItemsText = !this.checklist.alarmed ? '' : this.checklist.alarmedItems === 1 ? $localize`una alarmada` : ' ' + this.checklist.alarmedItems + $localize` alarmadas`;
    this.classLegacy = !!alarmedItemsText ? 'spinner-warn' : 'spinner-card-font';
    
    this.progressText = $localize`Avance` + ': ' + (this.checklist.questionsCompleted ? this.checklist.questionsCompleted : 0) + $localize` de ` + (this.validQuestions ? this.validQuestions : 0) + (!!alarmedItemsText ? `\n<strong>${alarmedItemsText}</strong>`: '');
    this.alarmedToolTip = $localize`Avance` + ': ' + (this.checklist.questionsCompleted ? this.checklist.questionsCompleted : 0) + $localize` de ` + (this.validQuestions ? this.validQuestions : 0) + (!!alarmedItemsText ? ' ' + alarmedItemsText : '');
    this.setChecklistColors(!!alarmedItemsText);    
  }

  setChecklistColors(isAlarmed: boolean) {
    // Change the tab bar color based on checklist status
    // let colorToUse = isAlarmed ? document.documentElement.style.getPropertyValue('--theme-warn-500') : document.documentElement.style.getPropertyValue('--theme-primary-500');
    // document.documentElement.style.setProperty('--z-checklist-status', colorToUse);
    // document.documentElement.style.setProperty('--z-checklist-tabs-border', colorToUse);

    let colorToUse = isAlarmed ? document.documentElement.style.getPropertyValue('--theme-warn-200') : document.documentElement.style.getPropertyValue('--z-colors-page-tab-background-color');
    document.documentElement.style.setProperty('--z-checklist-status-300', colorToUse);        

    // colorToUse = isAlarmed ? document.documentElement.style.getPropertyValue('--theme-warn-200') : document.documentElement.style.getPropertyValue('--theme-primary-100');
    // document.documentElement.style.setProperty('--z-checklist-tabs-background-color', colorToUse);
    // colorToUse = isAlarmed ? document.documentElement.style.getPropertyValue('--theme-warn-contrast-200') : document.documentElement.style.getPropertyValue('--theme-primary-contrast-100');
    // document.documentElement.style.setProperty('--z-checklist-tabs-fore', colorToUse);
  }

  loadChecklist(checklistFillingData: ChecklistFillingData, firstTime: boolean) {
    this.checklist = checklistFillingData;    
    if (firstTime && this.checklist.status !== RecordStatus.ACTIVE) {
      this._sharedService.setButtonState(ButtonActions.START, false);      
      this._sharedService.setButtonState(ButtonActions.UPLOAD_FILE, false);
      this.showInactiveMessage();
    } else {
      if (firstTime) {
        this.autoCompletion();
        setTimeout(() => {
          this.showElapsedTime = 'showNormal';
        }, 1000);
      } else {      
        this.unsavedChanges = true;
      }
      if (this.checklist.status === RecordStatus.ACTIVE) {
        this.evaluateButtons();
      }      
      
    }    
  }

  autoCompletion() {
    // This function runs every time the checklist is initiated to set the answers by default
    if (this.checklist.state !== ChecklistState.CREATED || !this.firstTime) {
      return;
    }    
    let responsesByDefault = 0;    
    this.checklist.lines.forEach((item) => {
      if (item.byDefault) {
        responsesByDefault++;        
      }
    });
    if (responsesByDefault > 0) {
      this.unsavedChanges = true;
      this.showCompletionMessage(responsesByDefault);
    }
  }

  evaluateButtons() {
    this._sharedService.setButtonState(ButtonActions.SAVE, this.unsavedChanges && this.validateChecklistAction('save'));
    this._sharedService.setButtonState(ButtonActions.CANCEL, this.unsavedChanges && this.validateChecklistAction('cancel'));    
    this._sharedService.setButtonState(ButtonActions.RESET, this.validateChecklistAction('reset'));
    this._sharedService.setButtonState(ButtonActions.REASSIGN, this.validateChecklistAction('reassign'));
    // this._sharedService.setButtonState(ButtonActions.UNLOCK, this.validateChecklistAction('unlock'));
    // this.elements.find(e => e.action === ButtonActions.START).disabled = false; //!this.validateChecklistAction('init');
    this._sharedService.setButtonState(ButtonActions.START, this.validateChecklistAction('init'));
    this._sharedService.setButtonState(ButtonActions.DISCARD, this.validateChecklistAction('discard'));
    this._sharedService.setButtonState(ButtonActions.APPROVE, this.validateChecklistAction('approve'));
    this._sharedService.setButtonState(ButtonActions.DISAPPROVE, this.validateChecklistAction('disapprove'));
    this.setViewLoading(false); 

  }

  validateChecklistAction(action: string): boolean {
    if (action === 'reset') {
      return this.checklist.allowRestarting &&
        !!this.statusTo.find((s) => s.status === this.checklist.status && s.action === action) &&
        !!this.stateTo.find((s) => s.state === this.checklist.state && s.action === action) 
    } else if (action === 'init') {
      return (this.checklist.requiresActivation || this.checklist.state === 'created') &&
        !!this.statusTo.find((s) => s.status === this.checklist.status && s.action === action) &&
        !!this.stateTo.find((s) => s.state === this.checklist.state && s.action === action)
    } else if (action === 'discard') {
        const discard = this.checklist.allowDiscard &&
          !!this.statusTo.find((s) => s.status === this.checklist.status && s.action === action) &&
          !!this.stateTo.find((s) => s.state === this.checklist.state && s.action === action)        
        const buttonTo = this.elements.find(e => e.action === action)
        if (buttonTo) {
          buttonTo.visible = discard;
        }        
        this._sharedService.setUpdateButtons(true);
        return discard;
    } else if (action === 'approve' || action === 'disapprove') {
      const approveDisapprove = this.checklist.requiresApproval &&
        !!this.statusTo.find((s) => s.status === this.checklist.status && s.action === action) &&
        !!this.stateTo.find((s) => s.state === this.checklist.state && s.action === action) &&
        (this.checklist.state === ChecklistState.IN_PROGRESS && this.checklist.completed === GeneralValues.YES);
        const buttonTo = this.elements.find(e => e.action === action)
        if (buttonTo) {
          buttonTo.visible = approveDisapprove;
        }        
        this._sharedService.setUpdateButtons(true);
        return approveDisapprove;
    } else if (action === 'reassign') {
        const reassignement = this.checklist.allowReassignment &&
          !!this.statusTo.find((s) => s.status === this.checklist.status && s.action === action) &&
          !!this.stateTo.find((s) => s.state === this.checklist.state && s.action === action) &&
          (this.checklist.state === ChecklistState.CREATED || (this.checklist.state === ChecklistState.IN_PROGRESS && this.checklist.completed !== GeneralValues.YES));
          const buttonTo = this.elements.find(e => e.action === action)
          if (buttonTo) {
            buttonTo.visible = reassignement;
          }          
          this._sharedService.setUpdateButtons(true);
          return reassignement;
    } else if (action === 'save' || action === 'cancel') {
      this.attachmentsEnabled = this.statusTo.find((s) => s.status === this.checklist.status && s.action === action) &&      
      !!this.stateTo.find((s) => s.state === this.checklist.state && s.action === action) &&
          (this.checklist.state === ChecklistState.CREATED || (this.checklist.state === ChecklistState.IN_PROGRESS && this.checklist.completed !== GeneralValues.YES));
      return this.attachmentsEnabled;
        
    }
    
    return false;
  }



onAttachmentFileSelected(event: any) {
  const fd = new FormData();
  fd.append('image', event.target.files[0], event.target.files[0].name);

  const uploadUrl = `${environment.apiUploadUrl}`;
  const params = new HttpParams()
  .set('destFolder', `${environment.uploadFolders.catalogs}/checklist`)
  .set('processId', this.checklist.id)
  .set('process', originProcess.CHECKLIST_ATTACHMENTS);
  this.uploadFiles = this._http.post(uploadUrl, fd, { params }).subscribe((res: any) => {
    if (res) {
      const message = $localize`El adjunto ha sido subido satisfactoriamente<br>`;
      this._sharedService.showSnackMessage({
        message,
        duration: 3000,
        snackClass: 'snack-primary',
        icon: 'check',
      });
      this.checklist.attachments.push({
        index: this.checklistTemplate.attachments.length,
        name: res.fileName, 
        id: res.fileGuid, 
        image: `${environment.serverUrl}/files/${res.filePath}`, 
        icon: this._sharedService.setIconName(res.fileType), 
        containerType: this._sharedService.setContainerType(res.fileType), 
      });      
      this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklist.attachments);    
      this.setAttachmentLabel();
    }      
  });    
}


  handleChecklistReset() {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`REINICIAR CHECKLIST`,  
        topIcon: 'time_cycles',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción reiniciará las respuestas del checklist a su valor por defecto.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.resetChecklist();
      }
    });       
  }


  handleChecklistSave() {
    if (this.checklist.questionsCompleted !== this.checklist.questions && this.notAnsweredAndRequiredQuestions === 0) {
      const missingQuestions = this.checklist.questions - this.checklist.questionsCompleted;
      const missingQuestionsMessage = missingQuestions === 1 ? $localize` una pregunta sin responder` : (missingQuestions + $localize` preguntas sin responder`); 
      const missingQuestionsNotrequiredMessage = this.notAnsweredAndNotRequiredQuestions === 0 ? '' : (this.notAnsweredAndNotRequiredQuestions === 1 ? $localize`Se quedará una pregunta sin respuesta que no es requerida.` : $localize`Se quedarán ${this.notAnsweredAndNotRequiredQuestions} preguntas sin respuesta que no son requeridas.`); 

      const dialogResponse = this._dialog.open(GenericDialogComponent, {
        width: '550px',
        disableClose: true,
        panelClass: 'warn-dialog',
        autoFocus : true,
        data: {
          title: $localize`Completar Checklist`,  
          topIcon: 'problems',
          buttons: [{
            action: 'complete',
            showIcon: true,
            icon: 'check',
            showCaption: true,
            caption: $localize`Completar ahora!`,
            showTooltip: true,
            class: 'warn',
            tooltip: $localize`Completa el checklist`,
            default: true,
          }, {
            action: 'save',
            showIcon: true,
            icon: 'save',
            showCaption: true,
            caption: $localize`Guardar para más tarde...`,
            showTooltip: true,            
            tooltip: $localize`Guarda el checklist para ser llenado posteriormente`,
            default: true,
          }, {
            action: 'cancel',
            showIcon: true,
            icon: 'cancel',
            showCaption: true,
            caption: $localize`Cancelar`,
            showTooltip: true,            
            tooltip: $localize`Cancela la acción`,
            default: false,
          }],
          body: {
            message: $localize`El Checklist tiene ${missingQuestionsMessage} pero que NO son requeridas.<br>Puede completar el checklist de una vez o guardarlo para completarlo más tarde.<br><br><strong>¿Qué desea hacer?</strong>`,
            bottomMessage: missingQuestionsNotrequiredMessage,
          },
          showCloseButton: true,
        },
      }); 
      dialogResponse.afterClosed().subscribe((response) => {      
        if (response.action === ButtonActions.SAVE) {
          this.saveChecklist(false);
        } else if (response.action === ButtonActions.COMPLETE ) {
          this.saveChecklist();
        }
      });       
      return;
    } else if (this.checklist.questionsCompleted !== this.checklist.questions) {
      const missingQuestions = this.checklist.questions - this.checklist.questionsCompleted;
      const missingQuestionsMessage = missingQuestions === 1 ? $localize` una pregunta sin responder` : (missingQuestions + $localize` preguntas sin responder`); 
      
      const dialogResponse = this._dialog.open(GenericDialogComponent, {
        width: '450px',
        disableClose: true,
        panelClass: 'warn-dialog',
        autoFocus : true,
        data: {
          title: $localize`Guardar Checklist Parcial`,  
          topIcon: 'problems',
          buttons: [{
            action: 'complete',
            showIcon: true,
            icon: 'check',
            showCaption: true,
            caption: $localize`Guardar`,
            showTooltip: true,
            class: 'warn',
            tooltip: $localize`Guarda el checklist parcialmente`,
            default: true,
          }, {
            action: 'cancel',
            showIcon: true,
            icon: 'cancel',
            showCaption: true,
            caption: $localize`Cancelar`,
            showTooltip: true,            
            tooltip: $localize`Cancela la acción`,
            default: false,
          }],
          body: {
            message: $localize`Esta acción guardará parcialmente el checklist con ${missingQuestionsMessage}.<br><br><strong>¿Desea continuar?</strong>`,
            bottomMessage: $localize`<strong>Nota: </strong>El checklist podrá ser completado posteriormente.`,
          },
          showCloseButton: true,
        },
      }); 
      dialogResponse.afterClosed().subscribe((response) => {      
        if (response.action === ButtonActions.OK) {
          this.saveChecklist(true);
        }
      });       
      return;
    }
    this.saveChecklist();    
  }

  saveChecklist(complete: boolean = true) {

    this.setViewLoading(true);
    const dateAndTime = this._sharedService.formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss');
    const dateAndTimeGql = this._sharedService.formatDate(new Date(dateAndTime), 'yyyy-MM-dd HH:mm:ss');

    const dataToSave = {
      ...(complete) && { completed: GeneralValues.YES },
      ...(complete && this.alarmedQuestions > 0) && { alarmed: GeneralValues.YES },
      ...(complete && this.alarmedQuestions > 0) && { alarmNotifiedDate: dateAndTime },                  
      ...(complete && !this.checklist.requiresApproval) && { state: ChecklistState.CLOSED },
      ...(complete) && { completedBy: 1 }, // TODO: add user id
      ...(complete) && { completedDate: dateAndTimeGql },
      ...(!complete) && { partial: GeneralValues.YES },
      id: this.checklist.id,
      customerId: 1,
    }
    try {
      this.updateChecklistState$ = this._checklistService.updateChecklistState$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklist.length > 0) {
            const checklistId = data?.data?.createOrUpdateChecklist[0].id;
            this.processChecklistLines$(checklistId, dateAndTimeGql, complete).subscribe(() => {
              this.showChecklistCompleted();
              this.checklist.friendlyState = complete && !this.checklist.requiresApproval ? 'Cerrado' : 'En progreso';
              this.checklist.state = complete && !this.checklist.requiresApproval ? ChecklistState.CLOSED : ChecklistState.IN_PROGRESS;
              this.checklist.completed = complete ? GeneralValues.YES : GeneralValues.NO;
              
              
              this.setViewLoading(false);
              this.evaluateButtons();
              const files = this.checklistTemplate.attachments.map((a) => a.id);
              this._catalogsService.saveAttachments$(originProcess.CHECKLIST_ATTACHMENTS, checklistId, files).subscribe(() => {
              });
              
              // TODO: llevar a la ventana de checklists
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
          this.setViewLoading(false);
          this.elements.find(e => e.action === ButtonActions.START).loading = false;    
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
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.SAVE).loading = false;    
    }    
    this.evaluateButtons();
  }

  processChecklistLines$(checklistId: number, date: string, completed: boolean = true): Observable<any> { 

    const linesToSave = this.checklist.lines
    .map((line: any) => {
      if (!this.firstTime) {
        const alarmsCount = !line.alarmsCount ? 1 : Number(line.alarmsCount) + 1;
        const answersCount = !line.answersCount ? 1 : Number(line.answersCount) + 1;
        return {          
          checklistId,         
          customerId: 1, // TODO 
          id: (!!line.value || (completed && !line.required)) ? line.id : 0,
          ...(!!line.value || (completed && !line.required)) && { state: ChecklistState.COMPLETED }, 
          value: line.value,
          ...(line.alarmed) && { alarmed: GeneralValues.YES },
          ...(line.alarmed) && { alarmsCount },
          ...(line.alarmed) && { alarmedDate: date },        
          ...(!!line.value || (completed && !line.required)) && { answeredDate: date },          
          ...(!!line.value || (completed && !line.required)) && { lastAnswer: date },          
          ...(!!line.value || (completed && !line.required)) && { answersCount },  
        }
      } else  {
        const possibleValues = line.possibleValues ? JSON.parse(line.possibleValues) : [];
        let value = '';
        if (possibleValues?.length > 0) {
          const byDefaulObject = possibleValues.filter((v) => v.byDefault)
          if (byDefaulObject.length > 0) {
            value = byDefaulObject[0].value;
          }
        }
        if (!value && line.byDefault) {
          value = line.byDefault;
        }

        let alarmed = false;
        if (value) {
          if (line.valueType === HarcodedVariableValueType.NUMERIC_RANGE) {
            alarmed = ((Number(value) < Number(line.minimum)) ||
                                        (Number(value) > Number(line.maximum)));          
          } else if (line.valueType === HarcodedVariableValueType.YES_NO || line.valueType === HarcodedVariableValueType.YES_NO_NA) {
            alarmed = value === GeneralValues.YES && (line.valueToAlarm === GeneralValues.YES || line.valueToAlarm === GeneralValues.YESNO) ||
              value === GeneralValues.NO && (line.valueToAlarm === GeneralValues.NO || line.valueToAlarm === GeneralValues.YESNO);
          } else if (line.possibleValues) {
            const possibleValues = line.possibleValues ? JSON.parse(line.possibleValues) : [];
            if (possibleValues?.length > 0) {
              alarmed = possibleValues.filter((v) => v.value === value && v.alarmedValue).length > 0;
            }        
          }
        }

        const alarmsCount = !line.alarmsCount ? 1 : Number(line.alarmsCount) + 1;
        const answersCount = !line.answersCount ? 1 : Number(line.answersCount) + 1;
        
        return {
          checklistId,
          customerId: 1, // TODO 
          id: (!!value || (completed && !line.required)) ? line.id : 0,
          ...(value || (completed && !line.required)) && { state: ChecklistState.COMPLETED }, 
          value,
          ...(alarmed) && { alarmed: GeneralValues.YES },
          ...(alarmed) && { alarmsCount },
          ...(alarmed) && { alarmedDate: date },        
          ...(!!value || (completed && !line.required)) && { answeredDate: date },          
          ...(!!value || (completed && !line.required)) && { lastAnswer: date },          
          ...(!!value || (completed && !line.required)) && { answersCount },
        }
      }
    })
    .filter((l) => l.id !== 0);

    const variables = {      
      checklistLines: linesToSave,
    }
    
    return linesToSave.length > 0 ? this._checklistService.updateChecklistLines$(variables) : of(null);               
  }  

  discardChecklistLines$(checklistId: number): Observable<any> { 

    const linesToSave = this.checklist.lines
    .map((line: any) => {
      return {          
        checklistId,         
        customerId: 1, // TODO 
        state: ChecklistState.CREATED,
        id: line.id,
        value: '',
        alarmed: '',
        alarmsCount: 0,
        alarmedDate: null,
        answeredDate: null,
        lastAnswer: null,
        answersCount: 0,
      }
    })

    const variables = {      
      checklistLines: linesToSave,
    }
    
    return linesToSave.length > 0 ? this._checklistService.updateChecklistLines$(variables) : of(null);               
  }  

  handleChecklistApproval() {
    const additionalText = this.checklist.alarmedItems > 0 ? $localize` y generará las alarmas asociadas` : '';
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`APROBAR CHECKLIST`,  
        topIcon: 'check',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción aprobará éste checklist${additionalText}.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.approveChecklist();
      }
    });       
  }

  handleChecklistDisapproval() {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`RECHAZAR CHECKLIST`,  
        topIcon: 'cross',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción rechazará éste checklist y su captura NO afectará el histórico de las variables.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.disapproveChecklist();
      }
    });       
  }

  handleChecklistInit() {    
    this.checklistInUsegData$ = this._checklistService.getChecklistInUseDataGql$({ 
      checklistId: this.checklist.id, 
      customerId: 1, // TODO    
    }).pipe(
      tap((checklistInUseGqlData) => {
        if (checklistInUseGqlData?.data?.oneChecklist?.data?.inUse === GeneralValues.YES) {
          this.showMessageChecklistInUse(checklistInUseGqlData?.data?.oneChecklist?.data);
        } else if (this.checklist.assignedTo.id !== this._sharedService.getUserProfile()?.id && this.checklist.reassignedTo?.id !== this._sharedService.getUserProfile()?.id) {
          this.showMessageChecklistInaccessible();
        } else {
          this.confirmChecklistInitiation();
        }
      }),
      catchError(err => {
        console.log(err);
        alert(err.message);        
        return EMPTY;
      })      
    );     
  }

  handleChecklistUnlock() {    
    this.checklistInUsegData$ = this._checklistService.getChecklistInUseDataGql$({ 
      checklistId: this.checklist.id, 
      customerId: 1, // TODO    
    }).pipe(
      tap((checklistInUseGqlData) => {
        if (checklistInUseGqlData?.data?.oneChecklist?.data?.inUse !== GeneralValues.YES) {
          this.showMessageChecklistInUse(checklistInUseGqlData?.data?.oneChecklist?.data, false);
        } else {
          this.confirmUnlockChecklist(checklistInUseGqlData?.data?.oneChecklist?.data);
        }
      }),
      catchError(err => {
        console.log(err);
        alert(err.message);        
        return EMPTY;
      })      
    );     
  }

  handleChecklistReassign() {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      autoFocus : true,
      data: {
        title: $localize`REASIGNAR USUARIO DEL CHECKLIST`,  
        topIcon: 'admin',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        application: 'checklistReassigningUser',
        body: {
          message: '',
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        if (response.reassigningUser === this.checklist?.assignedTo?.id || response.reassigningUser === this.checklist?.reassignedTo?.id) {
          this.showMessageSameUser()
        } else {
          this.reassignChecklist(response.reassigningUser);
        }
      }
    });       
  }

  showMessageSameUser() {
    let title = $localize`Checklist ya asignado a este usuario`;
    let message = $localize`El checklist ya está asignado o reasignado a éste mismo usuario.`;
    this._sharedService.showDialogWithNoAnswer(title, message, '', 'admin');            
    this.elements.find(e => e.action === ButtonActions.REASSIGN).loading = false;    
  }

  showMessageChecklistInUse(checklistInUseData: any, inUse: boolean = true) {
    let title = $localize`Checklist en uso`;
    let message = $localize`El checklist está siendo utilizado por <strong>${checklistInUseData?.inUseBy?.name}</strong> desde ${this._sharedService.formatDate(new Date(this._sharedService.convertUtcTolocal(checklistInUseData?.inUseSince)), 'EEEE d MMM yyyy hh:mm:ss a')}.`;
    let bottomMessage = `<strong>Nota: </strong>Si el problema persiste solicite desbloquear el checklist a su administrador.`;
    
    if (!inUse) {
      title = $localize`Checklist listo para usarse`;
      message = $localize`El checklist no está en uso en este momento.`;
      bottomMessage = '';
    }      
    this._sharedService.showDialogWithNoAnswer(title, message, bottomMessage);            
    this.elements.find(e => e.action === ButtonActions.START).loading = false;    
  }

  showMessageChecklistInaccessible() {
    let title = $localize`Checklist Inaccesible`;
    let message = $localize`Este Checklist esta asignado al usuario <strong>${this.checklist?.assignedTo?.name}</strong>`;
    let bottomMessage = (this.checklist?.reassignedTo?.name ? `El checklist está reasignado a <strong>${this.checklist?.reassignedTo?.name}</strong>.<br>` : '') + 'En caso de ser usted quien debe llenarlo, ubique a un administrador para que reasigne este checklist a usted.';    
    this._sharedService.showDialogWithNoAnswer(title, message, bottomMessage);            
    this.elements.find(e => e.action === ButtonActions.START).loading = false;    
  }

  confirmChecklistInitiation() {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`INICIAR CHECKLIST`,  
        topIcon: 'garbage_can',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción ES IRREVERSIBLE, permitirá responder el checklist e iniciará el cronómetro del llenado<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.initChecklist();
      }
    });
  }

  confirmUnlockChecklist(checklistInUseData: any) {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`DESBLOQUEAR CHECKLIST`,  
        topIcon: 'garbage_can',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción desbloqueará el checklist para que pueda ser de nuevo editado.<br><br><strong>¿Desea continuar?</strong>`,
          bottomMessage: $localize`El checklist está siendo utilizado por <strong>${checklistInUseData?.inUseBy?.name}</strong> desde ${this._sharedService.formatDate(new Date(this._sharedService.convertUtcTolocal(checklistInUseData?.inUseSince)), 'EEEE d MMM yyyy hh:mm:ss a')}.`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.unlockChecklist();
      }
    });
  }
  

  handleChecklistDiscard() {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`DESCARTAR CHECKLIST`,  
        topIcon: 'problems',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción ES IRREVERSIBLE, reiniciará totalmente el checklist incluyendo su cronómetro<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.discardChecklist();
      }
    });       
  }

  saveDataToLocal() {

  }

  retrieveDataFromLocal() {
    
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.from === ApplicationModules.CHECKLIST_FILLING  && this.elements.length > 0) {
      if (action.action === ButtonActions.CANCEL) {
        this.elements[action.buttonIndex].loading = true;
        this.pendingToolbarButtonIndex = action.buttonIndex;
        this.loadFromButton = action.buttonIndex;
        this.setTabIndex(0);
        this.loaded = false;
        this.unsavedChanges = false;
        this.evaluateButtons();
        // this._store.dispatch(loadChecklistFillingData());   
        this.requestChecklistData(Number(this.checklist.id))        
      } else if (action.action === ButtonActions.SAVE) {
        console.log(this.checklist.lines);
        if (this.checklist.questionsCompleted !== this.checklist.questions && !this.checklist.allowPartialSaving) {
          this.showIncompleteChecklistMessage();
          return;
        }
        this.elements[action.buttonIndex].loading = true;
        this.pendingToolbarButtonIndex = action.buttonIndex;
        this.loadFromButton = action.buttonIndex;
        this.handleChecklistSave();        
        this.elements[action.buttonIndex].loading = false;
      } else if (action.action === ButtonActions.RESET) {
        this.elements[action.buttonIndex].loading = true;
        this.handleChecklistReset();
        this.elements[action.buttonIndex].loading = false;
      } else if (action.action === ButtonActions.START) {
        this.elements[action.buttonIndex].loading = true;
        this.handleChecklistInit();
        this.elements[action.buttonIndex].loading = false;


      } else if (action.action === ButtonActions.BACK) {               
        this.elements.find(e => e.action === action.action).loading = true;
        setTimeout(() => {
          this.elements.find(e => e.action === action.action).loading = false;
          this._router.navigateByUrl('/checklists/list'); 
        }, 750);



      } else if (action.action === ButtonActions.DISCARD) {
        this.elements[action.buttonIndex].loading = true;
        this.handleChecklistDiscard();
        this.elements[action.buttonIndex].loading = false;
      } else if (action.action === ButtonActions.UNLOCK) {
        this.elements[action.buttonIndex].loading = true;
        this.handleChecklistUnlock();
        this.elements[action.buttonIndex].loading = false;
      } else if (action.action === ButtonActions.REASSIGN) {
        this.elements[action.buttonIndex].loading = true;
        this.handleChecklistReassign();
        this.elements[action.buttonIndex].loading = false;
      } else if (action.action === ButtonActions.APPROVE) {
        this.elements[action.buttonIndex].loading = true;
        this.handleChecklistApproval();
        this.elements[action.buttonIndex].loading = false;
      } else if (action.action === ButtonActions.DISAPPROVE) {
        this.elements[action.buttonIndex].loading = true;
        this.handleChecklistDisapproval();
        this.elements[action.buttonIndex].loading = false;
      } else {
        
      }    
    }
  }

  approveChecklist() {
    this.setViewLoading(true);
    const dateAndTime = this._sharedService.formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss');

    const dataToSave = {
      approved: GeneralValues.YES,
      approvedById: 1, // TODO: Colocar el id  del usuario
      approvalDate: dateAndTime,
      state: ChecklistState.CLOSED,
      ...(this.alarmedQuestions > 0) && { alarmed: GeneralValues.YES },      
      ...(this.alarmedQuestions > 0) && { alarmNotifiedDate: dateAndTime },            
      id: this.checklist.id,
      customerId: 1,
    }
    try {
      this.updateChecklistState$ = this._checklistService.updateChecklistState$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklist.length > 0) {
            this.showChecklistApproval();
            this.checklist.friendlyState = 'Cerrado'
            this.checklist.state = ChecklistState.CLOSED;
            this.setViewLoading(false);
            this.evaluateButtons();
            // TODO: llevar a la ventana de checklists
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
          this.setViewLoading(false);
          this.elements.find(e => e.action === ButtonActions.START).loading = false;    
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
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.START).loading = false;    
    } 
  }

  reassignChecklist(user: number) {
    this.setViewLoading(true);
    const dateAndTime = this._sharedService.formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss');

    const dataToSave = {
      reassignedToId: user,
      reassignedBy: this._sharedService.getUserProfile()?.id ?? 1, // Todo 
      reassignedDate: dateAndTime, 
      id: this.checklist.id,
      multiUser: GeneralValues.YES,
      customerId: 1,
    }
    try {
      this.updateChecklistState$ = this._checklistService.updateChecklistState$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklist.length > 0) {
            this.showChecklistReassigning(data?.data?.createOrUpdateChecklist[0]);            
            this.setViewLoading(false);
            this.elements.find(e => e.action === ButtonActions.START).loading = false;      
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
          this.setViewLoading(false);
          this.elements.find(e => e.action === ButtonActions.START).loading = false;    
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
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.START).loading = false;    
    } 
  }

  disapproveChecklist() {
    this.setViewLoading(true);
    const dateAndTime = this._sharedService.formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss');

    const dataToSave = {
      rejected: GeneralValues.YES,
      rejectedById: 1, // TODO: Colocar el id  del usuario
      rejectedDate: dateAndTime,
      state: ChecklistState.CLOSED,
      id: this.checklist.id,
      customerId: 1,
    }
    try {
      this.updateChecklistState$ = this._checklistService.updateChecklistState$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklist.length > 0) {
            this.showChecklistApproval();
            this.checklist.friendlyState = 'Cerrado';
            this.checklist.state = ChecklistState.CLOSED;
            this.setViewLoading(false);
            this.evaluateButtons();
            // TODO: llevar a la ventana de checklists
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
          this.setViewLoading(false);
          this.elements.find(e => e.action === ButtonActions.START).loading = false;    
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
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.START).loading = false;    
    } 
  }

  resetChecklist() {
    this.checklist.lines = this.checklist.lines.map((l) => {
      let value = l.byDefault ? l.byDefault : "";
      let alarmed = l.alarmed;
      let state = l.state;
      const possibleValues = l.possibleValues ? JSON.parse(l.possibleValues) : [];
      if (possibleValues?.length > 0) {
        const byDefaultObject = possibleValues.filter((v) => v.byDefault);
        if (byDefaultObject.length > 0) {
          value = byDefaultObject[0].value;              
          alarmed = byDefaultObject[0].alarmedValue;
        }
      }
      if (value) {
        state = ChecklistQuestionStatus.COMPLETED;
      } else {
        state = ChecklistQuestionStatus.ACTIVE;
      }
      return {
        ...l, 
        reset: true,
        value,
        state,
        alarmed,
      }
    });
    this.checklistTotalization();
    this.updateSelectedViewArray();
    this.evaluateButtons();
  }

  initChecklist() {
    this.setViewLoading(true);
    const dateAndTime = this._sharedService.formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss');

    const dataToSave = {
      startDate: dateAndTime,
      state: ChecklistState.IN_PROGRESS,
      id: this.checklist.id,
      inUse: GeneralValues.YES,
      inUseById: this._sharedService.getUserProfile().id,
      inUseSince: dateAndTime,
      customerId: 1,
    }
    try {
      this.updateChecklistState$ = this._checklistService.updateChecklistState$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklist.length > 0) {
            this.showChecklistInitiation();
            this.checklist.friendlyState = "En progreso"
            this.checklist.state = ChecklistState.IN_PROGRESS;
            this.checklist.startDate = data?.data?.createOrUpdateChecklist[0].startDate.replace('Z', '-06:00');
            this.setChecklistDates();
            this.setViewLoading(false);
            this.evaluateButtons();
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
          this.setViewLoading(false);
          this.elements.find(e => e.action === ButtonActions.START).loading = false;    
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
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.START).loading = false;    
    }    
  }

  unlockChecklist() {
    this.setViewLoading(true);
    const dataToSave = {
      inUse: '',
      inUseById: null,
      inUseSince: null,
      id: this.checklist.id,
      customerId: 1,
    }
    try {
      this.updateChecklistState$ = this._checklistService.updateChecklistState$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklist.length > 0) {            
            this.showChecklistUnlocked();
            this.setViewLoading(false);            
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
          this.setViewLoading(false);
          this.elements.find(e => e.action === ButtonActions.START).loading = false;    
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
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.START).loading = false;    
    }    
  }

  discardChecklist() {
    this.setViewLoading(true);
    const dataToSave = {
      startDate: null,
      state: ChecklistState.CREATED,
      completed: GeneralValues.NO,
      completedById: null,
      completedDate: null,
      inUse: '',
      inUseById: null,
      inUseSince: null,
      id: this.checklist.id,
      customerId: 1,
    }
    try {
      this.updateChecklistState$ = this._checklistService.updateChecklistState$(dataToSave)
      .pipe(
        tap((data: any) => {
          if (data?.data?.createOrUpdateChecklist.length > 0) {
            const checklistId = data?.data?.createOrUpdateChecklist[0].id;
            this.discardChecklistLines$(checklistId).subscribe(() => {
              this.showChecklistInitiation();
              this.requestChecklistData(checklistId);
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
          this.setViewLoading(false);
          this.elements.find(e => e.action === ButtonActions.START).loading = false;    
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
      this.setViewLoading(false);
      this.elements.find(e => e.action === ButtonActions.START).loading = false;    
    }   
  }

  cancelled() {
    // TODO: winsock message to cancel the current checklist

  }

  inactivated() {
    // TODO: winsock message to inactivate the current checklist

  }

  getInactivate() {
    // TODO: winsock message to inactivate the current checklist

  }

  showCompletionMessage(responsesByDefault: number): void {
    const answers = responsesByDefault === 1 ? $localize` una respuesta ` : responsesByDefault + $localize` respuestas `
    const title = $localize`Respuestas por defecto`;
    const message = $localize`El checklist fue configurado para aplicar <strong>${answers}</strong> por defecto.`;    

    this._sharedService.showDialogWithNoAnswer(title, message);
  }

  showIncompleteChecklistMessage(): void {
    const missingQuestions = this.checklist.questions - this.checklist.questionsCompleted;
    const missingQuestionsMessage = missingQuestions === 1 ? $localize` una pregunta.` : (missingQuestions + $localize` preguntas.`);
    const title = $localize`Checklist incompleto`;
    const message = $localize`Aún faltan por llenar <strong>${missingQuestionsMessage}</strong><br>Este cheklist no fue configurado para ser guardado parcialmente`;    

    this._sharedService.showDialogWithNoAnswer(title, message);
  }

  showChecklistInitiation(): void {
    const title = $localize`Checklist iniciado`;
    const message = $localize`El checklist fue iniciado satisfactoriamente. El cronómetro regresivo ha sido activado.`;    

    this._sharedService.showDialogWithNoAnswer(title, message);    
  }

  showChecklistUnlocked(): void {
    const title = $localize`Checklist desbloqueado`;
    const message = $localize`El checklist fue desbloqueado satisfactoriamente. Algún usuario podrá editarlo a partir de ahora.`;    

    this._sharedService.showDialogWithNoAnswer(title, message);    
  }

  showChecklistApproval(): void {
    const title = $localize`Checklist Aprobado!`;
    const message = $localize`El checklist fue aprobado satisfactoriamente.`;    

    this._sharedService.showDialogWithNoAnswer(title, message);    
  }
  
  showChecklistReassigning(data: any): void {
    const title = $localize`Checklist Reasignado!`;
    const message = $localize`El checklist fue reasignado satisfactoriamente a ${data.reassignedTo?.name}.`;    
    const bottomMessage = $localize`El checklist seguirá disponible para el usuario asignado originalmente: ${data.assignedTo?.name}.`;    

    this._sharedService.showDialogWithNoAnswer(title, message, bottomMessage, 'admin');    
  }

  showChecklistCompleted(): void {
    const title = $localize`Checklist guardado!`;
    const message = $localize`El checklist fue guardado satisfactoriamente.`;    

    this._sharedService.showDialogWithNoAnswer(title, message);    
  }

  showInactiveMessage() : void {
    const message = $localize`El checklist <strong>está inactivo</strong> debe comunicarse con el administrador del sistema`;
    this._sharedService.showSnackMessage({
      message,            
      snackClass: 'snack-primary',      
    });
  }

  showInactiveMessage2(): void {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '350px',
      disableClose: false,
      panelClass: "warn-dialog",
      data: {
        title: $localize`Checklist inactivo`,
        buttons: [{
          action: 'cancel',
          showIcon: true,
          icon: 'check',
          showCaption: true,
          caption: $localize`Aceptar`,
          showTooltip: true,
          class: 'warn',
          tooltip: $localize`Cierra esta ventana`,
          default: true,
        }],
        body: {
          message: $localize`Éste checklist esta <strong>INACTIVO</strong> y no se puede actualizar.`,
        },
        showCloseButton: true,
      },
    });
    dialogResponse.afterClosed().subscribe((response) => {
    });    
  }

  updateSelectedViewArray() {
    this.view.options[0].caption = this.view.options[0].template + ` (${this.checklist.questionsCompleted})`;
    this.view.options[1].caption = this.view.options[1].template + ` (${this.validQuestions - this.checklist.questionsCompleted})`;    
    this.view.options[2].caption = this.view.options[2].template + ` (${this.checklist.questions})`;        
  }

  handleButtonMenuSelection(event: any, field: string) {
    if (field === 'layout') {
      this.setLayout(event.selection);
    }
  }

  setViewLoading(loading: boolean): void {
    this.loading = loading;
    this._sharedService.setGeneralLoading(
      ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION,
      loading,
    );
    this._sharedService.setGeneralProgressBar(
      ApplicationModules.CHECKLIST_TEMPLATES_CATALOG_EDITION,
      loading,
    ); 
  }

  updateFormFromData(): void {    
    this.checklistForm.patchValue({
      name: this.checklist.name,
      notes: this.checklist.notes,            
    });    
  } 

  setToolbarMode(mode: toolbarMode) {
    if (this.elements.length === 0 || !this.loaded) return;
    if (mode === toolbarMode.EDITING_WITH_DATA) {      
      // if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;
      // this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
    } else if (mode === toolbarMode.EDITING_WITH_NO_DATA) {
      // if (!this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = false;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = false;
      // this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
    } else if (mode === toolbarMode.INITIAL_WITH_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      // this.elements.find(e => e.action === ButtonActions.COPY).disabled = false;
    } else if (mode === toolbarMode.INITIAL_WITH_NO_DATA) {
      // if (this.elements.find(e => e.action === ButtonActions.SAVE).disabled) return
      this.elements.find(e => e.action === ButtonActions.SAVE).disabled = true;
      this.elements.find(e => e.action === ButtonActions.CANCEL).disabled = true;
      // this.elements.find(e => e.action === ButtonActions.COPY).disabled = true;
    }    
  }
  
// Getters ==================

  get validQuestions() : number {
    if (this.checklist?.lines) {
      return this.checklist?.lines.length - this.cancelledQuestions;
    }
    return 0;
  }

  get pendingQuestions(): number {
    return this.checklist?.lines?.reduce((acc, item) => acc + (item.state === ChecklistQuestionStatus.ACTIVE ? 1 : 0), 0);
  }

  get attachmentMissingQuestions(): number {
    return this.checklist?.lines?.reduce((acc, item) => acc + (item.state === ChecklistQuestionStatus.ATTACHMENT_MISSING ? 1 : 0), 0);
  }

  get cancelledQuestions(): number {
    return this.checklist?.lines?.reduce((acc, item) => acc + (item.state === ChecklistQuestionStatus.CANCELLED ? 1 : 0), 0);
  }

  get completedQuestions(): number {
    if (!this.firstTime || this.checklist.partial || this.checklist.state === ChecklistState.CLOSED || this.checklist.completed === GeneralValues.YES) {
      return this.checklist?.lines?.reduce((acc, item) => acc + (item.state === ChecklistQuestionStatus.COMPLETED ? 1 : 0), 0);
    }
    return this.checklist.lines.map((l) => {
      if (l.byDefault) {
        return 1     
      } else if (l.possibleValues) {
        const possibleValues = l.possibleValues ? JSON.parse(l.possibleValues) : [];
        if (possibleValues?.length > 0) {
          return  possibleValues.filter((v) => v.byDefault).length
        } else {
          return 0
        }        
      }
    })
    .filter((l) => l === 1)
    .length;    
  }

  get notAnsweredAndNotRequiredQuestions(): number {
    if (!this.firstTime || this.checklist.partial) {
      return this.checklist?.lines?.reduce((acc, item) => acc + (!item.value && !item.required ? 1 : 0), 0);
    }
    let notAnsweredAndNotRequired = 0;
     this.checklist.lines.forEach((l) => {
      if (l.possibleValues) {
        const possibleValues = l.possibleValues ? JSON.parse(l.possibleValues) : [];
        if (possibleValues?.length > 0) {
          if (possibleValues.filter((v) => v.byDefault).length === 0) {
            if (!l.required) {
              notAnsweredAndNotRequired++;
            }
          }
        } else if (!l.byDefault && !l.required) {
          notAnsweredAndNotRequired++;
        }
      } else if (!l.byDefault && !l.required) {
        notAnsweredAndNotRequired++;
      }
    });

    return notAnsweredAndNotRequired;
  }

  get notAnsweredAndRequiredQuestions(): number {
    if (!this.firstTime || this.checklist.partial) {
      return this.checklist?.lines?.reduce((acc, item) => acc + (!item.value && item.required ? 1 : 0), 0);
    }
    let notAnsweredAndRequired = 0;
     this.checklist.lines.forEach((l) => {
      if (l.possibleValues) {
        const possibleValues = l.possibleValues ? JSON.parse(l.possibleValues) : [];
        if (possibleValues?.length > 0) {
          if (possibleValues.filter((v) => v.byDefault).length === 0) {
            if (l.required) {
              notAnsweredAndRequired++;
            }
          }
        } else if (!l.byDefault && l.required) {
          notAnsweredAndRequired++;
        }
      } else if (!l.byDefault && l.required) {
        notAnsweredAndRequired++;
      }
    });

    return notAnsweredAndRequired;
  }

  get alarmedQuestions(): number {
    if (!this.firstTime || this.checklist.partial || this.checklist.state === ChecklistState.CLOSED || this.checklist.completed === GeneralValues.YES) {
      return this.checklist?.lines?.reduce((acc, item) => acc + (item.alarmed ? 1 : 0), 0);
    }
    return this.checklist.lines.map((l) => {
      let alarmed = 0;
      if (l.byDefault) {
        if (l.valueType === HarcodedVariableValueType.NUMERIC_RANGE) {
          alarmed = ((Number(l.byDefault) < Number(l.minimum)) ||
                                      (Number(l.byDefault) > Number(l.maximum))) ? 1 : 0;          
        } else if (l.valueType === HarcodedVariableValueType.YES_NO || l.valueType === HarcodedVariableValueType.YES_NO_NA) {
          alarmed = l.byDefault === GeneralValues.YES && (l.valueToAlarm === GeneralValues.YES || l.valueToAlarm === GeneralValues.YESNO) ||
            l.byDefault === GeneralValues.NO && (l.valueToAlarm === GeneralValues.NO || l.valueToAlarm === GeneralValues.YESNO) ? 1 : 0;
        } else if (l.possibleValues) {
          const possibleValues = l.possibleValues ? JSON.parse(l.possibleValues) : [];
          if (possibleValues?.length > 0) {
            alarmed = possibleValues.filter((v) => v.alarmedValue).length > 0 ? 1 : 0;
          }        
        }
      }
      return alarmed;
    })
    .filter((l) => l === 1)
    .length;    
  }

  handleAttachmentDownload(id: number) {
    const downloadUrl = `${environment.apiDownloadUrl}`;
    const params = new HttpParams()
    .set('fileName', this.checklist.attachments[id].image.replace(`${environment.serverUrl}/files/`, ''))
    this.downloadFiles = this._http.get(downloadUrl, { params, responseType: 'blob' }).subscribe((res: any) => {
      if (res) {
        let url = window.URL.createObjectURL(res);
        let link = document.createElement("a"); 
        link.download = this.checklist.attachments[id].name;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();    
      }      
    });
  }

  handleAttachmentRemove(id: number) {
    const valueIndex = this.checklist.attachments.findIndex((v: Attachment) => v.index === id);
    this.checklist.attachments.splice(valueIndex, 1);
    let index = 0;
    this.checklist.attachments.forEach((v: Attachment) => {
      v.index = index++;
    });
    this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklist.attachments);
  }

  handleRemoveAllAttachments() {
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`Eliminar todos los adjuntos`,  
        topIcon: 'garbage_can',
        defaultButtons: dialogByDefaultButton.ACCEPT_AND_CANCEL,
        buttons: [],
        body: {
          message: $localize`Esta acción quitará todos los adjuntoas del registro.<br><br><strong>¿Desea continuar?</strong>`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {      
      if (response.action === ButtonActions.OK) {
        this.checklist.attachments = [];
        this.attachmentsTable = new MatTableDataSource<Attachment>(this.checklist.attachments);    
        this.setAttachmentLabel();
      }
    });       
  }

  setAttachmentLabel() {
    if (this.checklist.attachments.length === 0) {
      this.checklistTemplateAttachmentLabel = $localize`Este checklist no tiene adjuntos...`;
    } else {
      this.checklistTemplateAttachmentLabel = $localize`Este checklist tiene ${this.checklist.attachments.length} adjunto(s)...`;
    }    
  }

  messageMaxAttachment() {
    this.addAttachmentButtonClick = true;    
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'warn-dialog',
      autoFocus : true,
      data: {
        title: $localize`Máximo de adjuntos alcanzado`,  
        topIcon: 'warn_fill',
        defaultButtons: dialogByDefaultButton.ACCEPT,
        buttons: [],
        body: {
          message: $localize`Se ha alcanzado el límite de adjuntos para plantilla de checklist ${this.settingsData?.attachments?.variables ?? 10}.`,
        },
        showCloseButton: true,
      },
    }); 
    dialogResponse.afterClosed().subscribe((response) => {
      this.addAttachmentButtonClick = false;
    });    
  }

  get CapitalizationMethod() {
    return CapitalizationMethod;
  }

  get RecordStatus() {
    return RecordStatus;
  }

  get ChecklistQuestionStatus() {
    return ChecklistQuestionStatus;
  }

  get ChecklistState() {
    return ChecklistState;
  }

  get HarcodedVariableValueType() {
    return HarcodedVariableValueType
  }

  get GeneralValues() {
    return GeneralValues
  }
  
// End ======================   
}
