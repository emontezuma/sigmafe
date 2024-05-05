import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectFieldComponent} from './select-field.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SelectFieldComponent,    
  ],
  exports: [
    SelectFieldComponent,    
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class SelectFieldModule { }
