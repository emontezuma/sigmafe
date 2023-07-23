import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent} from './spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    SpinnerComponent,    
  ],
  exports: [
    SpinnerComponent,    
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,  
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class SpinnerModule { }
