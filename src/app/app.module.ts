import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgOptimizedImage } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from './material/material.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from '../app/state/app.state';
import { MoldsEffects } from '../app/state/effects/molds.effects';
import { SettingsEffects } from '../app/state/effects/settings.effects';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SearchBoxComponent } from './shared/components/search-box/search-box.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { ProfileEffects } from './state/effects/profile.effects';
import { InitializerModule } from './initializer/initializer.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    SearchBoxComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgOptimizedImage,
    MaterialModule,
    InitializerModule,
    NgxSkeletonLoaderModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([MoldsEffects, SettingsEffects, ProfileEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), autoPause: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
