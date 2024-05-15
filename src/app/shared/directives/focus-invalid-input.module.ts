import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusInvalidInputDirective } from './focus-invalid-input.directive';

@NgModule({
  declarations: [
    FocusInvalidInputDirective,
  ],
  exports: [
    FocusInvalidInputDirective,    
  ],
  imports: [
    CommonModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class FocusInvalidInputModule { }
