import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDialogComponent } from './generic-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerModule } from '../spinner';
import { AutoCompleteFieldModule } from '../auto-complete-field';

@NgModule({
  declarations: [
    GenericDialogComponent,    
  ],
  exports: [
    GenericDialogComponent, 
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    SpinnerModule,
    AutoCompleteFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class GenericDialogModule { }
