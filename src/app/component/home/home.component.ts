import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LeaveTypeApiModel, LeaveTypeService, UserService, LimitApiModel,
  CarryoverApiModel, UserApiModel, RequestedHoursApiModel, LeaveService, LeaveRequestApiModel
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

  public displayedColumnsTypes: string[] = ['leaveType.name', 'leaveType.approvalNeeded',
    'limit', 'carryover', 'requestedHours'];
  public displayedColumnsLeaves: string[] = ['leaveType', 'fromDate', 'toDate', 'status'];
  public dataSourceLeaves: MatTableDataSource<PersonalLeaveRequests>;
  public dataSourceTypes: MatTableDataSource<UserPersonalLeaveTypes>;
  public isDataLoaded: boolean;
  public leavesReady: boolean;
  private userPromise: Promise<UserApiModel>;
  private user: UserApiModel;
  public userPersonalLeaveTypes: Array<UserPersonalLeaveTypes> = [];
  public leaveRequests: Array<PersonalLeaveRequests> = []; 

  constructor(private leaveType: LeaveTypeService, private userApi: UserService,
    private userService: UserInfoService, private leavesApi: LeaveService) {}

  ngOnInit() {
    this.isDataLoaded = false;
    this.leavesReady = false;
    this.userPromise = this.userService.currentUserPromise;
    this.initData();
  }

  async initData() {
    this.user = await this.userPromise;

    this.getDataAllLeaveTypes();
  }

  getAllMyLeaves() {
    this.leavesApi.filterLeaveRequests().subscribe((leaves: LeaveRequestApiModel[]) => {
      leaves.forEach((element) => {
        let obj: PersonalLeaveRequests = {
          id: element.id,
          leaveType: this.userPersonalLeaveTypes.find(({ leaveType }) => leaveType.id === element.leaveType).leaveType.name,
          fromDate: element.fromDate,
          toDate: element.toDate,
          status: element.status
        };
        this.leaveRequests.push(obj);
      });
      this.leavesReady = true;
    });
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
      this.getAllMyLeaves();
    });
  }

  fillData() {
    this.dataSourceLeaves = new MatTableDataSource<PersonalLeaveRequests>(this.leaveRequests);
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
          else this.userPersonalLeaveTypes[index].carryover = 0;
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

  applyFilterLeavesExact(filterValue: string) {
    this.dataSourceLeaves.filter = filterValue.trim().toLowerCase();
    this.dataSourceLeaves.filterPredicate = function (data: PersonalLeaveRequests, filterValue: string) {
      return data.status
        .trim()
        .toLocaleLowerCase() === filterValue;
    };
  }

applyFilterTypes(filterValue: string) {
  this.dataSourceTypes.filter = filterValue.trim().toLowerCase();
  this.dataSourceTypes.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    //console.log(this.dataSource.filter);
  }

  log(event) {
    console.log(event);
  }
}

interface UserPersonalLeaveTypes {
  leaveType: LeaveTypeApiModel,
  limit: number,
  carryover: number,
  requestedHours: number
}

interface PersonalLeaveRequests {
  id: string;
  leaveType: string;
  fromDate: Date;
  toDate: Date;
  status: LeaveRequestApiModel.StatusEnum;
}
