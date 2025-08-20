import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CookieService } from 'ngx-cookie-service';

@Component({
  standalone: true,
  selector: "app-login",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  error = "";
  csrfLoaded = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    // Get CSRF cookie once when component loads
    this.auth.csrf().subscribe({
      next: () => {
        this.csrfLoaded = true;
        console.log("CSRF cookie set");
      },
      error: (err) => {
        this.error = "Failed to get CSRF token";
        console.error(err);
      },
    });
  }

  submit() {
    if (!this.csrfLoaded) {
      this.error = "CSRF token not loaded yet. Please try again.";
      return;
    }

    // Check if we have a CSRF token
    const token = this.cookieService.get('csrftoken');
    if (!token) {
      this.error = "CSRF token missing. Please refresh the page.";
      return;
    }

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login successful, navigating to dashboard');
        // Just navigate to dashboard without checking user session
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.error = err?.error?.detail ?? "Login failed";
      },
    });
  }
}
