import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AdminService, UserApiModel, UserService} from '../../api';
import {UserInfoService} from '../../service/user-info.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private userService: UserService) {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      this.array = user;
      this.fillData();
    });
  }

  private array: Array<UserApiModel> = [];
  private displayedColumns: string[] = ['firstName', 'lastName', 'email', 'admin', 'supervisor'];
  private dataSource: MatTableDataSource<UserApiModel>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  ngOnInit() {

  }

  fillData(){
    this.dataSource = new MatTableDataSource<UserApiModel>(this.array);
    this.dataSource.paginator = this.paginator;
  }
}

