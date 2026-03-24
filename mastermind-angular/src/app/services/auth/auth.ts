import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080';

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/auth/login`, { username, password })
      .pipe(tap((res) => {
        localStorage.setItem('token', res.token);
      }));
  }

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.baseUrl}/auth/register`, { username, email, password });
  }

  getTokenPayload(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  }

  getUsername(): string {
    return this.getTokenPayload()?.sub ?? '';
  }

  getMe() {
  return this.http.get<{ id: number; username: string; email: string; bestScore: number }>
    (`${this.baseUrl}/auth/me`);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
