import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'worldbank-dashboard';
  constructor(private http: HttpClient ) {}
  ngOnInit() {
    this.http.get('https://djangoo-1wag.onrender.com/api/auth/csrf/', {
      withCredentials: true
    }).subscribe({
      next: () => console.log('CSRF token fetched Successfully '),
      error: (err) => console.error('CSRF fetch error', err)
    });
  }
}
