import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  standalone: true,
  selector: "app-login",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  username = ""
  password = ""
  error = ""

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this.auth.csrf().subscribe()
  }

  submit() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(["/dashboard"]),
      error: (err) => (this.error = err?.error?.detail ?? "Login failed"),
    })
  }
}
