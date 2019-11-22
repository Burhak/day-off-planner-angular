import { Component, OnInit, ViewChild } from '@angular/core';
import { LeaveTypeApiModel, LeaveTypeService, UserService, LimitApiModel, CarryoverApiModel, UserApiModel, RequestedHoursApiModel } from '../../api';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserInfoService } from '../../service/user-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public displayedColumns: string[] = ['leaveType.name', 'leaveType.approvalNeeded', 'limit', 'carryover', 'requestedHours'];
  public dataSource: MatTableDataSource<UserPersonalLeaveTypes>;
  public isDataLoaded: boolean;
  private userPromise: Promise<UserApiModel>;
  private user: UserApiModel;
  private userPersonalLeaveTypes: Array<UserPersonalLeaveTypes> = []; 

  constructor(private leaveType: LeaveTypeService, private userApi: UserService, private userService: UserInfoService) {
  }

  ngOnInit() {
    this.isDataLoaded = false;
    this.getDataAllLeaveTypes();
    this.userPromise = this.userService.currentUserPromise;
  }

  getDataAllLeaveTypes() {
    this.leaveType.getAllLeaveTypes().subscribe((leaveType: LeaveTypeApiModel[]) => {
      leaveType.forEach((element) => {
        let obj: UserPersonalLeaveTypes = {
          leaveType: element,
          limit: -1,
          carryover: -1,
          requestedHours: -1
        };
        this.userPersonalLeaveTypes.push(obj);
      });
      this.getUserLimits();
      this.getRequestedHours();
    });
  }

  fillData() {
    this.dataSource = new MatTableDataSource<UserPersonalLeaveTypes>(this.userPersonalLeaveTypes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o, i) => o[i], item)
      return item[property];
    };
    this.dataSource.sort = this.sort;
    this.isDataLoaded = true;
  }

  async getUserLimits() {

    this.user = await this.userPromise;

    //many subscribtions to fill personal limits and carryovers by one at a time
    this.userPersonalLeaveTypes.forEach((element, index) => {
      this.userApi.getLimit(this.user.id, element.leaveType.id).subscribe(
        (leaveLimit: LimitApiModel) => {
          if (leaveLimit != null) this.userPersonalLeaveTypes[index].limit = leaveLimit.limit;
          else this.userPersonalLeaveTypes[index].limit = this.userPersonalLeaveTypes[index].leaveType.limit;
          this.fillData();
        }
      );
      this.userApi.getCarryover(this.user.id, element.leaveType.id).subscribe(
        (leaveCarryOver: CarryoverApiModel) => {
          if (leaveCarryOver != null) this.userPersonalLeaveTypes[index].carryover = leaveCarryOver.carryover;
          else this.userPersonalLeaveTypes[index].carryover = this.userPersonalLeaveTypes[index].leaveType.carryover;
          this.fillData();
        }
      );
    });
  }

  async getRequestedHours() {
    this.user = await this.userPromise;

    this.userPersonalLeaveTypes.forEach( (element, index) => {
      this.userApi.getRequestedHours(this.user.id, element.leaveType.id).subscribe(
        (rH: RequestedHoursApiModel) => {
          this.userPersonalLeaveTypes[index].requestedHours = rH.requestedHours;
          this.fillData();
        }
      );
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    console.log(this.dataSource.filter);
  }
}

interface UserPersonalLeaveTypes {
  leaveType: LeaveTypeApiModel,
  limit: number,
  carryover: number,
  requestedHours: number
}
