import { Component, OnInit } from '@angular/core';
import { AdminService, UserApiModel, UserService } from '../../api';
import { UserInfoService } from '../../service/user-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public user: UserApiModel;
  public userSupervisor: UserApiModel;
  public userApprovers: Array<UserApiModel> = [];
  public deleteBtnDisabled = true;
  public editingUser = false;
  public isLoaded = false;

  constructor(
      public userInfoService: UserInfoService,
      private userService: UserService,
      private adminService: AdminService,
      private dialog: MatDialog,
      private router: Router,
      private route: ActivatedRoute
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.userInfoService.currentUserPromise.then(currentUser => {
      this.route.paramMap
        .pipe(switchMap(params => this.userService.getUserById(params.has('id') ? params.get('id') : currentUser.id)))
        .subscribe(user => {
          this.user = user;
          this.getUserSupervisor(user.supervisor);
          this.getUserApprovers(user.approvers);

          if (this.user.id !== this.userInfoService.currentUser.id) {
            this.deleteBtnDisabled = false;
          }
          this.isLoaded = true;
        }, error => {
          if (error.status === 404 || error.status === 400) {
            console.error('User was not found');
          } else {
            throw error;
          }
          this.router.navigate(['']);
        });
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
  }

  openDialogDeleteUser(user: UserApiModel) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {data: {userName: user.firstName + ' ' + user.lastName}});
    dialogRef.afterClosed().subscribe(result => {
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

  receiveMessage(event: any) {
    this.editingUser = false;
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
