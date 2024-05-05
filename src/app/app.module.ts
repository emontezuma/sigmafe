import { NgModule, isDevMode } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgOptimizedImage } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from './material';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InitializerModule } from './initializer/initializer.module';
import { IconsModule } from './shared/icons';
import { NotFoundComponent } from './shared/pages';
import { reducers } from '../app/state/app.state';
import { MoldsHitsEffects, MoldsEffects, SettingsEffects, ProfileEffects, ColorsEffects, ChecklistFillingEffects } from './state/effects';
import { ImageNotFoundModule, OptionsScrollModule } from './shared/directives';
import { SnackComponent, SpinnerModule, GenericDialogComponent, ToolbarComponent, SearchBoxComponent, ButtonMenuComponent, } from './shared/components';
import { GraphQLModule } from './graphql.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './shared/services';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    SearchBoxComponent,
    ToolbarComponent,
    GenericDialogComponent,
    SnackComponent,
    ButtonMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ImageNotFoundModule,
    OptionsScrollModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgOptimizedImage,
    MaterialModule,
    InitializerModule,
    IconsModule,
    NgxSkeletonLoaderModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([MoldsHitsEffects, SettingsEffects, ProfileEffects, ColorsEffects, ChecklistFillingEffects, MoldsEffects ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), autoPause: true }),
    SpinnerModule,
    GraphQLModule,    
  ],
  providers: [
    DatePipe,
    { provide: MatPaginatorIntl, useClass: CustomPaginator},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "fill" }},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
