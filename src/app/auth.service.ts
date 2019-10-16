import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get isLoggedIn(): boolean {
    console.log(this.getAccessToken());
    return this.getAccessToken() !== null;
  }

  constructor() { }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getAccessToken(): string {
    return localStorage.getItem('token');
  }
}
