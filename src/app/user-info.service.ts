import { Injectable } from '@angular/core';
import { UserService, UserApiModel } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private user: Observable<UserApiModel> = null;

  constructor(private userService: UserService) { }

  get currentUser() {
    if (this.user === null) {
      this.user = this.userService.getLoggedUser();
    }
    return this.user;
  }

  removeCurrentUser() {
    this.user = null;
  }
}
