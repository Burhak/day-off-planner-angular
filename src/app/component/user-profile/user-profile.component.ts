import { Component, OnInit } from '@angular/core';
import {UserApiModel, UserService} from '../../api';
import {UserInfoService} from '../../service/user-info.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  private array: Array<UserApiModel> = [];

  constructor(private userInfoService: UserInfoService, private userService: UserService) {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      this.array = user;
    });
  }

  ngOnInit() {
    console.log(this.array);
  }

}
