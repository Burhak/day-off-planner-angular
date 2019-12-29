import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserApiModel, LeaveTypeApiModel, LeaveTypeService, UserService } from 'src/app/api';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-individual-limits',
  templateUrl: './individual-limits.component.html',
  styleUrls: ['./individual-limits.component.scss']
})
export class IndividualLimitsComponent implements OnInit {

  @Input() public user: UserApiModel;

  @ViewChild('TableTypesPaginator', { static: false }) TableTypesPaginator: MatPaginator;
  @ViewChild('TableTypesSort', { static: false }) TableTypesSort: MatSort;

  public displayedColumnsTypes: string[] = ['leaveType.name', 'limit'];
  public dataSourceTypes: MatTableDataSource<LeaveTypeInfo>;
  public leaveTypeInfos: Array<LeaveTypeInfo> = [];

  constructor(private leaveTypeApi: LeaveTypeService, private userApi: UserService) { }

  ngOnInit() {
    this.getLeaveTypes();
  }

  private getLeaveTypes() {
    this.leaveTypeApi.getAllLeaveTypes().subscribe(response => {
      this.leaveTypeInfos = response.map(type => {
        return {
          leaveType: type,
          limit: this.getLimit(type),
        }
      });
      this.fillDataTypes();
    });
  }

  private getLimit(leaveType: LeaveTypeApiModel): Promise<string> {
    if (leaveType.limit == null) return null;
    return this.userApi.getLimit(this.user.id, leaveType.id).toPromise().then(response => {
      if (response != null) return response.limit + " (custom)";
      return leaveType.limit + " (default)";
    });
  }

  private fillDataTypes() {
    this.dataSourceTypes = new MatTableDataSource<LeaveTypeInfo>(this.leaveTypeInfos);
    this.dataSourceTypes.paginator = this.TableTypesPaginator;
    this.dataSourceTypes.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o, i) => o[i], item)
      return item[property];
    };
    setTimeout(() => this.dataSourceTypes.sort = this.TableTypesSort);
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

interface LeaveTypeInfo {
  leaveType: LeaveTypeApiModel,
  limit?: Promise<string>,
}
