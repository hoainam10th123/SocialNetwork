import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { fromEvent, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { mapTo, retryWhen, switchMap } from 'rxjs/operators';

@Injectable()
export class InternetCheckInterceptor implements HttpInterceptor {
  private onlineChanges$ = fromEvent(window, 'online').pipe(mapTo(true));
  
  get isOnline() {
    return navigator.onLine;
  }
  
  constructor(private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen(errors => {
        if (this.isOnline) {          
          return errors.pipe(switchMap(err => throwError(err)));
        }else{
          this.toastr.warning('Error connect internet')
        }
        return this.onlineChanges$;
      })
    );    
  }
}
