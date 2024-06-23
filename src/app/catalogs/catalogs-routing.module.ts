import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogMoldsListComponent, CatalogMoldEditionComponent, CatalogVariablesListComponent, CatalogVariableEditionComponent, CatalogsHomeComponent, CatalogCustomersListComponent, CatalogCustomerEditionComponent, CatalogManufacturersListComponent, CatalogManufacturerEditionComponent } from './pages';
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
