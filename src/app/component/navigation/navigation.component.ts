import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/service/user-info.service';
import { AuthService, LeaveService, LeaveRequestApiModel } from '../../api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  public pendingRequestsToApprove = 0;

  constructor(
      private leaveApi: LeaveService,
      private authService: AuthService,
      private router: Router,
      public userService: UserInfoService
  ) {
    if (this.userService.currentUserPromise) {
      this.userService.currentUserPromise.then(user => {
        this.leaveApi
          .countLeaveRequests(null, null, [LeaveRequestApiModel.StatusEnum.PENDING], null, null, [user.id])
          .subscribe(response => this.pendingRequestsToApprove = response);
      });
    }
  }


  ngOnInit() {

  }

  logOut() {
    this.authService.logoutUser().subscribe(
      response => {
        this.userService.logout(() => this.router.navigate(['login']));
      }, error => {
        throw error;
      }
    );
  }

  openUserProfile() {
    this.router.navigate(['userProfile']);
  }

}
