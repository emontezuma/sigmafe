import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, retry, tap, throwError } from 'rxjs';
import { SharedService } from './shared/services';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(
    private _sharedService: SharedService,    
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    let handled: boolean = false;
    const authToken = 'SAMPLE';
    const authReq = request.clone({
      headers: request.headers.set('x-customer-id', '1')
      .set('x-language-id', '1')
      .set('x-time-zone', '-6')
      .set('x-token', authToken)
    });  

    return next.handle(authReq).pipe(      
      retry(2),
      catchError((error: HttpErrorResponse) => {
        // TODO: Add error handling logic here
        let message = error.message;
        if (error.error?.errors?.length > 0) {
          message = error.error.errors[0].message;
        }        
        this._sharedService.showSnackMessage({
          message,      
          duration: 0,
          snackClass: 'snack-warn',
          icon: 'disconnect',
          buttonText: '',
          buttonIcon: '',
        });      
        return throwError(error);
      }),
    )
  }
}
