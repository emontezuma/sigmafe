import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoldsHitsCounterComponent, MoldFastQueryComponent, MoldsHomeComponent } from './pages';
import { accessValidationGuard } from '../guards/access-validation.guard';
 
const routes: Routes = [
  {
    path: '',
    component: MoldsHomeComponent,
    data: { animation: 'ChecklistsHomeComponent' },
    children: [
      {
        path: 'query',
        component: MoldFastQueryComponent,
        data: { animation: 'MoldFastQueryComponent', },                
      },
      {
        path: 'query/:reference',
        component: MoldFastQueryComponent,
        data: { animation: 'MoldFastQueryComponent', },                
      },
      {
        path: '**',
        component: MoldsHitsCounterComponent,
        data: { animation: 'MoldsHitsCounterComponent', accessType: 'team-member' },        
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
export class MoldsRoutingModule { }
