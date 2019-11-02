import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService, UserApiModel, UserService } from '../../api';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private userService: UserService, private adminService: AdminService, private router: Router) {
    this.getDataAllUser();
  }

  private array: Array<UserApiModel> = [];
  public displayedColumns: string[] = ['firstName', 'lastName', 'email', 'jobDescription', 'info'];
  public dataSource: MatTableDataSource<UserApiModel>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit() {

  }

  getDataAllUser() {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      this.array = user;
      this.fillData();
    });
  }

  fillData() {
    this.dataSource = new MatTableDataSource<UserApiModel>(this.array);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openUserProfile(user) {
    this.router.navigate(['userProfile'], { state: { userId: user.id } });
  }

}
