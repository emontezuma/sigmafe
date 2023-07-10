import { APP_INITIALIZER, Inject, NgModule } from '@angular/core';
import { ConfigService } from './config.service';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ [new Inject(ConfigService)] ],
      useFactory: (config: ConfigService) => {
        return () => {
          return config.load().then((loadingResult) => {
            if (!loadingResult) {
              // TODO: Error management;
            }
          });
        }
      },      
    }
  ]
})
export class InitializerModule { }