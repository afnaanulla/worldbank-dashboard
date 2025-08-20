import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;
  user: { username: string; email: string } | null = null;

  constructor(private http: HttpClient) {}

  // Get CSRF token and set the cookie
  csrf(): Observable<any> {
    return this.http
      .get<any>(`${this.base}/auth/csrf/`, {
        withCredentials: true,
        observe: 'response'
      })
      .pipe(
        tap((response: any) => {
          console.log('CSRF response:', response);
          // The server sets the cookie, so we don't need to do anything else here
        }),
        catchError(this.handleError)
      );
  }

  register(dto: { username: string; password: string; email?: string }): Observable<any> {
    return this.http.post(
      `${this.base}/auth/register/`,
      dto,
      {
        withCredentials: true
        // No need to set headers here, the interceptor will handle CSRF
      }
    ).pipe(
      tap(response => console.log('Register response:', response)),
      catchError(this.handleError)
    );
  }

  login(dto: { username: string; password: string }): Observable<{username: string; email: string}> {
    return this.http.post<{username: string; email: string}>(
      `${this.base}/auth/login/`,
      dto,
      {
        withCredentials: true
        // No need to set headers here, the interceptor will handle CSRF
      }
    ).pipe(
      tap(response => {
        console.log('Login response:', response);
        this.user = response;
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.base}/auth/logout/`,
      {},
      {
        withCredentials: true
        // No need to set headers here, the interceptor will handle CSRF
      }
    ).pipe(
      tap(() => {
        this.user = null;
      }),
      catchError(this.handleError)
    );
  }

  me(): Observable<{ authenticated: boolean; username: string; email: string }> {
  return this.http.get<{ authenticated: boolean; username: string; email: string }>(
    `${this.base}/auth/user/`,
    {
      withCredentials: true
    }
  ).pipe(
    tap(response => {
      console.log('User info response:', response);
      if (response.authenticated) {
        this.user = { username: response.username, email: response.email };
      }
    }),
    catchError(this.handleError)
  );
}

  private handleError = (error: HttpErrorResponse) => {
    console.error('HTTP Error:', error);
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.error && error.error.detail) {
        errorMessage = error.error.detail;
      } else {
        errorMessage = `Server error: ${error.status} ${error.statusText}`;
      }
    }
    return throwError(() => ({ error: { detail: errorMessage } }));
  };
}
