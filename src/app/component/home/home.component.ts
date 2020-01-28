import { Component, OnInit, ViewChild } from '@angular/core';
import { LeaveTypeApiModel, LeaveTypeService, UserService, UserApiModel, LeaveService, LeaveRequestApiModel } from '../../api';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatDialog } from '@angular/material';
import { UserInfoService } from '../../service/user-info.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogCancelRequestComponent } from './dialog-cancel-request/dialog-cancel-request.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('TableLeavesPaginator', { static: false }) TableLeavesPaginator: MatPaginator;
  @ViewChild('TableLeavesSort', { static: false }) TableLeavesSort: MatSort;

  @ViewChild('TableTypesPaginator', { static: false }) TableTypesPaginator: MatPaginator;
  @ViewChild('TableTypesSort', { static: false }) TableTypesSort: MatSort;

  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;

  public displayedColumnsTypes: string[] = ['leaveType.name', 'leaveType.approvalNeeded', 'limit', 'carryover', 'requestedHours'];
  public displayedColumnsLeaves: string[] = ['leaveType', 'fromDate', 'toDate', 'status', 'cancel'];
  public dataSourceLeaves: MatTableDataSource<LeaveRequestApiModel>;
  public dataSourceTypes: MatTableDataSource<LeaveTypeInfo>;
  public isDataLoaded: boolean;
  public leavesReady: boolean;
  public leaveTypeInfos: Array<LeaveTypeInfo> = [];
  public leaveRequests: Array<LeaveRequestApiModel> = [];
  public date: Date;
  public dateControl: FormControl;
  public leaveTypesCache = {};
  public isLeaveRequestShown = true;
  public hasAnyLeaves = false;
  public leavesChecked = false;

  private userPromise: Promise<UserApiModel>;
  private user: UserApiModel;

  constructor(
      private leaveTypeApi: LeaveTypeService,
      private userApi: UserService,
      private userService: UserInfoService,
      private leavesApi: LeaveService,
      private router: Router,
      private dialog: MatDialog
  ) {
    this.date = new Date();
    // this.date.setMonth(this.date.getMonth() - 6);
    this.dateControl = new FormControl(this.date);
  }

  ngOnInit() {
    this.isDataLoaded = false;
    this.leavesReady = false;
    this.userPromise = this.userService.currentUserPromise;
    this.initData();
  }

  async initData() {
    this.user = await this.userPromise;

    this.hasAnyLeaves = await this.leavesApi
        .countLeaveRequests(null, null, null, [this.user.id])
        .toPromise()
        .then(n => n !== 0);
    this.leavesChecked = true;

    this.getLeaveTypes();
    this.getMyLeaves();
  }

  private getMyLeaves() {
    this.leavesApi.filterLeaveRequests(this.pgFormatDate(this.date), null, null, [this.user.id]).subscribe(response => {
      this.leaveRequests = response;
      this.fillDataLeaves();
    });
  }

  private getLeaveTypes() {
    this.leaveTypeApi.getAllLeaveTypes().subscribe(response => {
      this.leaveTypeInfos = response.map(type => {
        // cache leave type
        this.leaveTypesCache[type.id] = type;

        return {
          leaveType: type,
          limit: this.getLimit(type),
          carryover: this.getCarryover(type),
          requestedHours: this.getRequestedHours(type)
        };
      });
      this.fillDataTypes();
    });
  }

  private fillDataLeaves() {
    this.dataSourceLeaves = new MatTableDataSource<LeaveRequestApiModel>(this.leaveRequests);
    this.dataSourceLeaves.paginator = this.TableLeavesPaginator;
    this.dataSourceLeaves.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) {
        return property.split('.').reduce((o, i) => o[i], item);
      }
      return item[property];
    };
    setTimeout(() => this.dataSourceLeaves.sort = this.TableLeavesSort);
  }

  private fillDataTypes() {
    this.dataSourceTypes = new MatTableDataSource<LeaveTypeInfo>(this.leaveTypeInfos);
    this.dataSourceTypes.paginator = this.TableTypesPaginator;
    this.dataSourceTypes.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) {
        return property.split('.').reduce((o, i) => o[i], item);
      }
      if (['limit', 'carryover', 'requestedHours'].includes(property)) {
        return item[property].__zone_symbol__value;
      }
      return item[property];
    };
    setTimeout(() => this.dataSourceTypes.sort = this.TableTypesSort);
  }

  private getLimit(leaveType: LeaveTypeApiModel): Promise<number> {
    if (leaveType.limit == null) {
      return null;
    }
    return this.userApi.getLimit(this.user.id, leaveType.id).toPromise().then(response => {
      if (response != null) {
        return response.limit;
      }
      return leaveType.limit;
    });
  }

  private getCarryover(leaveType: LeaveTypeApiModel): Promise<number> {
    if (leaveType.carryover == null) {
      return null;
    }
    return this.userApi.getCarryover(this.user.id, leaveType.id).toPromise().then(response => {
      if (response != null) {
        return response.carryover;
      }
      return 0;
    });
  }

  private getRequestedHours(leaveType: LeaveTypeApiModel): Promise<number> {
    return this.userApi.getRequestedHours(this.user.id, leaveType.id).toPromise().then(response => {
      if (response != null) {
        return response.requestedHours;
      }
      return 0;
    });
  }

  applyFilterLeaves(filterValue: string) {
    this.dataSourceLeaves.filter = filterValue.trim().toLowerCase();
    this.dataSourceLeaves.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
    // console.log(this.dataSource.filter);
  }

  applyFilterLeavesExact(filterValue: string) {
    this.dataSourceLeaves.filter = filterValue.trim().toLowerCase();
    this.dataSourceLeaves.filterPredicate = (data: LeaveRequestApiModel, value: string) => data.status.trim().toLocaleLowerCase() === value;
  }

  applyFilterLeavesDate(filterValue: string) {
    if (!this.dateControl.valid) {
      return;
    }
    this.date = new Date(filterValue);
    console.log(this.pgFormatDate(this.date));
    this.getMyLeaves();
    this.tabGroup.selectedIndex = 0;
  }

  applyFilterTypes(filterValue: string) {
    this.dataSourceTypes.filter = filterValue.trim().toLowerCase();
    this.dataSourceTypes.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
    // console.log(this.dataSource.filter);
  }

  log(event: any) {
    console.log(typeof event);
    const date: Date = new Date(event);
    console.log(date.toString());
  }

  // Convert Javascript date to api accepted date
  pgFormatDate(date: Date): string {
    const zeroPad = d => ('0' + d).slice(-2);

    return `${date.getUTCFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`;
  }

  setMyStyles(color: string, hover: boolean) {
    let styles: any;
    if (color) {
      styles = {
              // 'text-decoration-line': 'underline',
              // 'text-decoration-color': color,
              'box-shadow': 'inset ' + (hover ? '30px' : '10px') + ' 0px ' + color,
              transition: 'box-shadow 0.5s'
      };
    }
    return styles;
  }

  addLeaveRequest() {
    this.router.navigate(['addLeaveRequest'] );
  }

  showLeaveTypes() {
    if (this.isLeaveRequestShown) {
      this.isLeaveRequestShown = false;
    }
  }

  showLeaveRequests() {
    if (!this.isLeaveRequestShown) {
      this.isLeaveRequestShown = true;
    }
  }

  cancelDialog(leave: LeaveRequestApiModel) {
    if (leave.status !== LeaveRequestApiModel.StatusEnum.APPROVED && leave.status !== LeaveRequestApiModel.StatusEnum.PENDING) {
      return;
    }
    const dialogRef = this.dialog.open(DialogCancelRequestComponent, { data: { name: this.leaveTypesCache[leave.leaveType].name } });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.leavesApi.cancelLeaveRequest(leave.id).subscribe(r => {
          this.getMyLeaves();
        });
      }
    });
  }
}

interface LeaveTypeInfo {
  leaveType: LeaveTypeApiModel;
  limit?: Promise<number>;
  carryover?: Promise<number>;
  requestedHours: Promise<number>;
}
