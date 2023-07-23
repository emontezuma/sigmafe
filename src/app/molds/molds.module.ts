import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { MoldsHitsCounterComponent } from './pages/molds-hits-counter/molds-hits-counter.component';
import { MoldsRoutingModule } from './molds-routing.module';
import { MoldHitsCounterComponent } from './components/mold-hits-counter/mold-hits-counter.component';
import { SpinnerModule } from '../shared/components/spinner/spinner.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FilterPipe } from '../shared/pipes/filter.pipe';
import { NotFoundDirective } from '../shared/directives/image-not-found.directive';

@NgModule({
  declarations: [
    MoldsHitsCounterComponent,
    MoldHitsCounterComponent,
    FilterPipe,
    NotFoundDirective,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MoldsRoutingModule,
    NgOptimizedImage,
    NgxSkeletonLoaderModule.forRoot(),
    SpinnerModule,
  ]
})
export class MoldsModule { }
