import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrftoken = this.cookieService.get('csrftoken');
    const withCreds = req.clone({ withCredentials: true });

    if (csrftoken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next.handle(
        withCreds.clone({ setHeaders: { 'X-CSRFToken': csrftoken } })
      );
    }

    return next.handle(withCreds);
  }
}
