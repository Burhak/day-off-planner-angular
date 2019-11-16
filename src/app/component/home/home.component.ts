import { Component, OnInit, ViewChild } from '@angular/core';
import { LeaveTypeApiModel, LeaveTypeService, UserService, LimitApiModel, CarryoverApiModel, UserApiModel } from '../../api';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private leaveTypes: Array<LeaveTypeApiModel> = [];
  private 
  public displayedColumns: string[] = ['name', 'approvalNeeded', 'limit', 'carryover'];
  public dataSource: MatTableDataSource<LeaveTypeApiModel>;
  public isDataLoaded: boolean;

  constructor(private leaveType: LeaveTypeService, private userApi: UserService) {
    this.isDataLoaded = false;
    this.getDataAllLeaveTypes();
  }

  ngOnInit() {
  }

  getDataAllLeaveTypes() {
    this.leaveType.getAllLeaveTypes().subscribe((leaveType: LeaveTypeApiModel[]) => {
      this.leaveTypes = leaveType;
      this.fillData();
    });
  }

  fillData() {
    this.dataSource = new MatTableDataSource<LeaveTypeApiModel>(this.leaveTypes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isDataLoaded = true;
  }

  logArray() {
    console.log(this.leaveTypes);
    /**
    this.userApi.getAllUsers().subscribe(
      (gay: UserApiModel[]) => {
        console.log(gay);
      }
    )
    this.userApi.getLimit(this.leaveTypes[1].id).subscribe(
      (obj: LimitApiModel) => {
        console.log(obj);
      }
    )
    **/
    this.getUserLimits();
  }

  getUserLimits() {
    let leaveLimits: Array<LimitApiModel> = [];
    let leaveCarryOvers: Array<CarryoverApiModel> = [];

    //many subscribtions to fill personal limits and carryovers by one at a time
    this.leaveTypes.forEach((leaveType) => {
      this.userApi.getLimit(leaveType.id).subscribe(
        (leaveLimit: LimitApiModel) => {
          leaveLimits.push(leaveLimit);
          update();
        }
      );
      this.userApi.getCarryover(leaveType.id).subscribe(
        (leaveCarryOver: CarryoverApiModel) => {
          leaveCarryOvers.push(leaveCarryOver);
          update();
        }
      );
    });

    function update() {

      //when leaveLimit and leaveCarryOver are fully filled make new array with personal limit and carryover 
      if (leaveCarryOvers.length == this.leaveTypes.length && leaveLimits.length == this.leaveTypes.length) {
        let personalLeaveTypes: Array<LeaveTypeApiModel> = this.leaveTypes.map((element) => {
          const obj: LeaveTypeApiModel = {
            id: element.id,
            name: element.name,
            approvalNeeded: element.approvalNeeded,
            limit: leaveLimits.find(({ leaveType }) => leaveType === element.id).limit,
            carryover: leaveCarryOvers.find(({ leaveType }) => leaveType === element.id).carryover
          };
          return obj;
          }
        )
        this.leaveTypes = personalLeaveTypes;
      }
    }
  }

}
