import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageNotFoundModule, OptionsScrollModule, FocusInvalidInputModule } from '../shared/directives';
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
    FormsModule,
    AutoCompleteFieldModule,
    InputFieldModule,
    AreaFieldModule,
    SelectFieldModule,
    FocusInvalidInputModule,
  ],   
})
export class CatalogsModule { }
