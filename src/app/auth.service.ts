import { Injectable } from '@angular/core';
import { UserApiModel } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Beta verzia :D

  private loggedInStatus: boolean = false;

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }

  get isLoggedIn() {
    return this.loggedInStatus;
  }

  constructor() { }

  saveLoginSession(token: string, user: UserApiModel) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  removeLoginSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // redirect perhaps
  }

  getAccessToken(): string {
    // TODO: get token from session storage
    // return 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NzA2Mzk5NjYsImV4cCI6MTU3MDcyNjM2Niwicm9sZXMiOlsiQURNSU4iXX0.yOoCBDSPti7qekceBX_kwAR9ougQ_xH-E1STSr72obhSuEF4cxg9e0zNa6YUynahYjMhWlwCODq3M2gRLKk-vQ'
    return localStorage.getItem('token');
  }
}
