import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadonlyFieldComponent } from './readonly-field.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { LabelEllipsisModule } from '../label-ellipsis';

@NgModule({
  declarations: [
    ReadonlyFieldComponent,    
  ],
  exports: [
    ReadonlyFieldComponent,    
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    LabelEllipsisModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class ReadonlyFieldModule { }
