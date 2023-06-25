import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';

import { sampleMoldsData } from '../../../shared/sample-data'
import { MoldsData } from '../../models/molds.models';
import { AppState } from '../../../state/app.state'; 


@Component({
  selector: 'app-molds-hits-counter',
  templateUrl: './molds-hits-counter.component.html',
  styleUrls: ['./molds-hits-counter.component.scss']
})
export class MoldsHitsCounterComponent {

  // Variables ================
  moldsData: MoldsData = sampleMoldsData;
  colsBySize: number = 2;
  size: string = 'Small';

  form = new FormGroup({

  });

  constructor(
    private store: Store<AppState>,
  ) { }

  // Hooks ====================
  ngOnInit() {
    this.store.select('shared').subscribe( shared => {
      this.size = shared.screen.size;
      this.calculateLayout(this.size);
    });
    setTimeout(() => {
      this.moldsData.loading = false;
    }, 3000);
  }

   // Functions ================
   calculateLayout(size: string) {
    const maxCols = this.calculateCols(size);
    const minCols = 1; 
    this.colsBySize = this.moldsData.molds.length < maxCols ? this.moldsData.molds.length : maxCols;
  }

  prepareToolbar() {
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

  calculateCols(size: string = 'Small') {
    switch(size) {
      case 'Handset': return 2;
      case 'HandsetLandscape': return 2;
      case 'HandsetPortrait': return 1;
      case 'Large': return 5;
      case 'Medium': return 3;
      case 'Small': return 3;
      case 'Tablet': return 2;
      case 'TabletLandscape': return 4;
      case 'TabletPortrait': return 2;
      case 'Web': return 4;
      case 'WebLandscape': return 5;
      case 'WebPortrait': return 3;
      case 'XLarge': return 8;
      case 'XSmall': return 1;
      default: return 2;  
    }
  }
  // End ======================
}
