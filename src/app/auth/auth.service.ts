import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, tap, throwError} from 'rxjs';
import { TokenResponse } from './auth.interface';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  BASE_URL = 'https://icherniakov.ru/yt-course/auth/';
  cookieService: CookieService = inject(CookieService)
  router = inject(Router)

  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token')
      this.refreshToken = this.cookieService.get('refreshToken')
    }
    return !!this.token;
  }

  login(payload: { username: string; password: string }) {
    const form_data = new FormData();
    form_data.append('username', payload.username);
    form_data.append('password', payload.password);

    return this.http.post<TokenResponse>(`${this.BASE_URL}token`, form_data).pipe(
      tap(val => this.saveTokens(val))
    );
  }

  refreshAuthToken() {
    return this.http.post<TokenResponse>(`${this.BASE_URL}refresh`, {
      refresh_token: this.refreshToken
    }).pipe(
      tap(val => this.saveTokens(val)),

      catchError(err => {
        this.logout()
        return throwError(err)
      })
    )
  }

  logout() {
    this.cookieService.deleteAll()
    this.token = null
    this.refreshToken = null
    this.router.navigate(['/login'])
  }

  saveTokens(res: TokenResponse) {
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;

    this.cookieService.set('token', this.token)
    this.cookieService.set('refreshToken', this.refreshToken)
  }

}
