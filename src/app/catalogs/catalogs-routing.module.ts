import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogChecklistTemplatesListComponent, CatalogMoldsListComponent, CatalogMoldEditionComponent, CatalogVariablesListComponent, CatalogVariableEditionComponent, CatalogsHomeComponent, CatalogCustomersListComponent, CatalogCustomerEditionComponent, CatalogManufacturersListComponent, CatalogManufacturerEditionComponent, CatalogPlantEditionComponent, CatalogPlantsListComponent, CatalogCompaniesListComponent, CatalogCompanyEditionComponent, CatalogEquipmentsListComponent, CatalogEquipmentEditionComponent, CatalogDepartmentsListComponent, CatalogDepartmentEditionComponent, CatalogChecklistTemplatesEditionComponent, CatalogUomsListComponent, CatalogUomEditionComponent, CatalogPositionsListComponent, CatalogPositionEditionComponent, CatalogPartNumbersListComponent, CatalogPartNumberEditionComponent, CatalogLinesListComponent, CatalogLineEditionComponent, CatalogGenericsListComponent, CatalogGenericEditionComponent, CatalogShiftsListComponent, CatalogShiftEditionComponent, CatalogProvidersListComponent, CatalogProviderEditionComponent, CatalogChecklistPlansListComponent, CatalogChecklistPlansEditionComponent } from './pages';
import { accessValidationGuard } from '../guards/access-validation.guard';
import { formDeactivateGuard } from '../guards/form-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: CatalogsHomeComponent,
    data: { animation: 'CatalogsHomeComponent' },
    canActivate: [accessValidationGuard],        
    canDeactivate: [formDeactivateGuard],
    children: [
      {
        path: 'molds',
        component: CatalogMoldsListComponent,
        data: { animation: 'CatalogMoldsComponent' },
      },
      {
        path: 'molds/create',
        component: CatalogMoldEditionComponent,
        data: { animation: 'CatalogMoldEditionComponent' },
      },
      {
        path: 'molds/edit/:id',
        component: CatalogMoldEditionComponent,
        data: { animation: 'CatalogMoldEditionComponent' },
      },
      {
        path: 'variables',
        component: CatalogVariablesListComponent,
        data: { animation: 'CatalogVariablesComponent' },
      },
      {
        path: 'variables/create',
        component: CatalogVariableEditionComponent,
        data: { animation: 'CatalogVariableEditionComponent' },
      },
      {
        path: 'variables/edit/:id',
        component: CatalogVariableEditionComponent,
        data: { animation: 'CatalogVariableEditionComponent' },
      },
      {
        path: 'customers',
        component: CatalogCustomersListComponent,
        data: { animation: 'CatalogCustomersComponent' },
      },
      {
        path: 'customers/create',
        component: CatalogCustomerEditionComponent,
        data: { animation: 'CatalogCustomerEditionComponent' },
      },
      {
        path: 'customers/edit/:id',
        component: CatalogCustomerEditionComponent,
        data: { animation: 'CatalogCustomerEditionComponent' },
      },
      {
        path: 'manufacturers',
        component: CatalogManufacturersListComponent,
        data: { animation: 'CatalogCustomersComponent' },
      },
      {
        path: 'manufacturers/create',
        component: CatalogManufacturerEditionComponent,
        data: { animation: 'CatalogManufacturerEditionComponent' },
      },
      {
        path: 'manufacturers/edit/:id',
        component: CatalogManufacturerEditionComponent,
        data: { animation: 'CatalogManufacturerEditionComponent' },
      },
      {
        path: 'plants',
        component: CatalogPlantsListComponent,
        data: { animation: 'CatalogPlantsComponent' },
      },
      {
        path: 'plants/create',
        component: CatalogPlantEditionComponent,
        data: { animation: 'CatalogPlantEditionComponent' },
      },
      {
        path: 'plants/edit/:id',
        component: CatalogPlantEditionComponent,
        data: { animation: 'CatalogPlantEditionComponent' },
      },
      {
        path: 'companies',
        component: CatalogCompaniesListComponent,
        data: { animation: 'CatalogCompaniesComponent' },
      },
      {
        path: 'companies/create',
        component: CatalogCompanyEditionComponent,
        data: { animation: 'CatalogCompanyEditionComponent' },
      },
      {
        path: 'companies/edit/:id',
        component: CatalogCompanyEditionComponent,
        data: { animation: 'CatalogCompanyEditionComponent' },
      },
      {
        path: 'checklist-templates',
        component: CatalogChecklistTemplatesListComponent,
        data: { animation: 'CatalogChecklistTemplatesListComponent' },
      },      
      {
        path: 'checklist-templates/create',
        component: CatalogChecklistTemplatesEditionComponent,
        data: { animation: '...' },
      },
      {
        path: 'checklist-templates/edit/:id',
        component: CatalogChecklistTemplatesEditionComponent,
        data: { animation: '...' },
      },
      {
        path: 'checklist-plans',
        component: CatalogChecklistPlansListComponent,
        data: { animation: 'CatalogChecklistPlansListComponent' },
      },
      {
        path: 'checklist-plans/create',
        component: CatalogChecklistPlansEditionComponent,
        data: { animation: '...' },
      },
      {
        path: 'checklist-plans/edit/:id',
        component: CatalogChecklistPlansEditionComponent,
        data: { animation: '...' },
      },
      {
        path: 'equipments',
        component: CatalogEquipmentsListComponent,
        data: { animation: 'CatalogEquipmentsComponent' },
      },
      {
        path: 'equipments/create',
        component: CatalogEquipmentEditionComponent,
        data: { animation: 'CatalogEquipmentEditionComponent' },
      },
      {
        path: 'equipments/edit/:id',
        component: CatalogEquipmentEditionComponent,
        data: { animation: 'CatalogEquipmentEditionComponent' },
      },
      {
        path: 'departments',
        component: CatalogDepartmentsListComponent,
        data: { animation: 'CatalogDepartmentsComponent' },
      },
      {
        path: 'departments/create',
        component: CatalogDepartmentEditionComponent,
        data: { animation: 'CatalogDepartmentEditionComponent' },
      },
      {
        path: 'departments/edit/:id',
        component: CatalogDepartmentEditionComponent,
        data: { animation: 'CatalogDepartmentEditionComponent' },
      },
      {
        path: 'uoms',
        component: CatalogUomsListComponent,
        data: { animation: 'CatalogUomsComponent' },
      },
      {
        path: 'uoms/create',
        component: CatalogUomEditionComponent,
        data: { animation: 'CatalogUomEditionComponent' },
      },
      {
        path: 'uoms/edit/:id',
        component: CatalogUomEditionComponent,
        data: { animation: 'CatalogUomEditionComponent' },
      },
      {
        path: 'positions',
        component: CatalogPositionsListComponent,
        data: { animation: 'CatalogPositionsComponent' },
      },
      {
        path: 'positions/create',
        component: CatalogPositionEditionComponent,
        data: { animation: 'CatalogPositionEditionComponent' },
      },
      {
        path: 'positions/edit/:id',
        component: CatalogPositionEditionComponent,
        data: { animation: 'CatalogPositionEditionComponent' },
      },
      {
        path: 'part-numbers',
        component: CatalogPartNumbersListComponent,
        data: { animation: 'CatalogPartNumbersComponent' },
      },
      {
        path: 'part-numbers/create',
        component: CatalogPartNumberEditionComponent,
        data: { animation: 'CatalogPartNumberEditionComponent' },
      },
      {
        path: 'part-numbers/edit/:id',
        component: CatalogPartNumberEditionComponent,
        data: { animation: 'CatalogPartNumberEditionComponent' },
      },
      {
        path: 'lines',
        component: CatalogLinesListComponent,
        data: { animation: 'CatalogLinesComponent' },
      },
      {
        path: 'lines/create',
        component: CatalogLineEditionComponent,
        data: { animation: 'CatalogLineEditionComponent' },
      },
      {
        path: 'lines/edit/:id',
        component: CatalogLineEditionComponent,
        data: { animation: 'CatalogLineEditionComponent' },
      },
      {
        path: 'generics',
        component: CatalogGenericsListComponent,
        data: { animation: 'CatalogGenericsComponent' },
      },
      {
        path: 'generics/create',
        component: CatalogGenericEditionComponent,
        data: { animation: 'CatalogGenericEditionComponent' },
      },
      {
        path: 'generics/edit/:id',
        component: CatalogGenericEditionComponent,
        data: { animation: 'CatalogGenericEditionComponent' },
      },
      {
        path: 'shifts',
        component: CatalogShiftsListComponent,
        data: { animation: 'CatalogShiftsComponent' },
      },
      {
        path: 'shifts/create',
        component: CatalogShiftEditionComponent,
        data: { animation: 'CatalogShiftEditionComponent' },
      },
      {
        path: 'shifts/edit/:id',
        component: CatalogShiftEditionComponent,
        data: { animation: 'CatalogShiftEditionComponent' },
      },
      {
        path: 'providers',
        component: CatalogProvidersListComponent,
        data: { animation: 'CatalogprovidersComponent' },
      },
      {
        path: 'providers/create',
        component: CatalogProviderEditionComponent,
        data: { animation: 'CatalogProviderEditionComponent' },
      },
      {
        path: 'providers/edit/:id',
        component: CatalogProviderEditionComponent,
        data: { animation: 'CatalogProviderEditionComponent' },
      },
      {
        path: '**',
        component: CatalogsHomeComponent,
        data: { animation: 'CatalogsHomeComponent' },
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
