import { Component, OnInit } from '@angular/core';
import {
  LeaveRequestCreateApiModel,
  LeaveService,
  LeaveTypeApiModel,
  LeaveTypeService,
  SettingApiModel,
  SettingService
} from '../../api';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-leave-request',
  templateUrl: './add-leave-request.component.html',
  styleUrls: ['./add-leave-request.component.scss']
})
export class AddLeaveRequestComponent implements OnInit {

  public dateRange;
  public leaveTypesSelectControl: FormControl = new FormControl('', [Validators.required]);
  public leaveTypeList: Array<LeaveTypeApiModel> = [];
  public isRequestCreated: boolean = false;
  public errorMsg: string = '';
  private buttonDisabled: boolean = false;

  public workdayStart: number;
  public workdayLength: number;
  public possibleHours: Array<number> = [];
  public settings: Array<SettingApiModel> = [];
  public fromHourSelectControl: FormControl = new FormControl();
  public toHourSelectControl: FormControl = new FormControl();


  constructor(private leaveTypeService: LeaveTypeService, private leaveService: LeaveService, private settingService: SettingService) {
    this.leaveTypeService.getAllLeaveTypes().subscribe((leaveTypes: LeaveTypeApiModel[]) => {
      this.leaveTypeList = leaveTypes;
    });
    this.getSettings();
  }

  ngOnInit() {
  }

  getSettings() {
    this.settingService.getAllSettings().subscribe((settings: SettingApiModel[]) => {
      this.settings = settings;
      this.workdayStart  = this.settings.find(setting => setting.key === 'WORKDAY_START').value;
      this.workdayLength = this.settings.find(setting => setting.key === 'WORKDAY_LENGTH').value;

      for (let i = this.workdayStart; i < (this.workdayStart + this.workdayLength); i++) {
        this.possibleHours.push(i);
      }
    });
  }

  createLeaveRequest(event) {
    event.preventDefault();
    if (!this.leaveTypesSelectControl.valid) {
      return;
    }

    if (this.dateRange === undefined) {
      this.errorMsg = 'Date range was not selected';
      return;
    }
    console.log(this.dateRange.begin + "-" + this.dateRange.end) ;

    let tmpDateFrom: Date = new Date(this.dateRange.begin.getTime());
    let tmpDateTo: Date = new Date(this.dateRange.end.getTime());
    tmpDateFrom.setHours(this.fromHourSelectControl.value,0,0,0);
    tmpDateTo.setHours(this.toHourSelectControl.value,0,0,0);
    console.log(tmpDateFrom) ;
    console.log(tmpDateTo) ;

    let userTimezoneOffset = this.dateRange.begin.getTimezoneOffset() * 60000;
    let dateFrom: Date = new Date(tmpDateFrom.getTime() - userTimezoneOffset);
    let dateTo: Date = new Date(tmpDateTo.getTime() - userTimezoneOffset);
    console.log(dateFrom) ;
    console.log(dateTo) ;
    const leaveRequest: LeaveRequestCreateApiModel = {
      leaveType: this.leaveTypesSelectControl.value,
      fromDate: dateFrom,
      toDate: dateTo
    };

    this.buttonDisabled = true;
    this.leaveService.createLeaveRequest(leaveRequest).subscribe(
      response => {
        console.log(response);
        this.buttonDisabled = false;
        this.isRequestCreated = true;
        this.hideMessage();
        this.errorMsg = '';
      },
      error => {
        this.buttonDisabled = false;
        this.isRequestCreated = false;
        console.log(error);
        console.log(error.status);
        throw error;
      });
  }

  dateRangeChange($event) {
    this.dateRange = $event;
  }

  hideMessage() {
    (function(that){
      setTimeout(function() {
        that.isRequestCreated = false;
      }, 3000);
    }(this));
  }

}
