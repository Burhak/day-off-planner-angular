import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AdminService, UserApiModel, UserService} from '../../api';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material";
import {DeleteUserDialogComponent} from "./delete-user-dialog/delete-user-dialog.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private userService: UserService, private adminService: AdminService, public dialog: MatDialog) {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      this.array = user;
      this.fillData();
    });
  }

  private array: Array<UserApiModel> = [];
  private displayedColumns: string[] = ['firstName', 'lastName', 'email', 'admin', 'supervisor', 'edit', 'delete'];
  private dataSource: MatTableDataSource<UserApiModel>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngOnInit() {

  }

  fillData() {
    this.dataSource = new MatTableDataSource<UserApiModel>(this.array);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialogDeleteUser(user) {
    let dialogRef = this.dialog.open(DeleteUserDialogComponent, {data: {userName: user.firstName + ' ' +  user.lastName}});
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

