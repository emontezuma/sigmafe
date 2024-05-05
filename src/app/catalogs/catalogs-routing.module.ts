import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogMoldsListComponent, CatalogsHomeComponent, CatalogMoldEditionComponent } from './pages';
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
        path: '**',
        component: CatalogsHomeComponent,
        data: { animation: 'CatalogsHomeComponent' },
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
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