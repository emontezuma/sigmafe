import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { accessValidationGuard } from './guards/access-validation.guard';

const routes: Routes = [
  {
    path: 'checklists',
    loadChildren: () => import('./checklists/checklists.module').then(m => m.ChecklistsModule),
    canActivate: [accessValidationGuard]
  },
  {
    path: 'molds',
    loadChildren: () => import('./molds/molds.module').then(m => m.MoldsModule)
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
