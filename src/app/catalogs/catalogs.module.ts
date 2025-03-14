import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageNotFoundModule, OptionsScrollModule, FocusInvalidInputModule } from '../shared/directives';
import { CatalogChecklistTemplatesListComponent, CatalogMoldsListComponent, CatalogsHomeComponent, CatalogMoldEditionComponent, CatalogVariableEditionComponent, CatalogVariablesListComponent, CatalogCustomersListComponent, CatalogCustomerEditionComponent, CatalogManufacturersListComponent, CatalogManufacturerEditionComponent, CatalogPlantEditionComponent, CatalogPlantsListComponent, CatalogCompaniesListComponent, CatalogCompanyEditionComponent, CatalogProvidersListComponent, CatalogProviderEditionComponent, CatalogEquipmentsListComponent, CatalogEquipmentEditionComponent, CatalogDepartmentsListComponent, CatalogDepartmentEditionComponent, CatalogChecklistTemplatesEditionComponent, CatalogUomsListComponent, CatalogUomEditionComponent, CatalogPositionsListComponent, CatalogPositionEditionComponent, CatalogPartNumbersListComponent, CatalogPartNumberEditionComponent, CatalogLinesListComponent, CatalogLineEditionComponent, CatalogGenericsListComponent, CatalogGenericEditionComponent, CatalogShiftsListComponent, CatalogShiftEditionComponent, CatalogWorkgroupsListComponent, CatalogWorkgroupEditionComponent, CatalogChecklistPlansListComponent, CatalogChecklistPlansEditionComponent, CatalogRecipientsListComponent, CatalogRecipientEditionComponent, CatalogSigmaTypeEditionComponent, CatalogSigmaTypesListComponent, CatalogMoldControlEditionComponent, CatalogUserEditionComponent, CatalogUsersListComponent, CatalogQueriesListComponent, CatalogQueryEditionComponent } from './pages';
import { CatalogsRoutingModule } from './catalogs-routing.module'
import { LabelEllipsisModule, GenericDialogModule, SpinnerModule, ReadonlyFieldModule, AutoCompleteFieldModule, InputFieldModule, AreaFieldModule, SelectFieldModule, MultipleSelectionListModule } from '../shared/components';
import { VariableSelectionDialogComponent } from './components';
import { ChecklistTemplateEditionLineComponent } from './components/checklist-template-edition-line/checklist-template-edition-line.component';


const manufacturer = [CatalogManufacturersListComponent, CatalogManufacturerEditionComponent]
const customer = [CatalogCustomersListComponent, CatalogCustomerEditionComponent]
const variable = [CatalogVariableEditionComponent, CatalogVariablesListComponent]
const plant = [CatalogPlantEditionComponent, CatalogPlantsListComponent]
const company = [CatalogCompaniesListComponent, CatalogCompanyEditionComponent]

@NgModule({
  declarations: [
    CatalogMoldsListComponent,
    CatalogMoldEditionComponent,
    CatalogMoldControlEditionComponent,
    
    CatalogsHomeComponent,    
    CatalogProvidersListComponent,
    CatalogProviderEditionComponent,
    CatalogChecklistTemplatesListComponent,
    CatalogChecklistTemplatesEditionComponent,
    CatalogChecklistPlansListComponent,
    CatalogChecklistPlansEditionComponent,
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

    CatalogPartNumbersListComponent,
    CatalogPartNumberEditionComponent,

    CatalogLinesListComponent,
    CatalogLineEditionComponent,

    CatalogGenericsListComponent,
    CatalogGenericEditionComponent,

    CatalogWorkgroupsListComponent,
    CatalogWorkgroupEditionComponent,
    VariableSelectionDialogComponent,
    ChecklistTemplateEditionLineComponent,
    CatalogShiftsListComponent,
    CatalogShiftEditionComponent,

    CatalogRecipientsListComponent,
    CatalogRecipientEditionComponent,

    CatalogSigmaTypeEditionComponent,
    CatalogSigmaTypesListComponent,

    CatalogUserEditionComponent,
    CatalogUsersListComponent,

    CatalogQueryEditionComponent,
    CatalogQueriesListComponent,
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
    GenericDialogModule,    
  ],   
})
export class CatalogsModule { }
