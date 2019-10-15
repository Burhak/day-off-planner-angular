import { Injectable } from '@angular/core';
import { UserService, UserApiModel } from './api';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private user: UserApiModel;

  constructor(private userService: UserService) {
    this.userService.getLoggedUser().subscribe(user => this.user = user)
  }

  get currentUser(): UserApiModel {
    return this.user;
  }

  setUser(user: UserApiModel) {
    this.user = user;
  }

  removeUser() {
    this.user = null;
  }
}
