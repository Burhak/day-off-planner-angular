import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import { LeaveRequestApiModel, UserApiModel, UserService, LeaveTypeService, LeaveService, LeaveTypeApiModel } from 'src/app/api';
import { MatDialog } from '@angular/material';
import { SelectUsersComponent } from './select-users/select-users.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild('scheduler', {static: false})
  public scheduler: DayPilotSchedulerComponent;

  public config: DayPilot.SchedulerConfig = {
    timeHeaders: [ {'groupBy': 'Month'}, {'groupBy': 'Day', 'format': 'ddd d'} ],
    scale: 'Day',
    days: DayPilot.Date.today().daysInYear(),
    infiniteScrollingEnabled: true,
    infiniteScrollingStepDays: 100,
    startDate: DayPilot.Date.today().addDays(-14),
    timeRangeSelectedHandling: 'Disabled',
    eventMoveHandling: 'Disabled',
    eventResizeHandling: 'Disabled',
    eventDeleteHandling: 'Disabled',
    eventClickHandling: 'Disabled',
    eventHoverHandling: 'Disabled',
    useEventBoxes: 'Never',
    dynamicLoading: true,
    onBeforeCellRender: this.highlightWeekend,
    onAfterRender: this.afterRender.bind(this)
  };

  @Input()
  public displayedUsers: UserApiModel[] = [];

  public allUsers: UserApiModel[] = [];

  public leaveTypesCache = {};

  constructor(private userApi: UserService, private leaveTypeApi: LeaveTypeService, private leaveApi: LeaveService, private dialog: MatDialog) {
    // fetch users
    this.userApi.getAllUsers().subscribe(response => this.allUsers = response);

    // cache leave types
    this.leaveTypeApi.getAllLeaveTypes().subscribe(response => {
      for (const type of response) {
        this.leaveTypesCache[type.id] = type;
      }
    });

    this.config.resources = this.displayedUsers.map(this.userToResource);
  }

  ngAfterViewInit() {
    // load leave requests on scroll
    this.scheduler.control.onScroll = args => {
      args.async = true;

      const start = args.viewport.start.toString('yyyy-MM-dd');
      const end = args.viewport.end.toString('yyyy-MM-dd');

      this.leaveApi
        .filterLeaveRequests(start, end, [LeaveRequestApiModel.StatusEnum.APPROVED, LeaveRequestApiModel.StatusEnum.PENDING], args.viewport.resources)
        .subscribe(response => {
          args.events = response.map(this.createEvent.bind(this));
          args.loaded();
        });
    };
  }

  public selectUsers() {
    const data = {
      displayedUsers: this.displayedUsers,
      allUsers: this.allUsers
    };

    this.dialog.open(SelectUsersComponent, { data }).afterClosed().subscribe(result => {
      if (result === 'true') {
        this.displayedUsers = data.displayedUsers;
        this.config.resources = this.displayedUsers.map(this.userToResource);
      }
    });
  }

  private userToResource(user: UserApiModel): DayPilot.ResourceData {
    return {
      name: `${user.firstName} ${user.lastName}`,
      id: user.id
    };
  }

  private createEvent(leaveRequest: LeaveRequestApiModel): DayPilot.EventData {
    const type: LeaveTypeApiModel = this.leaveTypesCache[leaveRequest.leaveType];

    // default for APPROVED
    let border = type.color;
    let background = type.color;

    // stripes for PENDING
    if (leaveRequest.status == LeaveRequestApiModel.StatusEnum.PENDING) {
      background = `repeating-linear-gradient(135deg, ${type.color}, ${type.color} 5px, black 5px, black 10px)`;
    }

    // black color for CANCELLED and REJECTED (should never happen)
    if (leaveRequest.status == LeaveRequestApiModel.StatusEnum.CANCELLED || leaveRequest.status == LeaveRequestApiModel.StatusEnum.REJECTED) {
      border = 'black';
      background = 'black';
    }

    return {
      cssClass: 'leave',
      id: leaveRequest.id,
      resource: leaveRequest.user,
      start: new DayPilot.Date(leaveRequest.fromDate),
      end: new DayPilot.Date(leaveRequest.toDate),
      text: '',
      barHidden: true,
      backColor: background,
      borderColor: border
    }
  }

  private highlightWeekend(args: any) {
    if (args.cell.start.getDayOfWeek() === 6 || args.cell.start.getDayOfWeek() === 0) {
      args.cell.backColor = "#dddddd";
    }
  }

  private afterRender() {
    this.scheduler.control.scrollTo(this.config.startDate);
  }

}
