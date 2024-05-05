import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageNotFoundDirective } from './image-not-found.directive';

@NgModule({
  declarations: [
    ImageNotFoundDirective,
  ],
  exports: [
    ImageNotFoundDirective,    
  ],
  imports: [
    CommonModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class ImageNotFoundModule { }
