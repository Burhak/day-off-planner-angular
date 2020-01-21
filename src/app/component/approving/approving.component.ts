import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequestWithApprovalsApiModel, LeaveService, LeaveTypeApiModel, LeaveTypeService, UserApiModel, UserService, LeaveRequestApiModel } from 'src/app/api';
import { UserInfoService } from 'src/app/service/user-info.service';

@Component({
  selector: 'app-approving',
  templateUrl: './approving.component.html',
  styleUrls: ['./approving.component.scss']
})
export class ApprovingComponent implements OnInit {

  private leaveRequestId: string;

  public loggedUser: UserApiModel;
  public leaveRequest: LeaveRequestWithApprovalsApiModel;
  public leaveType: LeaveTypeApiModel;
  public user: UserApiModel;
  public supervisor: UserApiModel;
  public approvers: UserApiModel[];
  public approversCache = {};
  public approvalsCache = {};

  public typedMessage = '';

  public loaded = false;
  public sending = false;

  public readonly PENDING = LeaveRequestApiModel.StatusEnum.PENDING;

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

  private async loadData() {
    this.leaveRequest = await this.leaveApi.getLeaveRequestByIdWithApprovals(this.leaveRequestId).toPromise();
    this.leaveType = await this.leaveTypeApi.getLeaveTypeById(this.leaveRequest.leaveRequest.leaveType).toPromise();

    this.user = await this.userApi.getUserById(this.leaveRequest.leaveRequest.user).toPromise();

    this.approvers = await Promise.all(this.leaveRequest.approvals.map(a => this.userApi.getUserById(a.approver).toPromise()));

    this.cacheApprovers();
    this.cacheApprovals();

    this.supervisor = this.approvers.find(a => a.id === this.user.supervisor);
    this.approvers = this.approvers.filter(a => a.id !== this.user.supervisor);

    this.loggedUser = await this.userService.currentUserPromise;
  }

  private cacheApprovers() {
    for (const approver of this.approvers) {
      this.approversCache[approver.id] = approver;
    }
  }

  private cacheApprovals() {
    for (const approval of this.leaveRequest.approvals) {
      this.approvalsCache[approval.approver] = approval;
    }
  }

  sendMessage() {
    if (this.typedMessage.trim().length === 0) {
      return;
    }

    this.sending = true;
    this.leaveApi.addMessage({message: this.typedMessage}, this.leaveRequestId).subscribe(response => {
      this.leaveRequest = response;
      this.cacheApprovals();
      this.typedMessage = '';
      this.sending = false;
    });
  }

  approve(approval: boolean) {
    this.leaveApi.approveLeaveRequest(this.leaveRequestId, approval).subscribe(response => {
      this.leaveRequest = response;
      this.cacheApprovals();
    });
  }

  forceApprove(approval: boolean) {
    this.leaveApi.forceApproveLeaveRequest(this.leaveRequestId, approval).subscribe(response => {
      this.leaveRequest = response;
      this.cacheApprovals();
    });
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
