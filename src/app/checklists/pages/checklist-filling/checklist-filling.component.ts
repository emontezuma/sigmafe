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
import { ProfileData } from 'src/app/shared/models/profile.models';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { ChecklistAnswerType, ChecklistQuestionStatus, ChecklistFillingData, ChecklistFillingItem, ChecklistState, emptyChecklistFillingData } from 'src/app/checklists/models/checklists.models';
import { catchError, combineLatest, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { selectChecklistFillingData, selectLoadingChecklistFillingState } from 'src/app/state/selectors/checklists.selectors';
import { loadChecklistFillingData, updateChecklistQuestion } from 'src/app/state/actions/checklists.actions';
import { GenericDialogComponent } from 'src/app/shared/components';
import { RecordStatus, CapitalizationMethod, originProcess, GeneralValues } from 'src/app/shared/models/helpers.models';
import { CatalogsService } from 'src/app/catalogs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { ChecklistsService } from '../../services';
import { ChecklistTemplateDetail, ChecklistTemplateLine, emptyChecklistTemplateItem } from '../../models/catalogs-checklist-templates.models';
import { ChecklistLine } from 'src/app/shared/models';


@Component({
  selector: 'app-checklist-filling',
  templateUrl: './checklist-filling.component.html',
  animations: [ routingAnimation, dissolve, fastDissolve, fromTop ],
  styleUrls: ['./checklist-filling.component.scss']
})
export class ChecklistFillingComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
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
  profileData: ProfileData;
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
  currentTabIndex: number = 1;
  checklistProgress: number = 0;
  animationTimeout: any;
  takeRecords: number = 50;
  linesOrder: any = JSON.parse(`{ "line": "${'ASC'}" }`);  

  scroll$: Observable<any>;;
  settingsData$: Observable<SettingsData>;
  toolbarClick$: Observable<ToolbarButtonClicked>;    
  checklistFillingData$: Observable<ChecklistFillingData>;  
  profileData$: Observable<ProfileData>;  
  showGoTop$: Observable<GoTopButtonStatus>;
  checklistFillingLoading$: Observable<boolean>;
  everySecond$: Observable<boolean>;
  parameters$: Observable<string | Params>;
  limitTime: any;
  lapse: any;

  // Checklist template
  checklistTemplate: ChecklistTemplateDetail = emptyChecklistTemplateItem;
  checklistTemplate$: Observable<any>;
  checklistTemplateLines: ChecklistTemplateLine[] = [];
  
  unsavedChanges: boolean = false;
  noQuestions: boolean = false;
  showSpinner: boolean = false;
  loadFromButton: number = -1;
  checklist: ChecklistFillingData = emptyChecklistFillingData;
  progressText: string = '';
  alarmedToolTip: string = '';
  countdownToolTip: string = '';
  classLegacy: string = 'spinner-card-font';
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
      {
        caption: $localize`Ver en dos columnas`,
        icon: 'save',
        value: 'twoColumns',
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
  ) { }

// Hooks ====================
  ngOnInit(): void {
    // Dispatches
    this._store.dispatch(loadChecklistFillingData());

    this.everySecond$ = this._sharedService.pastSecond.pipe(
      tap((pulse) => {
        const elapsedTime = this._sharedService.datesDifferenceInSeconds(this.checklist.dueDateToFinish);
        if (elapsedTime.message.substring(0, 5) !== 'error') {
          if (elapsedTime.totalSeconds < 0) {          
            if (elapsedTime.totalSeconds * -1 < this.checklist.secondsToAlert) {
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
        if (this.pendingToolbarButtonIndex === 2 && !loading) {
          this.pendingToolbarButtonIndex = null;
          setTimeout(() => {
            this.elements[2].loading = loading;  
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
    this.profileData$ = this._store.select(selectProfileData).pipe(
      tap( profileData => {
        this.profileData = profileData;
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
          this.checklistTotalization();
          this.updateSelectedViewArray();
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
      buttonsToLeft: 2,
      toolbarClass: '',
      dividerClass: '',
      elements: [],
      alignment: 'right',
    });
    this._sharedService.setGeneralScrollBar(
      ApplicationModules.CHECKLIST_FILLING,
      false,
    );        
  }

// Functions ================
  animationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this.calcElements();
        this._sharedService.setToolbar({
          from: ApplicationModules.CHECKLIST_FILLING,
          show: true,
          buttonsToLeft: 2,
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
    const process = originProcess.CATALOGS_CHECKLIST_TEMPLATE_HEADER_ATTACHMENTS;
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
      }),
      switchMap((checklistTemplateData: ChecklistTemplateDetail) => {
        const lineAttachmentsObservablesArray: Observable<any>[] = [];
        const variableAttachmentsObservablesArray: Observable<any>[] = [];
        for (const line of checklistTemplateData?.lines) {
          lineAttachmentsObservablesArray.push(this.mapChecklistTemplatesDetailAttachments$(line['id']));
          variableAttachmentsObservablesArray.push(this.mapChecklistTemplatesDetailVariableAttachments$(line['variableId']));
        }
        if (lineAttachmentsObservablesArray.length > 0) {
          return combineLatest([ combineLatest(lineAttachmentsObservablesArray), combineLatest(variableAttachmentsObservablesArray) ]);
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
              }            
            });
          }          
        }
        for (const cld of this.checklistTemplateLines) {
          this.checklist.lines.forEach(cl => {
            if (cl.checklistTemplateId === cld.id) {
              cl = {
                ...cl,
                uomName: cld.uomName,
              }
            }
          }) 
        }
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
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
        if (this.checklist.startDate) {
          const startDate = new Date(this.checklist.startDate);
          startDate.setSeconds(startDate.getSeconds() + +this.checklist.timeToFill);
          this.limitTime = this._sharedService.formatDate(startDate ?? new Date(), 'yyyy/MM/dd HH:mm:ss');;

          const completeTime = new Date(this.checklist.timeToFill * 1000).toISOString().slice(11, 19);
          this.lapse = completeTime;
        }                  
      }),
      tap((attachments: any) => {
        // this.mapLines(attachments);
        this.updateFormFromData();        
        this.loaded = true;
        setTimeout(() => {
          this.setToolbarMode(toolbarMode.INITIAL_WITH_DATA);
        }, 1000);        
        this.setViewLoading(false);        
      }),
      catchError(err => {
        this.setViewLoading(false);
        return EMPTY;
      })      
    ); 
  } 

  calcElements() {    
    this.elements = [{
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
      action: ButtonActions.START,
    },{
      type: 'button',
      caption: $localize`Resetear`,
      tooltip:  $localize`Resetea el checklist`,
      icon: 'time_cycles',
      alignment: 'left',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      showCaption: true,
      loading: false,
      disabled: true,
      action: ButtonActions.RESET,
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
      disabled: true,
      action: ButtonActions.UPLOAD_FILE,
      loading: false,
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
    },{
      type: 'button',
      caption: $localize`Exportar`,
      tooltip: $localize`Exporta la vista`,
      icon: 'download',
      class: '',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: false,
      action: ButtonActions.EXPORT_TO_EXCEL,
      loading: false,
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
    this.currentTabIndex = tab;
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
      noQuestions = this.checklist.completed === 0;
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

  setAnswer(index: number, e: any) {    
    const answerIndex = this.getAnswerByIndex(index);
    if (answerIndex > -1) {
      const question = this.checklist.lines[answerIndex];
      if (question.variable?.valueType === ChecklistAnswerType.YES_NO) {
        let answer = undefined;
        let status = ChecklistQuestionStatus.COMPLETED;
        let actionRequired = false;        
        if (e !== undefined) {
          answer = e;
          // if (question.attachmentRequired && !question.attachmentCompleted) {
          //   status = ChecklistQuestionStatus.ATTACHMENT_MISSING;
          //   actionRequired = true;
          // }          
        } else {
          status = ChecklistQuestionStatus.READY;
        }
        /* if (
          answer !== question.value ||
          status !== question.status // ||
          // actionRequired !== question.actionRequired
        ) {
          const item: ChecklistFillingItem = { 
            ...question, 
            answer,
            status,
            actionRequired,
          };          
          this._store.dispatch(updateChecklistQuestion({ item }));
          if (this.selectedView.value !== 'all') {
            this.checklistAnimation();
          }                    
        }      */   
      }      
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
    if (this.validQuestions === 0) {
      this.checklistProgress = 0;
    } else {
      this.checklistProgress = Math.round(this.checklist.completed / this.validQuestions * 100);
    }
    const alarmedItemsText = !this.checklist.alarmed ? '' : this.checklist.alarmedItems === 1 ? $localize`una alarmada` : ' ' + this.checklist.alarmedItems + $localize`alarmadas`;
    this.classLegacy = !!alarmedItemsText ? 'spinner-warn' : 'spinner-card-font';
    
    this.progressText = $localize`Avance` + ': ' + this.checklist.completed + $localize` de ` + this.validQuestions + (!!alarmedItemsText ? `\n<strong>${alarmedItemsText}</strong>`: '');
    this.alarmedToolTip = $localize`Avance` + ': ' + this.checklist.completed + $localize` de ` + this.validQuestions + (!!alarmedItemsText ? ' ' + alarmedItemsText : '');
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
    let responsesByDefault = 0;    
    this.checklist.lines.forEach((item) => {
      // if (item.answerByDefault && !item.answer) {
      //  this.setAnswer(item.index, item.answerByDefault);
      //  responsesByDefault++;        
      // }
    });
    if (responsesByDefault > 0) {
      this.unsavedChanges = true;
      this.showCompletionMessage(responsesByDefault);
    }
  }

  evaluateButtons() {
    this._sharedService.setButtonState(ButtonActions.SAVE, this.unsavedChanges);
    this._sharedService.setButtonState(ButtonActions.CANCEL, this.unsavedChanges);
  }

  saveDataToLocal() {

  }

  retrieveDataFromLocal() {
    
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.from === ApplicationModules.CHECKLIST_FILLING  && this.elements.length > 0) {
      if (action.action === ButtonActions.SAVE) {

      } else if (action.action === ButtonActions.CANCEL) {
        this.elements[action.buttonIndex].loading = true;
        this.pendingToolbarButtonIndex = 2;
        this.loadFromButton = action.buttonIndex;
        this.setTabIndex(0);
        this.loaded = false;
        this.unsavedChanges = false;
        this.evaluateButtons();
        this._store.dispatch(loadChecklistFillingData());   
      } else {
        
      }    
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
    const answers = responsesByDefault === 1 ? $localize` una respuesta ` : responsesByDefault + $localize` respuesta `
    const dialogResponse = this._dialog.open(GenericDialogComponent, {
      width: '350px',
      disableClose: false,
      data: {
        title: $localize`Respuestas por defecto`,
        defaultButtons: dialogByDefaultButton.ACCEPT,
        buttons: [],
        body: {
          message: $localize`El checklist fue configurado para aplicar <strong>${answers}</strong> por defecto.`,
        },
        showCloseButton: true,
      },
    });
    dialogResponse.afterClosed().subscribe((response) => {
    });    
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
    this.view.options[0].caption = this.view.options[0].template + ` (${this.checklist.completed})`;
    this.view.options[1].caption = this.view.options[1].template + ` (${this.validQuestions - this.checklist.completed})`;    
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
    if (this.checklist?.items) {
      return this.checklist?.items.length - this.cancelledQuestions;
    }
    return 0;
  }

  get pendingQuestions(): number {
    return this.checklist?.items?.reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.READY ? 1 : 0), 0);
  }

  get attachmentMissingQuestions(): number {
    return this.checklist?.items?.reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.ATTACHMENT_MISSING ? 1 : 0), 0);
  }

  get cancelledQuestions(): number {
    return this.checklist?.items?.reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.CANCELLED ? 1 : 0), 0);
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
  
// End ======================   
}
