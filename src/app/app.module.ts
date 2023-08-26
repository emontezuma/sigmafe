import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgOptimizedImage } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from './material/material.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InitializerModule } from './initializer/initializer.module';
import { IconsModule } from './shared/icons/icons.module';
import { SearchBoxComponent } from './shared/components/search-box/search-box.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { reducers } from '../app/state/app.state';
import { MoldsEffects } from '../app/state/effects/molds.effects';
import { SettingsEffects } from '../app/state/effects/settings.effects';
import { ProfileEffects } from './state/effects/profile.effects';
import { ColorsEffects } from './state/effects/colors.effects';
import { ChecklistFillingEffects } from './state/effects/checklists.effects';
import { GenericDialogComponent } from './shared/components/generic-dialog/generic-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    SearchBoxComponent,
    ToolbarComponent,
    GenericDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgOptimizedImage,
    MaterialModule,
    InitializerModule,
    IconsModule,
    NgxSkeletonLoaderModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([MoldsEffects, SettingsEffects, ProfileEffects, ColorsEffects, ChecklistFillingEffects ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), autoPause: true })
  ],
  providers: [],  
  bootstrap: [AppComponent]
})
export class AppModule { }
