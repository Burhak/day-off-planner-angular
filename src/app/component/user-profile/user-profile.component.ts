import { Component, OnInit } from '@angular/core';
import { AdminService, UserApiModel, UserService } from '../../api';
import { UserInfoService } from '../../service/user-info.service';
import { Router } from '@angular/router';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public user: UserApiModel;
  public userSupervisor: UserApiModel;
  public userApprovers: Array<UserApiModel> = [];
  public deleteBtnDisabled: boolean;
  public editingUser = false;
  public isLoaded: boolean;
  public editingLimits: boolean = false;

  constructor(
      public userInfoService: UserInfoService,
      private userService: UserService,
      private  adminService: AdminService,
      public dialog: MatDialog,
      private  router: Router
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.isLoaded = false;
    this.deleteBtnDisabled = true;

    let userId;
    if (this.router.getCurrentNavigation().extras.state != null) {
      userId = this.router.getCurrentNavigation().extras.state.userId;
      localStorage.setItem('userId', userId);
    } else {
      userId = localStorage.getItem('userId');
    }

    this.userService.getUserById(userId).subscribe((user: UserApiModel) => {
      this.user = user;
      this.getUserSupervisor(user.supervisor);
      this.getUserApprovers(user.approvers);

      if (this.user.id !== this.userInfoService.currentUser.id) {
        this.deleteBtnDisabled = false;
      }
    });
  }

  ngOnInit() {

  }


  getUserSupervisor(userId: string) {
    if (userId) {
      this.userService.getUserById(userId).subscribe((supervisor: UserApiModel) => {
        this.userSupervisor = supervisor;
      });
    }
  }

  getUserApprovers(userApproverIds: Array<string>) {
    this.userApprovers = [];
    for (const approverId of userApproverIds) {
      this.userService.getUserById(approverId).subscribe( (approver: UserApiModel) => {
        this.userApprovers.push(approver);
      });
    }
    this.isLoaded = true;
  }

  openDialogDeleteUser(user: UserApiModel) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {data: {userName: user.firstName + ' ' + user.lastName}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'true') {
        this.deleteUser(user);
      }
    });
  }

  deleteUser(user: UserApiModel) {
    this.adminService.deleteUser(user.id).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['admin/userList']);
      });
  }

  openEditUser() {
    this.editingUser = true;
  }

  openLimitsUser() {
    this.editingLimits = true;
  }

  receiveMessage(event: any) {
    this.editingUser = false;
    this.editingLimits = false;
    if (event === true) {
      this.reloadUser();
    }
  }

  reloadUser() {
    this.userService.getUserById(this.user.id).subscribe((user: UserApiModel) => {
      this.user = user;
      if (this.user.supervisor !== null) {
        this.getUserSupervisor(this.user.supervisor);
      } else {
        this.userSupervisor = null;
      }
      if (this.user.approvers !== null) {
        this.getUserApprovers(this.user.approvers);
      } else {
        this.userApprovers = [];
      }
      if (this.user.id !== this.userInfoService.currentUser.id) {
        this.deleteBtnDisabled = false;
      }
    });
  }
}
