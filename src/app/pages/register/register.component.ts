import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Mock AuthService interface for demonstration
interface AuthService {
  csrf(): any;
  register(data: { username: string; email: string; password: string }): any;
}

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

  // Form validation
  formErrors = {
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router
    // private auth: AuthService // Uncomment when service is available
  ) {
    // this.auth.csrf().pipe(takeUntil(this.destroy$)).subscribe();
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

  async submit(): Promise<void> {
    if (!this.isFormValid() || this.isLoading) return;

    this.isLoading = true;
    this.error = '';

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock success - replace with actual auth service call
      // await this.auth.register({
      //   username: this.username,
      //   email: this.email,
      //   password: this.password
      // }).toPromise();

      await this.router.navigate(['/login']);
    } catch (err: any) {
      this.error = err?.error?.detail ?? 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
