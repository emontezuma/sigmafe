import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecklistFillingComponent, ChecklistsHomeComponent, ChecklistsListComponent, ChecklistsLoginComponent } from './pages';
import { accessValidationGuard } from '../guards/access-validation.guard';

const routes: Routes = [
  {
    path: '',
    component: ChecklistsHomeComponent,
    data: { animation: 'ChecklistsHomeComponent' },
    children: [
      {
        path: 'list',
        component: ChecklistsListComponent,
        data: { animation: 'ChecklistsListComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: 'login',
        component: ChecklistsLoginComponent,
        data: { animation: 'ChecklistsListComponent' },                
      },
      {
        path: 'fill/:id',
        component: ChecklistFillingComponent,        
        data: { animation: 'ChecklistsListComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
      },
      {
        path: '**',
        component: ChecklistsListComponent,
        data: { animation: 'ChecklistsListComponent', accessType: 'team-member' },        
        canActivate: [accessValidationGuard],
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
