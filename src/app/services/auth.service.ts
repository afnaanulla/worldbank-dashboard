import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;
  private csrfToken: string | null = null;

  user: { username: string; email: string } | null = null;

  constructor(private http: HttpClient) {}

  // Get CSRF token and store it
  csrf() {
    return this.http
      .get<{ csrfToken: string }>(`${this.base}/auth/csrf/`, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          // Django sets csrftoken cookie, but we also keep it here
          this.csrfToken = res.csrfToken || this.getCookie('csrftoken');
        })
      );
  }

  private get headers(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.csrfToken) {
      headers = headers.set('X-CSRFToken', this.csrfToken);
    }
    return headers;
  }

  register(dto: { username: string; password: string; email?: string }) {
    return this.http.post(
      `${this.base}/auth/register/`,
      dto,
      { headers: this.headers, withCredentials: true }
    );
  }

  login(dto: { username: string; password: string }) {
    return this.http.post<{ username: string; email: string }>(
      `${this.base}/auth/login/`,
      dto,
      { headers: this.headers, withCredentials: true }
    );
  }

  logout() {
    return this.http.post(
      `${this.base}/auth/logout/`,
      {},
      { headers: this.headers, withCredentials: true }
    );
  }

  me() {
    return this.http.get<{ authenticated: boolean; username: string; email: string }>(
      `${this.base}/auth/user/`,
      { withCredentials: true }
    );
  }

  // Helper to read CSRF cookie (in case Django only sets it as cookie)
  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
  }
}
