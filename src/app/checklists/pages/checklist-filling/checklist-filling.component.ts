import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";
import { MatDialog } from '@angular/material/dialog';

import { routingAnimation, dissolve, fastDissolve } from '../../../shared/animations/shared.animations';
import { SmallFont, SpinnerFonts, SpinnerLimits } from 'src/app/shared/models/colors.models';
import { ApplicationModules, ButtonActions, ScreenSizes, SimpleMenuOption, ToolbarButtonClicked, ToolbarButtons } from 'src/app/shared/models/screen.models';
import { AppState } from '../../../state/app.state'; 
import { SharedService } from 'src/app/shared/services/shared.service';
import { SettingsData } from 'src/app/shared/models/settings.models';
import { ProfileData } from 'src/app/shared/models/profile.models';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { ChecklistAnswerType, ChecklistQuestionStatus, ChecklistFillingData, ChecklistFillingItem } from 'src/app/checklists/models/checklists.models';
import { Subscription } from 'rxjs';
import { selectChecklistFillingData, selectLoadingChecklistFillingState } from 'src/app/state/selectors/checklists.selectors';
import { loadChecklistFillingData, updateChecklistQuestion } from 'src/app/state/actions/checklists.actions';
import { GenericDialogComponent } from 'src/app/shared/components/generic-dialog/generic-dialog.component';
import { RecordStatus } from 'src/app/shared/models/helpers.models';

@Component({
  selector: 'app-checklist-filling',
  templateUrl: './checklist-filling.component.html',
  animations: [ routingAnimation, dissolve, fastDissolve ],
  styleUrls: ['./checklist-filling.component.scss']
})
export class ChecklistFillingComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
  @ViewChild('checklistFilling') private moldsQueryList: ElementRef;
  @ViewChildren('questions') private questions: QueryList<ElementRef>;
  
// Variables ===============
  panelOpenState: boolean[] = [];
  limits: SpinnerLimits[] = [];
  fonts: SpinnerFonts[] = [{
    start: 0,
    finish: 100,
    size: 1.7,
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
  smallFont: SmallFont = {
    size: 1,
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
  buttons: ToolbarButtons[] = [];
  onTopStatus: string  = 'inactive';
  goTopButtonTimer: any;
  loaded: boolean = false;  
  currentTabIndex: number = 0;
  checklistProgress: number = 0;
  animationTimeout: any;
  scrollSubscriber: Subscription;
  settingDataSubscriber: Subscription;
  profileDataSubscriber: Subscription;
  toolbarClickSubscriber: Subscription;
  showGoTopSubscriber: Subscription;
  checklistFillingLoadingSubscriber: Subscription;
  checklistFillingDataSubscriber: Subscription;
  unsavedChanges: boolean = false;
  noQuestions: boolean = false;
  showSpinner: boolean = false;
  loadFromButton: number = -1;
  checklist: ChecklistFillingData = {};
  progressText: string = '';
  alarmedToolTip: string = '';
  classLegacy: string = 'spinner-card-font';
  layouts: SimpleMenuOption[] = [{
    caption: $localize`Flexbox`,
    icon: 'attachment',
    value: 'flexbox',
  },
  {
    caption: $localize`Checklist`,
    icon: 'checklist',
    value: 'checklist',
  },
  {
    caption: $localize`Pregunta por página`,
    template: $localize`Pregunta por página`,
    icon: 'reload',
    value: 'questionByPage',
  },];

  views: SimpleMenuOption[] = [{
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
  },
  {
    caption: $localize`Ver en dos columnas`,
    icon: 'save',
    value: 'twoColumns',
  },];

  selectedLayout: SimpleMenuOption = this.layouts[0];
  selectedView: SimpleMenuOption = this.views[2];  
  
  form = new FormGroup({
  });

  constructor (
    private store: Store<AppState>,
    public sharedService: SharedService,
    public scrollDispatcher: ScrollDispatcher,
    public dialog: MatDialog,    
  ) { }

// Hooks ====================
  ngOnInit(): void {
    // Dispatches
    this.store.dispatch(loadChecklistFillingData());

    // Subscriptions
    this.checklistFillingLoadingSubscriber = this.store.select(selectLoadingChecklistFillingState).subscribe( loading => {
      this.loading = loading;
      this.sharedService.setGeneralLoading(
        ApplicationModules.CHECKLIST_FILLING,
        loading,
      );
      this.sharedService.setGeneralProgressBar(
        ApplicationModules.CHECKLIST_FILLING,
        loading,
      );      
      this.loading = loading;
    });    
    this.toolbarClickSubscriber = this.sharedService.toolbarAction.subscribe((buttonClicked: ToolbarButtonClicked) => {
      if (buttonClicked.from !== ApplicationModules.CHECKLIST_FILLING) {
          return
      }
      this.toolbarAction(buttonClicked);
    });
    this.settingDataSubscriber = this.store.select(selectSettingsData).subscribe( settingsData => {
      this.settingsData = settingsData;
    });    
    this.profileDataSubscriber = this.store.select(selectProfileData).subscribe( profileData => {
      this.profileData = profileData;
    });
    this.sharedService.search.subscribe((searchBox) => {
      if (searchBox.from === ApplicationModules.CHECKLIST_FILLING) {
        // this.filterMoldsBy = searchBox.textToSearch;  
      }
    });
    this.checklistFillingDataSubscriber = this.store.select(selectChecklistFillingData).subscribe((checklistFillingData: ChecklistFillingData) => {        
      this.loadChecklist(checklistFillingData, !this.loading && !this.loaded);      
      if (!this.loading && !this.loaded) {
        this.loaded = true;
      }
      if (!this.loading) {
        if (this.loadFromButton > -1) {          
          this.buttons[this.loadFromButton].loading = false;
          this.loadFromButton = -1;          
        }
        this.checklistTotalization();
        this.updateSelectedViewArray();
      }
    });
    this.showGoTopSubscriber = this.sharedService.showGoTop.subscribe((goTop) => {
      if (goTop.status === 'temp') {
        this.onTopStatus = 'active';
        this.moldsQueryList.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
        // Ensure
      }      
    });
    this.scrollSubscriber = this.scrollDispatcher
    .scrolled()
    .subscribe((data: any) => {      
      this.getScrolling(data);
    });        

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
    this.questions.changes.subscribe((components: QueryList<ElementRef>) => {
      
    });    
  }

  ngOnDestroy(): void {
    this.sharedService.setToolbar(
      ApplicationModules.CHECKLIST_FILLING,
      false,
      '',
      '',
      this.buttons,
    );
    this.sharedService.setGeneralScrollBar(
      ApplicationModules.CHECKLIST_FILLING,
      false,
    );
    // Turn off the subscriptions
    if (this.scrollSubscriber) this.scrollSubscriber.unsubscribe();
    if (this.settingDataSubscriber) this.settingDataSubscriber.unsubscribe();
    if (this.toolbarClickSubscriber) this.toolbarClickSubscriber.unsubscribe();
    if (this.showGoTopSubscriber) this.showGoTopSubscriber.unsubscribe();
    if (this.checklistFillingLoadingSubscriber) this.checklistFillingLoadingSubscriber.unsubscribe();
  }

// Functions ================

  animationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this.calcButtons();
        this.sharedService.setToolbar(
          ApplicationModules.CHECKLIST_FILLING,
          true,
          'toolbar-grid',
          'divider',
          this.buttons,
        );
        this.sharedService.setGeneralScrollBar(
          ApplicationModules.CHECKLIST_FILLING,
          true,
        );
        this.sharedService.setGeneralLoading(
          ApplicationModules.CHECKLIST_FILLING,
          false,
        ); // TODO: After recovery the data
      }, 500);
    }
  }

  calcButtons() {    
    this.buttons = [{
      type: 'button',
      caption: $localize`Iniciar`,
      tooltip:  $localize`Inicia éste checklist`,
      icon: 'time',
      class: 'accent',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: false,
      loading: false,
      action: ButtonActions.START,
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
          this.sharedService.setGoTopButton(
            ApplicationModules.GENERAL,
            'inactive',
          );
        }
        return;
      }, 2500);
    }    
    if (this.onTopStatus !== status) {
      this.onTopStatus = status;
      this.sharedService.setGoTopButton(
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
      this.selectedView = this.views[0];
    }
    //Init the spinner
    this.showSpinner = true;
    this.selectedView = this.views.find((view) =>
      view.value === value
    );
    let noQuestions = false;    
    if (this.selectedView.value === 'answered') {
      noQuestions = this.checklist.completed === 0;
    } else if (this.selectedView.value === 'unanswered') {
      noQuestions = (this.pendingQuestions + this.attachmentMissingQuestions) === 0;
    } else {
      noQuestions = this.checklist.items.length === 0;
    } 
    setTimeout(() => {
      this.noQuestions = noQuestions;
      this.showSpinner = false;
    }, 300);      
  }

  setLayout(value: string) {
    if (!value) {
      this.selectedLayout = this.layouts[0];
    }
    this.selectedLayout = this.layouts.find((layout) =>
      layout.value === value
    )
  }

  getAnswerByIndex(index: number): any {
    return this.checklist?.items?.findIndex(answer => answer.index === index);
  }

  setAnswer(index: number, e: any) {    
    const answerIndex = this.getAnswerByIndex(index);
    if (answerIndex > -1) {
      const question = this.checklist.items[answerIndex];
      if(question.answerType === ChecklistAnswerType.YES_NO) {
        let answer = undefined;
        let status = ChecklistQuestionStatus.COMPLETED;
        let actionRequired = false;        
        if (e !== undefined) {
          answer = e;
          if (question.attachmentRequired && !question.attachmentCompleted) {
            status = ChecklistQuestionStatus.ATTACHMENT_MISSING;
            actionRequired = true;
          }          
        } else {
          status = ChecklistQuestionStatus.READY;
        }
        if (
          answer !== question.answer ||
          status !== question.status ||
          actionRequired !== question.actionRequired
        ) {
          const item: ChecklistFillingItem = { 
            ...question, 
            answer,
            status,
            actionRequired,
          };          
          this.store.dispatch(updateChecklistQuestion({ item }));
          if (this.selectedView.value !== 'all') {
            this.checklistAnimation();
          }                    
        }        
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
    let colorToUse = isAlarmed ? document.documentElement.style.getPropertyValue('--theme-warn-500') : document.documentElement.style.getPropertyValue('--theme-primary-500');
    document.documentElement.style.setProperty('--z-checklist-status', colorToUse);
    document.documentElement.style.setProperty('--z-checklist-tabs-border', colorToUse);

    colorToUse = isAlarmed ? document.documentElement.style.getPropertyValue('--theme-warn-200') : document.documentElement.style.getPropertyValue('--z-colors-page-tab-background-color');
    document.documentElement.style.setProperty('--z-checklist-status-300', colorToUse);        

    colorToUse = isAlarmed ? document.documentElement.style.getPropertyValue('--theme-warn-200') : document.documentElement.style.getPropertyValue('--theme-primary-100');
    document.documentElement.style.setProperty('--z-checklist-tabs-background-color', colorToUse);
    colorToUse = isAlarmed ? document.documentElement.style.getPropertyValue('--theme-warn-contrast-200') : document.documentElement.style.getPropertyValue('--theme-primary-contrast-100');
    document.documentElement.style.setProperty('--z-checklist-tabs-fore', colorToUse);
  }

  loadChecklist(checklistFillingData: ChecklistFillingData, firstTime: boolean) {
    this.checklist = checklistFillingData;
    if (firstTime && this.checklist.status !== RecordStatus.ACTIVE) {
      this.sharedService.setButtonState(ButtonActions.START, false);      
      this.sharedService.setButtonState(ButtonActions.UPLOAD_FILE, false);
      this.showInactiveMessage();
    } else {
      if (firstTime) {
        this.autoCompletion();
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
    this.checklist.items.forEach((item) => {
      if (item.answerByDefault && !item.answer) {
        this.setAnswer(item.index, item.answerByDefault);
        responsesByDefault++;        
      }
    });
    if (responsesByDefault > 0) {
      this.unsavedChanges = true;
      this.showCompletionMessage(responsesByDefault);
    }
  }

  evaluateButtons() {
    this.sharedService.setButtonState(ButtonActions.SAVE, this.unsavedChanges);
    this.sharedService.setButtonState(ButtonActions.CANCEL, this.unsavedChanges);
  }

  saveDataToLocal() {

  }

  retrieveDataFromLocal() {
    
  }

  toolbarAction(action: ToolbarButtonClicked) {
    if (action.action === ButtonActions.SAVE) {

    } else if (action.action === ButtonActions.CANCEL) {
      this.loadFromButton = action.buttonIndex;
      this.setTabIndex(0);
      this.loaded = false;
      this.unsavedChanges = false;
      this.evaluateButtons();
      this.store.dispatch(loadChecklistFillingData());   
    } else {
      this.buttons[action.buttonIndex].loading = false;
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
    const dialogResponse = this.dialog.open(GenericDialogComponent, {
      width: '350px',
      disableClose: false,
      data: {
        title: $localize`Respuestas por defecto`,
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
    this.sharedService.showSnackMessage(message);
  }

  showInactiveMessage2(): void {
    const dialogResponse = this.dialog.open(GenericDialogComponent, {
      width: '350px',
      disableClose: false,
      panelClass: "warn-dialog",
      data: {
        title: $localize`Checklist inactivo`,
        buttons: [{
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
    this.views[0].caption = this.views[0].template + ` (${this.checklist.completed})`;
    this.views[1].caption = this.views[1].template + ` (${this.validQuestions - this.checklist.completed})`;    
    this.views[2].caption = this.views[2].template + ` (${this.checklist.questions})`;        
  }
  
// Getters ==================

  get validQuestions() : number {
    return this.checklist.items.length - this.cancelledQuestions;
  }

  get pendingQuestions(): number {
    return this.checklist.items.reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.READY ? 1 : 0), 0);
  }

  get attachmentMissingQuestions(): number {
    return this.checklist.items.reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.ATTACHMENT_MISSING ? 1 : 0), 0);
  }

  get cancelledQuestions(): number {
    return this.checklist.items.reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.CANCELLED ? 1 : 0), 0);
  }
  
// End ======================   
}
