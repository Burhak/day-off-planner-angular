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

  public userSupervisor: UserApiModel;

  constructor(public userInfoService: UserInfoService, private userService: UserService, private router: Router) {

    if (this.userInfoService.currentUser) {
      if (this.userInfoService.currentUser.supervisor) {
        this.userService.getUserById(this.userInfoService.currentUser.supervisor).subscribe((supervisor: UserApiModel) => {
          this.userSupervisor = supervisor;
        });
      }
    }
  }

  ngOnInit() {

  }

}
