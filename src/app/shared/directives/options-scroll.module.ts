import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsScrollDirective } from './options-scroll.directive';

@NgModule({
  declarations: [
    OptionsScrollDirective,    
  ],
  exports: [
    OptionsScrollDirective,    
  ],
  imports: [
    CommonModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class OptionsScrollModule { }
