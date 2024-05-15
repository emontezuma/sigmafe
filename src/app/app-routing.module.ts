import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'checklists',
    loadChildren: () => import('./checklists/checklists.module').then(m => m.ChecklistsModule),
    data: { animation: 'isTop' },
  },
  {
    path: 'molds',
    loadChildren: () => import('./molds/molds.module').then(m => m.MoldsModule),    
    data: { animation: 'isTop' },
  },
  {
    path: 'catalogs',
    loadChildren: () => import('./catalogs/catalogs.module').then(m => m.CatalogsModule),    
    data: { animation: 'isTop' },
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
