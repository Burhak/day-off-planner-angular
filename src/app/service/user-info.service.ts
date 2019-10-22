import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService, UserApiModel } from '../api';

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

  saveToken(token: string, expireDate: Date) {
    this.authService.saveToken(token, expireDate);
  }

  removeToken() {
    this.authService.removeToken();
  }

  get hasAdminPrivileges() {
    if (this.user)  {
      return this.user.admin;
    }
  }
}
