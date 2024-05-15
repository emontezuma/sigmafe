import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoldsHitsCounterComponent } from './pages';
import { accessValidationGuard } from '../guards/access-validation.guard';
 
const routes: Routes = [
  {
    path: '',
    component: MoldsHitsCounterComponent,
    data: { animation: 'MoldsHitsCounterComponent' },
    canActivate: [accessValidationGuard],        
    children: [
      {
        path: '**',
        component: MoldsHitsCounterComponent,
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
