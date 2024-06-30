import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageNotFoundModule, OptionsScrollModule, FocusInvalidInputModule } from '../shared/directives';
import { CatalogChecklistTemplatesListComponent, CatalogMoldsListComponent, CatalogsHomeComponent, CatalogMoldEditionComponent, CatalogVariableEditionComponent, CatalogVariablesListComponent, CatalogCustomersListComponent, CatalogCustomerEditionComponent, CatalogManufacturersListComponent, CatalogManufacturerEditionComponent, CatalogPlantEditionComponent, CatalogPlantsListComponent, CatalogCompaniesListComponent, CatalogCompanyEditionComponent, CatalogProvidersListComponent, CatalogProviderEditionComponent, CatalogEquipmentsListComponent, CatalogEquipmentEditionComponent, CatalogDepartmentsListComponent, CatalogDepartmentEditionComponent, CatalogChecklistTemplatesEditionComponent, CatalogUomsListComponent, CatalogUomEditionComponent, CatalogPositionsListComponent, CatalogPositionEditionComponent } from './pages';
import { CatalogsRoutingModule } from './catalogs-routing.module'
import { LabelEllipsisModule, SpinnerModule, ReadonlyFieldModule, AutoCompleteFieldModule, InputFieldModule, AreaFieldModule, SelectFieldModule, MultipleSelectionListModule } from '../shared/components';

const manufacturer = [CatalogManufacturersListComponent, CatalogManufacturerEditionComponent]
const customer = [CatalogCustomersListComponent, CatalogCustomerEditionComponent]
const variable = [CatalogVariableEditionComponent, CatalogVariablesListComponent]
const plant = [CatalogPlantEditionComponent, CatalogPlantsListComponent]
const company = [CatalogCompaniesListComponent, CatalogCompanyEditionComponent]

@NgModule({
  declarations: [
    CatalogMoldsListComponent,
    CatalogMoldEditionComponent,
    CatalogsHomeComponent,    
    CatalogProvidersListComponent,
    CatalogProviderEditionComponent,
    CatalogChecklistTemplatesListComponent,
    CatalogChecklistTemplatesEditionComponent,
    ...variable,
    ...customer,
    ...manufacturer,
    ...plant,
    ...company,    
    CatalogProvidersListComponent,
    CatalogProviderEditionComponent,
    
    CatalogEquipmentsListComponent,
    CatalogEquipmentEditionComponent,
    
    CatalogDepartmentsListComponent,
    CatalogDepartmentEditionComponent,

    CatalogUomsListComponent,
    CatalogUomEditionComponent,

    CatalogPositionsListComponent,
    CatalogPositionEditionComponent,

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
