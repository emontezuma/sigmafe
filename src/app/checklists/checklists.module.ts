import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { ChecklistFillingComponent } from './pages/checklist-filling/checklist-filling.component';
import { HomeComponent } from './pages/home/home.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { SpinnerModule } from '../shared/components/spinner/spinner.module';
import { LabelEllipsisModule } from '../shared/components/label-ellipsis/label-ellipsis.module';
import { IconsModule } from '../shared/icons/icons.module';

@NgModule({
  declarations: [  
    ChecklistFillingComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ChecklistsRoutingModule,
    NgOptimizedImage,
    NgxSkeletonLoaderModule.forRoot(),
    SpinnerModule,
    IconsModule,
    LabelEllipsisModule,
  ]
})
export class ChecklistsModule { }
