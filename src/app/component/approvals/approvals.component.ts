import { Component, OnInit } from '@angular/core';
import { LeaveService, UserService, LeaveRequestApiModel, LeaveTypeService } from 'src/app/api';
import { UserInfoService } from 'src/app/service/user-info.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {

  public leaveRequests: Array<LeaveRequestApiModel> = [];
  public userCache = {};
  public leaveTypesCache = {};

  constructor(
      private leaveApi: LeaveService,
      private userApi: UserService,
      private leaveTypeApi: LeaveTypeService,
      private userService: UserInfoService,
      private router: Router
  ) {
    this.leaveTypeApi.getAllLeaveTypes().subscribe(response => {
      for (let leaveType of response) {
        this.leaveTypesCache[leaveType.id] = leaveType;
      }
    });

    this.userService.currentUserPromise.then(user => {
      this.leaveApi
        .filterLeaveRequests(null, null, [LeaveRequestApiModel.StatusEnum.PENDING], null, null, [user.id])
        .subscribe(response => {
          this.leaveRequests = response;
          for (let leave of this.leaveRequests) {
            if (!this.userCache[leave.user]) {
              this.userApi.getUserById(leave.user).subscribe(user => {
                this.userCache[user.id] = user;
              });
            }
          }
        });
    });
  }

  openApproval(leave: LeaveRequestApiModel) {
    this.router.navigate(['approve'], { state: { leaveRequestId: leave.id } });
  }

  ngOnInit() {
  }

}
