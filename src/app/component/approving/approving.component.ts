import { LeaveTypeService } from './../../api/api/leaveType.service';
import { LeaveTypeApiModel } from './../../api/model/leaveTypeApiModel';
import { UserInfoService } from './../../service/user-info.service';
import { UserService } from './../../api/api/user.service';
import { UserApiModel } from './../../api/model/userApiModel';
import { LeaveRequestWithApprovalsApiModel } from './../../api/model/leaveRequestWithApprovalsApiModel';
import { LeaveService } from './../../api/api/leave.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approving',
  templateUrl: './approving.component.html',
  styleUrls: ['./approving.component.scss']
})
export class ApprovingComponent implements OnInit {

  private leaveRequestId: string;

  public loggedUserIsSupervisor = false;
  public leaveRequest: LeaveRequestWithApprovalsApiModel;
  public leaveType: LeaveTypeApiModel;
  public user: UserApiModel;
  public approversCache = {};

  public loaded = false;

  constructor(
      private router: Router,
      private leaveApi: LeaveService,
      private userApi: UserService,
      private userService: UserInfoService,
      private leaveTypeApi: LeaveTypeService
  ) {
    if (this.router.getCurrentNavigation().extras.state != null) {
      this.leaveRequestId = this.router.getCurrentNavigation().extras.state.leaveRequestId;
      localStorage.setItem('leaveRequestId', this.leaveRequestId);
    } else {
      this.leaveRequestId = localStorage.getItem('leaveRequestId');
    }

    this.loadData().then(() => this.loaded = true);
  }

  async loadData() {
    this.leaveRequest = await this.leaveApi.getLeaveRequestByIdWithApprovals(this.leaveRequestId).toPromise();
    this.leaveType = await this.leaveTypeApi.getLeaveTypeById(this.leaveRequest.leaveRequest.leaveType).toPromise();

    const approvers = await Promise.all(this.leaveRequest.approvals.map(a => this.userApi.getUserById(a.approver).toPromise()));
    for (const approver of approvers) {
      this.approversCache[approver.id] = approver;
    }

    this.user = await this.userApi.getUserById(this.leaveRequest.leaveRequest.user).toPromise();
    this.loggedUserIsSupervisor = (await this.userService.currentUserPromise).id === this.user.supervisor;
  }

  get startDate(): Date {
    return this.leaveRequest.leaveRequest.fromDate;
  }

  get endDate(): Date {
    return this.leaveRequest.leaveRequest.toDate;
  }

  ngOnInit() {
  }

}
