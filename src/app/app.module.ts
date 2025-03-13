import { NgModule, isDevMode } from '@angular/core';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
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
import { MoldsHitsEffects, MoldsEffects, MoldEffects, SettingsEffects, ProfileEffects, ColorsEffects, ChecklistFillingEffects } from './state/effects';
import { ImageNotFoundModule, OptionsScrollModule  } from './shared/directives';
import { SnackComponent, SpinnerModule, GenericDialogModule, TranslationsDialogComponent, InputFieldModule, AreaFieldModule, SelectFieldModule, MultipleSelectionListModule, MaintenanceHistoryDialogComponent, AutoCompleteFieldModule, SearchBoxModule, ToolbarModule, ButtonMenuModule } from './shared/components';
import { GraphQLModule } from './graphql.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './shared/services';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { InterceptorInterceptor } from './interceptor.interceptor';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';

LOAD_WASM('assets/wasm/ngx-scanner-qrcode.wasm').subscribe();

@NgModule({  
  declarations: [
    AppComponent,
    NotFoundComponent,            
    TranslationsDialogComponent,
    SnackComponent,
    MaintenanceHistoryDialogComponent,
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
    EffectsModule.forRoot([MoldsHitsEffects, SettingsEffects, ProfileEffects, ColorsEffects, ChecklistFillingEffects, MoldsEffects, MoldEffects ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), autoPause: true }),
    SpinnerModule,    
    ToolbarModule,        
    SearchBoxModule,
    ButtonMenuModule,
    GraphQLModule,
    InputFieldModule,
    AreaFieldModule,
    SelectFieldModule,
    MultipleSelectionListModule,
    AutoCompleteFieldModule,
    GenericDialogModule,
    NgxScannerQrcodeModule,
  ],
  providers: [
    DatePipe,
    { provide: MatPaginatorIntl, useClass: CustomPaginator},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "fill" }},
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
