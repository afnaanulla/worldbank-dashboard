import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service'; // Make sure this is imported
import { CookieService } from 'ngx-cookie-service'; // Import CookieService

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  // Form fields
  username = '';
  email = '';
  password = '';
  // UI state
  error = '';
  isLoading = false;
  passwordVisible = false;
  csrfLoaded = false;
  // Form validation
  formErrors = {
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private auth: AuthService, // Inject AuthService
    private cookieService: CookieService // Inject CookieService
  ) {
    // Get CSRF token when component loads
    this.auth.csrf().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.csrfLoaded = true;
        console.log("CSRF cookie set for registration");
      },
      error: (err) => {
        this.error = "Failed to get CSRF token";
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  validateField(field: string): void {
    switch (field) {
      case 'username':
        if (!this.username) {
          this.formErrors.username = 'Username is required';
        } else if (this.username.length < 3) {
          this.formErrors.username = 'Username must be at least 3 characters';
        } else {
          this.formErrors.username = '';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email) {
          this.formErrors.email = 'Email is required';
        } else if (!emailRegex.test(this.email)) {
          this.formErrors.email = 'Please enter a valid email address';
        } else {
          this.formErrors.email = '';
        }
        break;
      case 'password':
        if (!this.password) {
          this.formErrors.password = 'Password is required';
        } else if (this.password.length < 8) {
          this.formErrors.password = 'Password must be at least 8 characters';
        } else {
          this.formErrors.password = '';
        }
        break;
    }
  }

  isFormValid(): boolean {
    return !!(this.username && this.email && this.password &&
             !this.formErrors.username && !this.formErrors.email && !this.formErrors.password);
  }

  submit(): void {
    if (!this.isFormValid() || this.isLoading || !this.csrfLoaded) return;

    // Check if we have a CSRF token
    const token = this.cookieService.get('csrftoken');
    if (!token) {
      this.error = "CSRF token missing. Please refresh the page.";
      return;
    }

    this.isLoading = true;
    this.error = '';

    // Use AuthService to register
    this.auth.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err?.error?.detail ?? 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
