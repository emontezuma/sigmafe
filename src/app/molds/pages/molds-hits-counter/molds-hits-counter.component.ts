import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { fromTop } from '../../../shared/animations/shared.animations';
import { MoldsData } from '../../models/molds.models';
import { AppState } from '../../../state/app.state'; 
import { selectSharedScreen } from '../../../state/selectors/screen.selectors'; 
import { selectMoldsData, selectLoadingState } from '../../../state/selectors/molds.selectors'; 
import { loadMoldsData } from 'src/app/state/actions/molds.actions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ApplicationModules, ToolbarButtons } from 'src/app/shared/models/screen.models';
import { SettingsData } from '../../../shared/models/settings.models'
import { selectSettingsData } from 'src/app/state/selectors/settings.selectors';
import { selectProfileData } from 'src/app/state/selectors/profile.selectors';
import { ProfileData } from 'src/app/shared/models/profile.module';

@Component({
  selector: 'app-molds-hits-counter',
  animations: [ fromTop ],
  templateUrl: './molds-hits-counter.component.html',
  styleUrls: ['./molds-hits-counter.component.scss']
})
export class MoldsHitsCounterComponent implements OnInit {
  @ViewChild('moldsList') moldList: ElementRef;

// Variables ===============
  moldsData: MoldsData;
  settingsData: SettingsData;
  profileData: ProfileData;
  colsBySize: number = 2;
  size: string = 'Small';
  cardWidth: string;
  loading: boolean = true;
  animate: boolean = true;
  filterMoldsBy: string = '';
  buttons: ToolbarButtons[] = [];

  form = new FormGroup({

  });

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
  ) { }

// Hooks ====================
  ngOnInit() {
    this.store.dispatch(loadMoldsData());
    this.calcButtons();
    this.store.select(selectSettingsData).subscribe( settingsData => {
      this.settingsData = settingsData;
    });
    this.store.select(selectSharedScreen).subscribe( shared => {
      this.size = shared.size;      
    });
    this.store.select(selectProfileData).subscribe( profileData => {
      this.profileData = profileData;
    });
    this.store.select(selectLoadingState).subscribe( loading => {
      this.loading = loading;
      this.sharedService.setGeneralLoading(
        ApplicationModules.MOLDS_HITS_VIEW,
        loading,
      );
      this.sharedService.setGeneralPreogressBar(
        ApplicationModules.MOLDS_HITS_VIEW,
        loading,
      );      
    });
    this.sharedService.setSearchBox(
      ApplicationModules.MOLDS_HITS_VIEW,
      true,
    );
    
    this.store.select(selectMoldsData).subscribe( moldsData => { 
      this.moldsData = moldsData;            
    });
    this.sharedService.search.subscribe((searchBox) => {
      if (searchBox.from === ApplicationModules.MOLDS_HITS_VIEW) {
        this.filterMoldsBy = searchBox.textToSearch;  
      }
    });
  }

  ngOnDestroy() : void {
    this.sharedService.setToolbar(
      ApplicationModules.MOLDS_HITS_VIEW,
      false,
      this.buttons,
    );  
  }

// Functions ================
  animateToolbar(e: any) {
    if (e.fromState === 'void') {
      setTimeout(() => {
        this.sharedService.setToolbar(
          ApplicationModules.MOLDS_HITS_VIEW,
          true,
          this.buttons,
        );
        this.sharedService.setGeneralScrollBar(
          ApplicationModules.MOLDS_HITS_VIEW,
          true,
        );
      }, 300);
    }
  }

  calcButtons() {
    this.buttons = [{
      type: 'button',
      caption: $localize`Actualizar`,
      tooltip:  $localize`Actualiza la vista`,
      icon: 'replay',
      primary: false,
      iconSize: '24px',
      showIcon: true,
      showTooltip: true,
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
      disabled: true,
    },{
      type: 'searchbox',
      caption: '',
      tooltip: '',
      icon: '',
      primary: false,
      iconSize: '',
      showIcon: true,
      showTooltip: true,
      disabled: true,
    },];
  }
  
  trackByFn(index: any, item: any) { 
    return index; 
  }

// End ======================
}
