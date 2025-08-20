import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;
  private csrfToken: string | null = null;

  user: { username: string; email: string } | null = null;

  constructor(private http: HttpClient) {}

  // Get CSRF token and store it
  csrf(): Observable<any> {
    return this.http
      .get<any>(`${this.base}/auth/csrf/`, {
        withCredentials: true,
        observe: 'response'
      })
      .pipe(
        tap((response: any) => {
          console.log('CSRF response:', response);
          // Extract CSRF token from response or cookie
          const body = response.body || response;
          this.csrfToken = body.csrfToken || this.getCookie('csrftoken');
          console.log('CSRF token set:', this.csrfToken);
        }),
        catchError(this.handleError)
      );
  }

  private get headers(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const token = this.csrfToken || this.getCookie('csrftoken');
    if (token) {
      headers = headers.set('X-CSRFToken', token);
    }

    console.log('Request headers:', headers.keys());
    return headers;
  }

  register(dto: { username: string; password: string; email?: string }): Observable<any> {
    return this.http.post(
      `${this.base}/auth/register/`,
      dto,
      {
        headers: this.headers,
        withCredentials: true
      }
    ).pipe(
      tap(response => console.log('Register response:', response)),
      catchError(this.handleError)
    );
  }

  login(dto: { username: string; password: string }): Observable<{username: string; email: string}> {
    const token = this.getCookie('csrftoken');
    console.log('Login attempt with CSRF token:', token);

    return this.http.post<{username: string; email: string}>(
      `${this.base}/auth/login/`,
      dto,
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-CSRFToken': token || ''
        })
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
        headers: this.headers,
        withCredentials: true
      }
    ).pipe(
      tap(() => {
        this.user = null;
        this.csrfToken = null;
      }),
      catchError(this.handleError)
    );
  }

  me(): Observable<{ authenticated: boolean; username: string; email: string }> {
    return this.http.get<{ authenticated: boolean; username: string; email: string }>(
      `${this.base}/auth/user/`,
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
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

  // Helper to read CSRF cookie
  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      console.log(`Cookie ${name} found:`, match[2]);
      return match[2];
    }
    console.log(`Cookie ${name} not found`);
    return null;
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
