import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { fromTop } from '../../../shared/animations/shared.animations';
import { MoldsData } from '../../models/molds.models';
import { AppState } from '../../../state/app.state'; 
import { selectSharedScreen } from '../../../state/selectors/screen.selectors'; 
import { selectMoldsData, selectLoadingState } from '../../../state/selectors/molds.selectors'; 
import { loadMoldsData } from 'src/app/state/actions/molds.actions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ModulesWithSearchBox } from 'src/app/shared/models/screen.models';
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

  form = new FormGroup({

  });

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
  ) { }

// Hooks ====================
  ngOnInit() {
    console.log('entrro en molds');
    this.store.dispatch(loadMoldsData());
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
        ModulesWithSearchBox.MOLDSHITSQUERY,
        loading,
      );   
    });
    this.sharedService.setSearchBox(
      ModulesWithSearchBox.MOLDSHITSQUERY,
      true,
    );
    this.store.select(selectMoldsData).subscribe( moldsData => { 
      this.moldsData = moldsData;            
    });
    this.sharedService.search.subscribe((searchBox) => {
      if (searchBox.from === ModulesWithSearchBox.MOLDSHITSQUERY) {
        this.filterMoldsBy = searchBox.textToSearch;  
      }
    });
  }

// Functions ================
   repareToolbar() {
    const toolbar = [{
      caption: "Reiniciar",
      tooltip: "Reiniciar el checklist",
      icon: "replay",
      primary: false,
    },{
      caption: "Guardar",
      tooltip: "Guardar el checklist",
      icon: "save",
      primary: true,
    },{
      caption: "Cancelar",
      tooltip: "Cancelar la captura actual",
      icon: "undo",
      primary: false,
    },{
      caption: "Cerrar",
      tooltip: "Cerrar el checklist",
      icon: "close",
      small: true,
      primary: false,
    }];
  }

  trackByFn(index: any, item: any) { 
    return index; 
  }

// End ======================
}
