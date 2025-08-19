import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;
  user: { username: string; email: string } | null = null;

  constructor(private http: HttpClient) {}

  csrf() {
    return this.http.get(`${this.base}/auth/csrf/`, { withCredentials: true });
  }

  register(dto: { username: string; password: string; email?: string }) {
    return this.http.post(`${this.base}/auth/register/`, dto, { withCredentials: true });
  }

  login(dto: { username: string; password: string }) {
    return this.http.post<{username:string;email:string}>(`${this.base}/auth/login/`, dto, { withCredentials: true });
  }

  logout() {
    return this.http.post(`${this.base}/auth/logout/`, {}, { withCredentials: true });
  }

  me() {
    return this.http.get<{authenticated:boolean;username:string;email:string}>(`${this.base}/auth/user/`, { withCredentials: true });
  }
}
