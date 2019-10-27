import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get isLoggedIn(): boolean {
    //console.log(this.getAccessToken());
    return this.getAccessToken() !== null;
  }

  constructor(private cookieService: CookieService) { }

  saveToken(token: string, expireDate: Date) {
    this.cookieService.set('token', token, expireDate);
  }

  /*
  saveToken(token: string) {
    //localStorage.setItem('token', token);
  }
  */

  removeToken() {
    //localStorage.removeItem('token');
    this.cookieService.delete('token');
  }

  getAccessToken(): string {
    //return localStorage.getItem('token');
    if (this.cookieService.check('token')) {
      return this.cookieService.get('token');
    } else {
      return null;
    }
  }
}
