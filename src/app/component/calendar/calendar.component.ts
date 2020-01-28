import { Component, AfterViewInit, ViewChild, Input, Renderer2 } from '@angular/core';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
import { LeaveRequestApiModel, UserApiModel, UserService, LeaveTypeService, LeaveService, LeaveTypeApiModel, SettingService } from 'src/app/api';
import { MatDialog, MatButton } from '@angular/material';
import { SelectUsersComponent } from './select-users/select-users.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild('scheduler', {static: false})
  public scheduler: DayPilotSchedulerComponent;

  @ViewChild('select_users_btn', {static: true})
  public selectBtn: MatButton;

  public config: DayPilot.SchedulerConfig = {
    timeHeaders: [ {groupBy: 'Month'}, {groupBy: 'Day', format: 'ddd d'} ],
    scale: 'Day',
    days: DayPilot.Date.today().daysInYear(),
    infiniteScrollingEnabled: true,
    infiniteScrollingStepDays: 100,
    startDate: DayPilot.Date.today().addDays(-7),
    timeRangeSelectedHandling: 'Disabled',
    eventMoveHandling: 'Disabled',
    eventResizeHandling: 'Disabled',
    eventDeleteHandling: 'Disabled',
    eventClickHandling: 'Disabled',
    eventHoverHandling: 'Disabled',
    useEventBoxes: 'Never',
    dynamicLoading: true,
    onAfterRender: this.afterRender.bind(this),
    onBeforeCornerDomAdd: this.moveSelectButton.bind(this),
    cellWidth: 60,
    rowMinHeight: 50,
    rowHeaderWidth: 100,
    rowHeaderWidthMarginRight: 15
  };

  @Input()
  public displayedUsers: UserApiModel[] = [];

  public allUsers: UserApiModel[] = [];

  public leaveTypesCache = {};

  private workdayStart: number;
  private workdayLength: number;

  constructor(
      private userApi: UserService,
      private leaveTypeApi: LeaveTypeService,
      private leaveApi: LeaveService,
      private settingsApi: SettingService,
      private dialog: MatDialog,
      private renderer: Renderer2
  ) {
    // fetch users
    this.userApi.getAllUsers().subscribe(response => {
      this.allUsers = response;
      this.displayedUsers = this.allUsers.filter(u => this.displayedUsers.find(old => old.id === u.id));
    });

    // cache leave types
    this.leaveTypeApi.getAllLeaveTypes().subscribe(response => {
      for (const type of response) {
        this.leaveTypesCache[type.id] = type;
      }
    });

    // load settings
    this.settingsApi.getAllSettings().subscribe(response => {
      this.workdayStart  = response.find(s => s.key === 'WORKDAY_START').value;
      this.workdayLength = response.find(s => s.key === 'WORKDAY_LENGTH').value;
    });
  }

  private totalMinutes(d: Date): number {
    return 60 * d.getHours() + d.getMinutes();
  }

  ngAfterViewInit() {
    this.config.resources = this.displayedUsers.map(this.userToResource);

    // load leave requests on scroll
    this.scheduler.control.onScroll = args => {
      args.async = true;

      const start = args.viewport.start.toString('yyyy-MM-dd');
      const end = args.viewport.end.toString('yyyy-MM-dd');

      this.leaveApi
        .filterLeaveRequests(
          start,
          end,
          [LeaveRequestApiModel.StatusEnum.APPROVED, LeaveRequestApiModel.StatusEnum.PENDING],
          args.viewport.resources)
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

    this.dialog.open(SelectUsersComponent, { data, restoreFocus: false }).afterClosed().subscribe(result => {
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
    if (leaveRequest.status === LeaveRequestApiModel.StatusEnum.PENDING) {
      background = `repeating-linear-gradient(135deg, ${type.color}, ${type.color} 5px, white 5px, white 10px)`;
    }

    // black color for CANCELLED and REJECTED (should never happen)
    if (leaveRequest.status === LeaveRequestApiModel.StatusEnum.CANCELLED ||
        leaveRequest.status === LeaveRequestApiModel.StatusEnum.REJECTED) {
      border = 'black';
      background = 'black';
    }

    return {
      cssClass: 'leave',
      id: leaveRequest.id,
      resource: leaveRequest.user,
      start: new DayPilot.Date(this.mapToWholeDay(leaveRequest.fromDate), true),
      end: new DayPilot.Date(this.mapToWholeDay(leaveRequest.toDate), true),
      text: '',
      barHidden: true,
      backColor: background,
      borderColor: border
    };
  }

  private mapToWholeDay(date: Date): Date {
    const d = new Date(date);
    d.setSeconds(0);
    d.setMilliseconds(0);

    const newMinutes = (1440 / (this.workdayLength * 60)) * (this.totalMinutes(d) - this.workdayStart * 60);

    const hours = Math.floor(newMinutes / 60);
    const minutes = newMinutes % 60;

    d.setHours(hours, minutes);
    return d;
  }





  private afterRender() {
    this.scheduler.control.scrollTo(this.config.startDate);
  }

  private moveSelectButton() {
    this.renderer.appendChild(document.getElementsByClassName('scheduler_default_corner')[0], this.selectBtn._elementRef.nativeElement);
  }

}
