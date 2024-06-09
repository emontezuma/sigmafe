import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelEllipsisComponent } from './label-ellipsis.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    LabelEllipsisComponent,    
  ],
  exports: [
    LabelEllipsisComponent,    
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class LabelEllipsisModule { }
