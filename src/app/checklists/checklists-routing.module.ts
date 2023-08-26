import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecklistFillingComponent } from './pages/checklist-filling/checklist-filling.component';
import { HomeComponent } from './pages/home/home.component';
import { accessValidationGuard } from '../guards/access-validation.guard';
import { formDeactivateGuard } from '../guards/form-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: ChecklistFillingComponent,
    data: { animation: 'ChecklistFillingComponent' },
    canActivate: [accessValidationGuard],        
    canDeactivate: [formDeactivateGuard],
    children: [
      {
        path: ':id',
        component: ChecklistFillingComponent,
        data: { animation: 'ChecklistFillingComponent' },
      },
      {
        path: '**',
        component: ChecklistFillingComponent,
        data: { animation: 'ChecklistFillingComponent' },
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
export class ChecklistsRoutingModule { }
