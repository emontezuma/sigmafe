import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";

import { routingAnimation } from '../../../shared/animations/shared.animations';
import { SmallFont, SpinnerFonts, SpinnerLimits } from 'src/app/shared/models/colors.models';
import { ApplicationModules, ScreenSizes, ToolbarButtons } from 'src/app/shared/models/screen.models';
import { AppState } from '../../../state/app.state'; 
import { SharedService } from 'src/app/shared/services/shared.service';
import { ColorsService } from 'src/app/shared/services/colors.service';
import { SettingsData } from 'src/app/shared/models/settings.models';
import { ProfileData } from 'src/app/shared/models/profile.models';
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { selectColorsData } from 'src/app/state/selectors/colors.selectors';

@Component({
  selector: 'app-checklist-filling',
  templateUrl: './checklist-filling.component.html',
  animations: [ routingAnimation ],
  styleUrls: ['./checklist-filling.component.scss']
})
export class ChecklistFillingComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
  @ViewChild('checklistFilling') private moldsQueryList: ElementRef;  
  
  valueToChart = 89;
  limits: SpinnerLimits[] = [];
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
  
  form = new FormGroup({
  });

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
    private colorsService: ColorsService,
    public scrollDispatcher: ScrollDispatcher,
  ) { }

// Hooks ====================
  ngOnInit(): void {
    this.store.select(selectSettingsData).subscribe( settingsData => {
      this.settingsData = settingsData;
    });    
    this.store.select(selectProfileData).subscribe( profileData => {
      this.profileData = profileData;
    });
    this.sharedService.setSearchBox(
      ApplicationModules.MOLDS_HITS_VIEW,
      true,
    );
    this.sharedService.search.subscribe((searchBox) => {
      if (searchBox.from === ApplicationModules.MOLDS_HITS_VIEW) {
        // this.filterMoldsBy = searchBox.textToSearch;  
      }
    });
    this.sharedService.isAnimationFinished.subscribe((animationStatus) => {      
      if (animationStatus.isFinished && animationStatus.toState === 'ChecklistFillingComponent') {
        // this.animateToolbar(null);
      }      
    }); 
    this.store.select(selectColorsData).subscribe( colorsData => {
      this.colorsService.setColors(ApplicationModules.MOLDS_HITS_VIEW, colorsData)
    });
    this.sharedService.showGoTop.subscribe((goTop) => {
      if (goTop.status === 'temp') {
        this.onTopStatus = 'active';
        this.moldsQueryList.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
        // Ensure
      }      
    });
    this.scrollDispatcher
    .scrolled()
    .subscribe((data: any) => {      
      this.getScrolling(data);
    });
    this.sharedService.setGeneralLoading(
      ApplicationModules.CHECKLIST_FILLING,
      true,
    );    
    // this.store.dispatch(loadMoldsHitsQueryData());    
  }

  ngAfterViewInit(): void {
    const progressBars = document.getElementsByName("active-progress-bar");
    progressBars.forEach((element) => {
      element?.style.setProperty('--mdc-linear-progress-track-color', 'var(--theme-warn-100)');     
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
  }
// Functions ================
  animationFinished(e: any) {
    if (e === null || e.fromState === 'void') {
      setTimeout(() => {
        this.calcButtons();
        this.sharedService.setToolbar(
          ApplicationModules.CHECKLIST_FILLING,
          true,
          'toolbar-grid-adjusted',
          'divider-adjusted',
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
      primary: false,
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
      primary: false,
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
      primary: false,
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
      primary: false,
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
      primary: false,
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
      primary: false,
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
      locked: false,
      showCaption: true,
      disabled: false,
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

// End ======================
}
