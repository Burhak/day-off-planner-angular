import { Injectable } from '@angular/core';
import { UserApiModel } from './api';
import { UserService } from './api';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  public name: string = 'Initial';

  constructor(private userService: UserService) { }

  updateUserInfo() {

    this.userService.getLoggedUser().subscribe(
      response => {
        this.name = response.firstName;
      },
      error => {
        console.log(error);
        this.name = 'Can\'t get name';
      }
    );
  }
}
