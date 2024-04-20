import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';

import { MaterialModule } from '../material';
import { ChecklistFillingComponent, ChecklistsHomeComponent } from './pages';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { SpinnerModule, ReadonlyFieldComponent } from '../shared/components';
import { LabelEllipsisModule } from '../shared/components/label-ellipsis';
import { IconsModule } from '../shared/icons';
import { ImageNotFoundModule } from '../shared/directives';
import { ChecklistFillingItemsComponent, ToolbarComponent } from './components';

@NgModule({
  declarations: [  
    ChecklistFillingComponent,
    ChecklistsHomeComponent,
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
