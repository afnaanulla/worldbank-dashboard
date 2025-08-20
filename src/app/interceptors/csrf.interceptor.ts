import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and add withCredentials
    const withCreds = req.clone({ withCredentials: true });

    // For POST, PUT, PATCH, DELETE requests, add CSRF token
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const csrftoken = this.cookieService.get('csrftoken');
      if (csrftoken) {
        return next.handle(
          withCreds.clone({ setHeaders: { 'X-CSRFToken': csrftoken } })
        );
      }
    }

    return next.handle(withCreds);
  }
}
