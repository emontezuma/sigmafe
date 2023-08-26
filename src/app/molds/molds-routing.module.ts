import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoldsHitsCounterComponent } from './pages/molds-hits-counter/molds-hits-counter.component';
import { accessValidationGuard } from '../guards/access-validation.guard';
 
const routes: Routes = [
  {
    path: '',
    component: MoldsHitsCounterComponent,
    data: { animation: 'MoldsHitsCounterComponent' },
    children: [
      {
        path: '**',
        component: MoldsHitsCounterComponent,
        data: { animation: 'MoldsHitsCounterComponent' },
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
