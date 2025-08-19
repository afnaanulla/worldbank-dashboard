import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate() {
    return this.auth.me().pipe(
      map(res => {
        if (res?.authenticated) return true;
        this.router.navigate(['/login']);
        return false;
      }),
      catchError(() => { this.router.navigate(['/login']); return of(false); })
    );
  }
}
