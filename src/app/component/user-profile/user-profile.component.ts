import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
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
  public editingUser: boolean = false;
  public isLoaded: boolean;

  constructor(public userInfoService: UserInfoService, private userService: UserService, private activatedRoute: ActivatedRoute, private  adminService: AdminService, public dialog: MatDialog, private  router: Router) {
    this.isLoaded = false;
    this.deleteBtnDisabled = true;

    let userId;
    if (this.router.getCurrentNavigation().extras.state != null) {
      userId =  this.router.getCurrentNavigation().extras.state.userId;
      localStorage.setItem('userId', userId);
    } else {
      userId = localStorage.getItem('userId');
    }

    this.userService.getUserById(userId).subscribe((user: UserApiModel) => {
      this.user = user;
      this.getUserSupervisor(this.user.supervisor);
      if (this.user.id !== this.userInfoService.currentUser.id) {
        this.deleteBtnDisabled = false;
      }
      this.isLoaded = true;
    });
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
        this.router.navigate(['admin/userList']);
      });
  }

  openEditUser(user) {
    this.editingUser = true;
  }

  receiveMessage($event) {
    this.editingUser = false;
    if ($event == true) {
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
      if (this.user.id !== this.userInfoService.currentUser.id) {
        this.deleteBtnDisabled = false;
      }
    });
  }
}
