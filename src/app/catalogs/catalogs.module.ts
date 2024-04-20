import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material';
import { SpinnerModule } from '../shared/components';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageNotFoundModule } from '../shared/directives';
import { CatalogMoldsComponent, CatalogsHomeComponent } from './pages';
import { CatalogsRoutingModule } from './catalogs-routing.module'


@NgModule({
  declarations: [
    CatalogMoldsComponent,
    CatalogsHomeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSkeletonLoaderModule.forRoot(),
    SpinnerModule,
    ImageNotFoundModule,
    CatalogsRoutingModule,
  ],   
})
export class CatalogsModule { }
