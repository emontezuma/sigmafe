import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoldsHitsCounterComponent } from './pages/molds-hits-counter/molds-hits-counter.component';

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
