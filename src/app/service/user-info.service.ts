import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService, UserApiModel } from '../api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private user: UserApiModel;
  private userPromise: Promise<UserApiModel>;

  constructor(private authService: AuthService, private userService: UserService) {
    if (this.authService.isLoggedIn) {
      this.userPromise = this.userService.getLoggedUser().toPromise();
      this.userPromise.then(user => this.user = user);
    }
  }

  get currentUser(): UserApiModel {
    return this.user;
  }

  get currentUserPromise(): Promise<UserApiModel> {
    return this.userPromise;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  saveUser(user: UserApiModel) {
    this.user = user;
    this.userPromise = new Promise<UserApiModel>((resolve, _) => resolve(user));
  }

  removeUser() {
    this.user = null;
    this.userPromise = null;
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
