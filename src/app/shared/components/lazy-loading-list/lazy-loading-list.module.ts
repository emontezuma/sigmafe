import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadingListComponent } from './lazy-loading-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OptionsScrollModule } from '../../directives';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    LazyLoadingListComponent,    
  ],
  exports: [
    LazyLoadingListComponent,    
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    OptionsScrollModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class LazyLoadingListModule { }
