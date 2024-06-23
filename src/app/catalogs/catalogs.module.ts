import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageNotFoundModule, OptionsScrollModule, FocusInvalidInputModule } from '../shared/directives';
import { CatalogMoldsListComponent, CatalogsHomeComponent, CatalogMoldEditionComponent, CatalogVariableEditionComponent, CatalogVariablesListComponent, CatalogCustomersListComponent, CatalogCustomerEditionComponent, CatalogManufacturersListComponent, CatalogManufacturerEditionComponent } from './pages';
import { CatalogsRoutingModule } from './catalogs-routing.module'
import { LabelEllipsisModule, SpinnerModule, ReadonlyFieldModule, AutoCompleteFieldModule, InputFieldModule, AreaFieldModule, SelectFieldModule, MultipleSelectionListModule } from '../shared/components';

const manufacturer=[CatalogManufacturersListComponent,CatalogManufacturerEditionComponent]
const customer = [CatalogCustomersListComponent, CatalogCustomerEditionComponent]
const variable=[CatalogVariableEditionComponent,CatalogVariablesListComponent]

@NgModule({
  declarations: [
    CatalogMoldsListComponent,
    CatalogsHomeComponent,
    CatalogMoldEditionComponent,
    ...variable,
    ...customer,
    ...manufacturer

  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSkeletonLoaderModule.forRoot(),
    SpinnerModule,
    ImageNotFoundModule,
    OptionsScrollModule,
    CatalogsRoutingModule,
    MultipleSelectionListModule,
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
