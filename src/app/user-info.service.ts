import { Injectable } from '@angular/core';
import { UserService, UserApiModel } from './api';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private user: UserApiModel;

  constructor(private authService: AuthService, private userService: UserService) {
    if (this.authService.isLoggedIn) {
      this.userService.getLoggedUser().subscribe(user => this.user = user);
    }
  }

  get currentUser(): UserApiModel {
    return this.user;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  saveUser(user: UserApiModel) {
    this.user = user;
  }

  removeUser() {
    this.user = null;
  }

  saveToken(token: string) {
    this.authService.saveToken(token);
  }

  removeToken() {
    this.authService.removeToken();
  }
}
