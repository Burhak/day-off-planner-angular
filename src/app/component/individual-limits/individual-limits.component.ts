import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { UserApiModel, LeaveTypeApiModel, LeaveTypeService, UserService, AdminService, LimitUpdateApiModel } from 'src/app/api';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { DialogLimitComponent } from './dialog-limit/dialog-limit.component';

@Component({
  selector: 'app-individual-limits',
  templateUrl: './individual-limits.component.html',
  styleUrls: ['./individual-limits.component.scss']
})
export class IndividualLimitsComponent implements OnInit {

  @Input() public user: UserApiModel;

  @ViewChild('TableTypesPaginator', { static: false }) TableTypesPaginator: MatPaginator;
  @ViewChild('TableTypesSort', { static: false }) TableTypesSort: MatSort;

  @Output() userUpdatedEvent = new EventEmitter<boolean>();

  public displayedColumnsTypes: string[] = ['leaveType.name', 'limit'];
  public dataSourceTypes: MatTableDataSource<LeaveTypeInfo>;
  public leaveTypeInfos: Array<LeaveTypeInfo> = [];

  constructor(private leaveTypeApi: LeaveTypeService, private userApi: UserService, public dialog: MatDialog,
    private adminApi: AdminService) { }

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

  openEditLimit(leaveType: LeaveTypeInfo) {
    let dialogRef = this.dialog.open(DialogLimitComponent,
      {
        data: {
          name: leaveType.leaveType.name,
          id: leaveType.leaveType.id,
          //take value from promise and extract integer at start
          limit: leaveType.limit["__zone_symbol__value"].replace(/(^\d+)(.+$)/i, '$1')
        }
      });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result !== "false") {
        if (result === "") {
          this.adminApi.deleteLimit(this.user.id, leaveType.leaveType.id).subscribe(
            response => {
              let index = this.leaveTypeInfos.findIndex(x => x.leaveType.id === leaveType.leaveType.id);
              this.leaveTypeInfos[index].limit = this.getLimit(leaveType.leaveType);
            }
          );
        } else {
          const body: LimitUpdateApiModel = {
            limit: result
          };

          this.adminApi.updateLimit(body, this.user.id, leaveType.leaveType.id).subscribe(
            response => {
              let index = this.leaveTypeInfos.findIndex(x => x.leaveType.id === leaveType.leaveType.id);
              this.leaveTypeInfos[index].limit = this.getLimit(leaveType.leaveType);
            }
          );
        }
      }
    });
  }

  userUpdatedNotify() {
    this.userUpdatedEvent.emit(false);
  }

  setMyStyles(color: string, hover: boolean) {
    let styles;
    if (color) {
      styles = {
        'box-shadow': 'inset ' + (hover ? '30px' : '10px') + ' 0px ' + color,
        transition: 'box-shadow 0.5s'
      };
    }
    return styles;
  }
}

interface LeaveTypeInfo {
  leaveType: LeaveTypeApiModel,
  limit?: Promise<string>,
}
