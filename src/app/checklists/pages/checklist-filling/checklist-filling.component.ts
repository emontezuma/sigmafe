import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";

import { routingAnimation } from '../../../shared/animations/shared.animations';
import { SmallFont, SpinnerFonts, SpinnerLimits } from 'src/app/shared/models/colors.models';
import { ApplicationModules, ScreenSizes, ToolbarButtons } from 'src/app/shared/models/screen.models';
import { AppState } from '../../../state/app.state'; 
import { SharedService } from 'src/app/shared/services/shared.service';
import { SettingsData } from 'src/app/shared/models/settings.models';
import { ProfileData } from 'src/app/shared/models/profile.models';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { ChecklistAnswerType, ChecklistAnswerStatus, ChecklistView } from 'src/app/shared/models/checklists.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checklist-filling',
  templateUrl: './checklist-filling.component.html',
  animations: [ routingAnimation ],
  styleUrls: ['./checklist-filling.component.scss']
})
export class ChecklistFillingComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
  @ViewChild('checklistFilling') private moldsQueryList: ElementRef;  
  
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
  // Variables ===============
  settingsData: SettingsData;
  profileData: ProfileData;
  colsBySize: number = 2;
  currentSize: ScreenSizes = ScreenSizes.NORMAL;
  loading: boolean = true;
  animate: boolean = true;
  buttons: ToolbarButtons[] = [];
  onTopStatus: string  = 'inactive';
  goTopButtonTimer: any;
  loaded: boolean = false;  
  currentTabIndex: number = 0;
  scrollSubscriber: Subscription;
  settingDataSubscriber: Subscription;
  profileDataSubscriber: Subscription;
  searchBoxSubscriber: Subscription;
  showGoTopSubscriber: Subscription;

  checklist = {    
    questions: 32,
    completed: 21,
    valueToChart: 71,
    alarmed: true,
    viewType: ChecklistView.FLEXBOX,
    icon: 'assets/images/icons/faq.svg'
  }
  items = [{
    id: "aaa",
    index: 1,
    order: 1,
    text: '¿La tapa del motor está bien sellada?',
    extendedInfo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga.',
    answerType: ChecklistAnswerType.YES_NO,
    answerByDefault: 'y',
    answerStatus: ChecklistAnswerStatus.NOT_INITIATED,
    showExtendedInfo: true,
    showVisualSupport: true,
    allowNotes: true,
    completionDate: 'Y',
    startedDate: 'Y',
    alarmed: true,
    requiresAttachment: true,
    icon: 'assets/images/icons/faq.svg',
    helpers: [{
      id: 'abcd',
      icon: 'assets/icons/video_file.svg',
    },{
      id: 'xyz',
      icon: 'assets/icons/excel.svg',
    },
  ]
  },{
    id: "bbb",
    index: 2,
    order: 2,
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga.',
    answerType: ChecklistAnswerType.YES_NO,
    answerByDefault: 'y',
    showExtendedInfo: 'N',
    answerStatus: ChecklistAnswerStatus.NOT_INITIATED,
    icon: 'assets/images/icons/problems.svg'
  },{
    id: "bbb",
    index: 3,
    order: 2,
    text: '¿This is a question?',
    answerType: ChecklistAnswerType.YES_NO,
    answerByDefault: 'y',
    showExtendedInfo: 'N',
    answerStatus: ChecklistAnswerStatus.NOT_INITIATED,
    icon: 'assets/images/icons/problems.svg'
  }];
  
  form = new FormGroup({
  });

  constructor(
    private store: Store<AppState>,
    public sharedService: SharedService,
    public scrollDispatcher: ScrollDispatcher,
  ) { }

// Hooks ====================
  ngOnInit(): void {
    // Settings
    setTimeout(() => {
      this.sharedService.setGeneralPreogressBar(
        ApplicationModules.CHECKLIST_FILLING,
        false,
      );
    }, 1000)
    this.sharedService.setGeneralPreogressBar(
      ApplicationModules.CHECKLIST_FILLING,
      true,
    );
    this.sharedService.setSearchBox(
      ApplicationModules.CHECKLIST_FILLING,
      true,
    );
    this.sharedService.setGeneralLoading(
      ApplicationModules.CHECKLIST_FILLING,
      true,
    );
    
    // Subscriptions
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
    this.searchBoxSubscriber = this.sharedService.isAnimationFinished.subscribe((animationStatus) => {      
      if (animationStatus.isFinished && animationStatus.toState === 'ChecklistFillingComponent') {
        // this.animateToolbar(null);
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
    // this.store.dispatch(loadMoldsHitsQueryData());    
  }

  ngAfterViewInit(): void {
    const progressBars = document.getElementsByName("active-progress-bar");
    progressBars.forEach((element) => {
      element?.style.setProperty('--mdc-linear-progress-track-color', 'var(--theme-warn-100)');     
    })
    const chip = document.getElementsByName("chip");
    chip.forEach((element) => {
      console.log('si');
      element?.style.setProperty('--mdc-chip-label-text-color', 'var(--theme-warn-contrast-500)');     
    })
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
    if (this.profileDataSubscriber) this.profileDataSubscriber.unsubscribe();
    if (this.searchBoxSubscriber) this.searchBoxSubscriber.unsubscribe();
    if (this.showGoTopSubscriber) this.showGoTopSubscriber.unsubscribe();
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
    },{
      type: 'button',
      caption: $localize`Cancelar`,
      tooltip:  $localize`Cancela la edición éste checklist`,
      icon: 'cancel',
      class: 'accent',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: true,
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: "",
      class: '',
      iconSize: "",
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: true,
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
    },{
      type: 'divider',
      caption: '',
      tooltip: '',
      icon: "",
      class: '',
      iconSize: "",
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: true,
    },{
      type: 'button',
      caption: $localize`Exportar`,
      tooltip: $localize`Exporta la vista`,
      icon: 'download',
      class: 'accent',
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: false,
    },{
      type: 'searchbox',
      caption: '',
      tooltip: '',
      icon: '',
      class: '',
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: true,
    },];
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

  setTabIndex(e: any) {    
    this.currentTabIndex = e;    
  }

// End ======================
}
