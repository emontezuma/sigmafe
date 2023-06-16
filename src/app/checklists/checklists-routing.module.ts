import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // component: HomeComponent,
    children: [
      {
        path: ':id',
        // component: ChecklistComponent
      },
      {
        path: '**',
        // component: ChecklistsComponent
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
