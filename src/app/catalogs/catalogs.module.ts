import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageNotFoundModule, OptionsScrollModule, FocusInvalidInputModule } from '../shared/directives';
import { CatalogMoldsListComponent, CatalogsHomeComponent, CatalogMoldEditionComponent, CatalogVariableEditionComponent, CatalogVariablesListComponent } from './pages';
import { CatalogsRoutingModule } from './catalogs-routing.module'
import { LabelEllipsisModule, SpinnerModule, ReadonlyFieldModule, AutoCompleteFieldModule, InputFieldModule, AreaFieldModule, SelectFieldModule, LazyLoadingListModule } from '../shared/components';
import { MaintenanceHistoryDialogComponent } from './components/maintenance-history-dialog/maintenance-history-dialog.component';

@NgModule({
  declarations: [
    CatalogMoldsListComponent,
    CatalogsHomeComponent,
    CatalogMoldEditionComponent,
    MaintenanceHistoryDialogComponent,
    CatalogVariableEditionComponent,
    CatalogVariablesListComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSkeletonLoaderModule.forRoot(),
    SpinnerModule,
    ImageNotFoundModule,
    OptionsScrollModule,
    CatalogsRoutingModule,
    LabelEllipsisModule,
    ReadonlyFieldModule,
    ReactiveFormsModule,
    FormsModule,
    AutoCompleteFieldModule,
    InputFieldModule,
    AreaFieldModule,
    SelectFieldModule,
    FocusInvalidInputModule,
    LazyLoadingListModule,
  ],   
})
export class CatalogsModule { }
