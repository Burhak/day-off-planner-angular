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

  public displayedColumns: string[] = ['name', 'approvalNeeded', 'limit', 'carryover', 'requestedHours'];
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
          limit: null,
          carryOver: null,
          requestedHours: null
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
    this.dataSource.sort = this.sort;
    this.isDataLoaded = true;
  }

  async getUserLimits() {

    this.user = await this.userPromise;

    //many subscribtions to fill personal limits and carryovers by one at a time
    this.userPersonalLeaveTypes.forEach((element, index) => {
      this.userApi.getLimit(this.user.id, element.leaveType.id).subscribe(
        (leaveLimit: LimitApiModel) => {
          this.userPersonalLeaveTypes[index].limit = leaveLimit;
          this.fillData();
        }
      );
      this.userApi.getCarryover(this.user.id, element.leaveType.id).subscribe(
        (leaveCarryOver: CarryoverApiModel) => {
          this.userPersonalLeaveTypes[index].carryOver = leaveCarryOver;
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
          this.userPersonalLeaveTypes[index].requestedHours = rH;
          this.fillData();
        }
      );
    });
  }
}

interface UserPersonalLeaveTypes {
  leaveType: LeaveTypeApiModel,
  limit: LimitApiModel,
  carryOver: CarryoverApiModel,
  requestedHours: RequestedHoursApiModel
}
