import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';

import { MaterialModule } from '../material/material.module';
import { ChecklistFillingComponent } from './pages/checklist-filling/checklist-filling.component';
import { HomeComponent } from './pages/home/home.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { SpinnerModule } from '../shared/components/spinner/spinner.module';
import { LabelEllipsisModule } from '../shared/components/label-ellipsis/label-ellipsis.module';
import { IconsModule } from '../shared/icons/icons.module';
import { ImageNotFoundModule } from '../shared/directives/image-not-found.module';
import { ChecklistFillingItemsComponent } from './components/checklist-filling-item/checklist-filling-item.component';
import { ToolbarComponent } from './components/question-toolbar/question-toolbar.component';
import { ReadonlyFieldComponent } from '../shared/components/readonly-field/readonly-field.component';

@NgModule({
  declarations: [  
    ChecklistFillingComponent,
    HomeComponent,
    ChecklistFillingItemsComponent,
    ToolbarComponent,
    ReadonlyFieldComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ChecklistsRoutingModule,
    NgOptimizedImage,
    NgxSkeletonLoaderModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    SpinnerModule,
    IconsModule,
    LabelEllipsisModule,
    ImageNotFoundModule,
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    },
  ]
})
export class ChecklistsModule { }
