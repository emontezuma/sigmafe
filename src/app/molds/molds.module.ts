import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { MaterialModule } from '../material';
import { MoldsHitsCounterComponent, MoldFastQueryComponent, MoldsHomeComponent } from './pages';
import { MoldsRoutingModule } from './molds-routing.module';
import { MoldHitsCounterComponent } from './components';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FilterPipe } from '../shared/pipes/filter.pipe';
import { ImageNotFoundModule } from '../shared/directives/image-not-found.module';
import { GenericDialogModule, MultipleSelectionListModule, ReadonlyFieldModule, SearchBoxModule, SpinnerModule } from '../shared/components';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';

LOAD_WASM('assets/wasm/ngx-scanner-qrcode.wasm').subscribe();


@NgModule({
  declarations: [
    MoldsHitsCounterComponent,
    MoldHitsCounterComponent,
    MoldsHomeComponent,
    FilterPipe,
    MoldFastQueryComponent,
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
    GenericDialogModule,
    ReadonlyFieldModule,
    SearchBoxModule,
    NgxScannerQrcodeModule
  ],
})
export class MoldsModule { }
