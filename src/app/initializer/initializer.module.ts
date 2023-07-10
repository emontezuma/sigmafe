import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ConfigService } from './config.service';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: ConfigService) => {
        return () => {
          return config.setSettings();
        }
      },
      deps: [ConfigService]
    }
  ]
})
export class InitializerModule { }