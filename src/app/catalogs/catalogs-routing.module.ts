import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogChecklistTemplatesListComponent, CatalogMoldsListComponent, CatalogMoldEditionComponent, CatalogVariablesListComponent, CatalogVariableEditionComponent, CatalogsHomeComponent, CatalogCustomersListComponent, CatalogCustomerEditionComponent, CatalogManufacturersListComponent, CatalogManufacturerEditionComponent, CatalogPlantEditionComponent, CatalogPlantsListComponent, CatalogCompaniesListComponent, CatalogCompanyEditionComponent, CatalogEquipmentsListComponent, CatalogEquipmentEditionComponent, CatalogDepartmentsListComponent, CatalogDepartmentEditionComponent, CatalogChecklistTemplatesEditionComponent, CatalogUomsListComponent, CatalogUomEditionComponent, CatalogPositionsListComponent, CatalogPositionEditionComponent, CatalogPartNumbersListComponent, CatalogPartNumberEditionComponent, CatalogLinesListComponent, CatalogLineEditionComponent, CatalogGenericsListComponent, CatalogGenericEditionComponent, CatalogShiftsListComponent, CatalogShiftEditionComponent, CatalogProvidersListComponent, CatalogProviderEditionComponent, CatalogChecklistPlansListComponent, CatalogChecklistPlansEditionComponent, CatalogWorkgroupEditionComponent, CatalogWorkgroupsListComponent, CatalogRecipientEditionComponent, CatalogRecipientsListComponent, CatalogSigmaTypeEditionComponent, CatalogSigmaTypesListComponent, CatalogMoldControlEditionComponent, CatalogUserEditionComponent, CatalogUsersListComponent, CatalogQueriesListComponent, CatalogQueryEditionComponent } from './pages';
import { accessValidationGuard } from '../guards/access-validation.guard';

const routes: Routes = [
  {
    path: '',
    component: CatalogsHomeComponent,    
    children: [
      {
        path: 'molds',
        component: CatalogMoldsListComponent,
        data: { animation: 'CatalogMoldsComponent', showAddButton: true, accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'molds-control',
        component: CatalogMoldsListComponent,
        data: { animation: 'CatalogMoldsComponent', showAddButton: false, accessType: 'team-leader' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'molds/create',
        component: CatalogMoldEditionComponent,
        data: { animation: 'CatalogMoldEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'molds/edit/:id',
        component: CatalogMoldEditionComponent,
        data: { animation: 'CatalogMoldEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'molds-control/edit/:id',
        component: CatalogMoldControlEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-leader' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'variables',
        component: CatalogVariablesListComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'variables/create',
        component: CatalogVariableEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'variables/edit/:id',
        component: CatalogVariableEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'customers',
        component: CatalogCustomersListComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'customers/create',
        component: CatalogCustomerEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'customers/edit/:id',
        component: CatalogCustomerEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'manufacturers',
        component: CatalogManufacturersListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'manufacturers/create',
        component: CatalogManufacturerEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'manufacturers/edit/:id',
        component: CatalogManufacturerEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'plants',
        component: CatalogPlantsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'plants/create',
        component: CatalogPlantEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'plants/edit/:id',
        component: CatalogPlantEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'companies',
        component: CatalogCompaniesListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'companies/create',
        component: CatalogCompanyEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'companies/edit/:id',
        component: CatalogCompanyEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'checklist-templates',
        component: CatalogChecklistTemplatesListComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },      
      {
        path: 'checklist-templates/create',
        component: CatalogChecklistTemplatesEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'checklist-templates/edit/:id',
        component: CatalogChecklistTemplatesEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'checklist-plans',
        component: CatalogChecklistPlansListComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'checklist-plans/create',
        component: CatalogChecklistPlansEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'checklist-plans/edit/:id',
        component: CatalogChecklistPlansEditionComponent,
        data: { animation: 'CatalogMoldControlEditionComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'equipments',
        component: CatalogEquipmentsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'equipments/create',
        component: CatalogEquipmentEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'equipments/edit/:id',
        component: CatalogEquipmentEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'departments',
        component: CatalogDepartmentsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'departments/create',
        component: CatalogDepartmentEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'departments/edit/:id',
        component: CatalogDepartmentEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'uoms',
        component: CatalogUomsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'uoms/create',
        component: CatalogUomEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'uoms/edit/:id',
        component: CatalogUomEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'positions',
        component: CatalogPositionsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'positions/create',
        component: CatalogPositionEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'positions/edit/:id',
        component: CatalogPositionEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'part-numbers',
        component: CatalogPartNumbersListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'part-numbers/create',
        component: CatalogPartNumberEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'part-numbers/edit/:id',
        component: CatalogPartNumberEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'lines',
        component: CatalogLinesListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'lines/create',
        component: CatalogLineEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'lines/edit/:id',
        component: CatalogLineEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'generics',
        component: CatalogGenericsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'generics/create',
        component: CatalogGenericEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'generics/edit/:id',
        component: CatalogGenericEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'shifts',
        component: CatalogShiftsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'shifts/create',
        component: CatalogShiftEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'shifts/edit/:id',
        component: CatalogShiftEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'providers',
        component: CatalogProvidersListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'providers/create',
        component: CatalogProviderEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'providers/edit/:id',
        component: CatalogProviderEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'workgroups',
        component: CatalogWorkgroupsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'workgroups/create',
        component: CatalogWorkgroupEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'workgroups/edit/:id',
        component: CatalogWorkgroupEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'recipients',
        component: CatalogRecipientsListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'recipients/create',
        component: CatalogRecipientEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'recipients/edit/:id',
        component: CatalogRecipientEditionComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'team-leader' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'sigma-types',
        component: CatalogSigmaTypesListComponent,
        data: { animation: 'CatalogSigmaTypesListComponent', accessType: 'team-member' },
      },
      {
        path: 'sigma-types/create',
        component: CatalogSigmaTypeEditionComponent,
        data: { animation: 'CatalogSigmaTypeEditionComponent', accessType: 'team-member' },
      },
      {
        path: 'sigma-types/edit/:id',
        component: CatalogSigmaTypeEditionComponent,
        data: { animation: 'CatalogSigmaTypeEditionComponent', accessType: 'team-member' },
      },
      {
        path: 'queries',
        component: CatalogQueriesListComponent,
        data: { animation: 'CatalogQueriesListComponent', accessType: 'team-member' },
      },
      {
        path: 'queries/create',
        component: CatalogQueryEditionComponent,
        data: { animation: 'CatalogQueryEditionComponent', accessType: 'team-member' },
      },
      {
        path: 'queries/edit/:id',
        component: CatalogQueryEditionComponent,
        data: { animation: 'CatalogQueryEditionComponent', accessType: 'team-member' },
      },
      {
        path: 'users',
        component: CatalogUsersListComponent,
        data: { animation: 'CatalogUsersListComponent', accessType: 'admin' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'users/create',
        component: CatalogUserEditionComponent,
        data: { animation: 'CatalogUserEditionComponent', accessType: 'admin' },
        canActivate: [accessValidationGuard],
      },
      {
        path: 'users/edit/:id',
        component: CatalogUserEditionComponent,
        data: { animation: 'CatalogUserEditionComponent', accessType: 'admin' },
        canActivate: [accessValidationGuard],
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
