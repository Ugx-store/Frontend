import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const httpRequest = req.clone({
        headers: req.headers
          .set('Cache-Control', 'no-cache no-store, must-revalidate, post-check=0, pre-check=0')
          .set('Pragma', 'no-cache')
          .set('Expires', '0')
      })

      return next.handle(httpRequest)
  }
}
