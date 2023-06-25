import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { MoldsHitsCounterComponent } from './pages/molds-hits-counter/molds-hits-counter.component';
import { MoldsRoutingModule } from './molds-routing.module';
import { MoldHitsCounterComponent } from './components/mold-hits-counter/mold-hits-counter.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    MoldsHitsCounterComponent,
    MoldHitsCounterComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MoldsRoutingModule,NgxSkeletonLoaderModule.forRoot(),
  ]
})
export class MoldsModule { }
