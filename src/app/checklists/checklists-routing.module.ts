import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecklistFillingComponent } from './pages/checklist-filling/checklist-filling.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: ChecklistFillingComponent,
    data: { animation: 'ChecklistFillingComponent' },
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
