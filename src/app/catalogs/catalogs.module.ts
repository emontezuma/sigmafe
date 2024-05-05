import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageNotFoundModule, OptionsScrollModule } from '../shared/directives';
import { CatalogMoldsListComponent, CatalogsHomeComponent, CatalogMoldEditionComponent } from './pages';
import { CatalogsRoutingModule } from './catalogs-routing.module'
import { LabelEllipsisModule, SpinnerModule, ReadonlyFieldModule, AutoCompleteFieldModule, InputFieldModule, AreaFieldModule, SelectFieldModule } from '../shared/components';

@NgModule({
  declarations: [
    CatalogMoldsListComponent,
    CatalogsHomeComponent,
    CatalogMoldEditionComponent,    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSkeletonLoaderModule.forRoot(),
    SpinnerModule,
    ImageNotFoundModule,
    OptionsScrollModule,
    CatalogsRoutingModule,
    LabelEllipsisModule,
    ReadonlyFieldModule,
    ReactiveFormsModule,
    AutoCompleteFieldModule,
    InputFieldModule,
    AreaFieldModule,
    SelectFieldModule,
  ],   
})
export class CatalogsModule { }
