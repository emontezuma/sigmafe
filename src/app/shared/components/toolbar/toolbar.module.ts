import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { SearchBoxModule } from '../search-box';
import { SpinnerModule } from '../spinner';
import { ButtonMenuModule } from '../button-menu';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ToolbarComponent,    
  ],
  exports: [
    ToolbarComponent,    
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SearchBoxModule,
    SpinnerModule,  
    ButtonMenuModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class ToolbarModule { }
