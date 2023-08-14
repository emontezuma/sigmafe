import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  exports: [
    MatGridListModule,
    MatSidenavModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ScrollingModule,
    MatExpansionModule,
    CdkAccordionModule,
    MatMenuModule,
    MatChipsModule,
  ]
})

export class MaterialModule { }
