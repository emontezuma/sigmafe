import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent} from './input-field.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InputFieldComponent,    
  ],
  exports: [
    InputFieldComponent,    
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class InputFieldModule { }
