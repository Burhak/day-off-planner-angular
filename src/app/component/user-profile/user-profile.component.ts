import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AdminService, UserApiModel, UserService} from '../../api';
import {UserInfoService} from '../../service/user-info.service';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {DeleteUserDialogComponent} from "../user-list/delete-user-dialog/delete-user-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  public user: UserApiModel;
  public userSupervisor: UserApiModel;
  public deleteBtnDisabled: boolean;

  constructor(public userInfoService: UserInfoService, private userService: UserService, private activatedRoute: ActivatedRoute, private  adminService: AdminService, public dialog: MatDialog, private  router: Router) {
    this.deleteBtnDisabled = true;

    if (this.router.getCurrentNavigation().extras.state != null) {
      console.log(this.router.getCurrentNavigation().extras.state.userId);
      this.userService.getUserById(this.router.getCurrentNavigation().extras.state.userId).subscribe((user: UserApiModel) => {
        this.user = user;
        this.getUserSupervisor(this.user.supervisor);
        if (this.user.id !== this.userInfoService.currentUser.id) {
          this.deleteBtnDisabled = false;
        }
      });
    } else {
      if (this.userInfoService.currentUser) {
        this.user = this.userInfoService.currentUser;
        this.getUserSupervisor(this.user.supervisor);
      }
    }
  }

  ngOnInit() {

  }


  getUserSupervisor(user) {
    if (user) {
      this.userService.getUserById(user).subscribe((supervisor: UserApiModel) => {
        this.userSupervisor = supervisor;
      });
    }
  }

  openDialogDeleteUser(user) {
    let dialogRef = this.dialog.open(DeleteUserDialogComponent, {data: {userName: user.firstName + ' ' + user.lastName}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'true') {
        this.deleteUser(user);
      }
    });
  }

  deleteUser(user) {
    this.adminService.deleteUser(user.id).subscribe(
      response => {
        console.log(response);
      });
  }

}
