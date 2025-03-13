import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material';
import { ChecklistFillingComponent, ChecklistsHomeComponent, ChecklistsListComponent, ChecklistsLoginComponent } from './pages';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { LabelEllipsisModule, SpinnerModule, ReadonlyFieldModule, MultipleSelectionListModule, GenericDialogModule } from '../shared/components';
import { IconsModule } from '../shared/icons';
import { ImageNotFoundModule } from '../shared/directives';
import { ChecklistFillingItemsComponent, QuestionToolbarComponent } from './components';
import { ButtonMenuModule } from '../shared/components/button-menu/button-menu.module';

@NgModule({
  declarations: [  
    ChecklistFillingComponent,
    ChecklistsHomeComponent,
    ChecklistFillingItemsComponent,
    QuestionToolbarComponent,
    ChecklistsListComponent,
    ChecklistsLoginComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MultipleSelectionListModule,
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
    ReadonlyFieldModule,
    ButtonMenuModule,
    ReactiveFormsModule,
    FormsModule,
    GenericDialogModule,
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    },
  ]
})
export class ChecklistsModule { }
