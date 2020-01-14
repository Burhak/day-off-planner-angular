import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get isLoggedIn(): boolean {
    return this.getAccessToken() !== null;
  }

  constructor(private cookieService: CookieService) { }

  saveToken(token: string, expireDate: Date) {
    this.cookieService.set('token', token, expireDate);
  }

  removeToken() {
    this.cookieService.delete('token');
  }

  getAccessToken(): string {
    if (this.cookieService.check('token')) {
      return this.cookieService.get('token');
    } else {
      return null;
    }
  }
}
