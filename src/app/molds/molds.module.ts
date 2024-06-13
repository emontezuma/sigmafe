import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { MaterialModule } from '../material';
import { MoldsHitsCounterComponent } from './pages';
import { MoldsRoutingModule } from './molds-routing.module';
import { MoldHitsCounterComponent } from './components';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FilterPipe } from '../shared/pipes/filter.pipe';
import { ImageNotFoundModule } from '../shared/directives/image-not-found.module';
import { MultipleSelectionListModule, SpinnerModule } from '../shared/components';

@NgModule({
  declarations: [
    MoldsHitsCounterComponent,
    MoldHitsCounterComponent,
    FilterPipe,
  ],
  imports: [    
    CommonModule,    
    MaterialModule,
    MoldsRoutingModule,    
    NgOptimizedImage,
    NgxSkeletonLoaderModule.forRoot(),
    SpinnerModule,
    ImageNotFoundModule,    
    MultipleSelectionListModule,
  ],
})
export class MoldsModule { }
