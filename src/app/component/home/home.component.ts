import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LeaveTypeApiModel, LeaveTypeService, UserService, LimitApiModel,
  CarryoverApiModel, UserApiModel, RequestedHoursApiModel, LeaveService
} from '../../api';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserInfoService } from '../../service/user-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('TableLeavesPaginator', { static: false }) TableLeavesPaginator: MatPaginator;
  @ViewChild('TableLeavesSort', { static: false }) TableLeavesSort: MatSort;

  @ViewChild('TableTypesPaginator', { static: false }) TableTypesPaginator: MatPaginator;
  @ViewChild('TableTypesSort', { static: false }) TableTypesSort: MatSort;

  public displayedColumns: string[] = ['leaveType.name', 'leaveType.approvalNeeded',
    'limit', 'carryover', 'requestedHours'];
  public dataSourceLeaves: MatTableDataSource<UserPersonalLeaveTypes>;
  public dataSourceTypes: MatTableDataSource<UserPersonalLeaveTypes>;
  public isDataLoaded: boolean;
  private userPromise: Promise<UserApiModel>;
  private user: UserApiModel;
  private userPersonalLeaveTypes: Array<UserPersonalLeaveTypes> = []; 

  constructor(private leaveType: LeaveTypeService, private userApi: UserService,
    private userService: UserInfoService, private leavesApi: LeaveService) {}

  ngOnInit() {
    this.isDataLoaded = false;
    this.userPromise = this.userService.currentUserPromise;
    this.initData();
  }

  async initData() {
    this.user = await this.userPromise;

    this.getAllMyLeaves();
    this.getDataAllLeaveTypes();
  }

  getAllMyLeaves() {

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
    this.dataSourceLeaves = new MatTableDataSource<UserPersonalLeaveTypes>(this.userPersonalLeaveTypes);
    this.dataSourceTypes = new MatTableDataSource<UserPersonalLeaveTypes>(this.userPersonalLeaveTypes);
    this.dataSourceLeaves.paginator = this.TableLeavesPaginator;
    this.dataSourceTypes.paginator = this.TableTypesPaginator;
    this.dataSourceLeaves.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o, i) => o[i], item)
      return item[property];
    };
    this.dataSourceTypes.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o, i) => o[i], item)
      return item[property];
    };
    this.dataSourceLeaves.sort = this.TableLeavesSort;
    this.dataSourceTypes.sort = this.TableTypesSort;
    this.isDataLoaded = true;
  }

getUserLimits() {

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

getRequestedHours() {

    this.userPersonalLeaveTypes.forEach( (element, index) => {
      this.userApi.getRequestedHours(this.user.id, element.leaveType.id).subscribe(
        (rH: RequestedHoursApiModel) => {
          this.userPersonalLeaveTypes[index].requestedHours = rH.requestedHours;
          this.fillData();
        }
      );
    });
  }

applyFilterLeaves(filterValue: string) {
  this.dataSourceLeaves.filter = filterValue.trim().toLowerCase();
  this.dataSourceLeaves.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    //console.log(this.dataSource.filter);
  }

applyFilterTypes(filterValue: string) {
  this.dataSourceTypes.filter = filterValue.trim().toLowerCase();
  this.dataSourceTypes.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    //console.log(this.dataSource.filter);
  }
}

interface UserPersonalLeaveTypes {
  leaveType: LeaveTypeApiModel,
  limit: number,
  carryover: number,
  requestedHours: number
}
