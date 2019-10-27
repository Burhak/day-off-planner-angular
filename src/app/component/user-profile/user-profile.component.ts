import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {UserApiModel, UserService} from '../../api';
import {UserInfoService} from '../../service/user-info.service';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  private userSupervisor: UserApiModel;

  constructor(private userInfoService: UserInfoService, private userService: UserService, private router: Router) {
    if (this.userInfoService.currentUser) {
      if  (this.userInfoService.currentUser.supervisor) {
        this.userService.getUserById(this.userInfoService.currentUser.supervisor).subscribe((user: UserApiModel) => {
          this.userSupervisor = user;
        });
      }
    }
  }

  ngOnInit() {
    console.log(this.array);
  }

}
