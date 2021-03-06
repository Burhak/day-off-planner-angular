import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LeaveRequestCreateApiModel,
  LeaveService,
  LeaveTypeApiModel,
  LeaveTypeService,
  SettingApiModel,
  SettingService
} from '../../api';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-add-leave-request',
  templateUrl: './add-leave-request.component.html',
  styleUrls: ['./add-leave-request.component.scss']
})
export class AddLeaveRequestComponent implements OnInit {

  @ViewChild('stepper', {static: false})
  public stepper: MatStepper;

  public dateRange: any;
  public leaveTypesSelectControl: FormControl = new FormControl('', [Validators.required]);
  public dateRangeControl: FormControl = new FormControl('', [Validators.required]);
  public leaveTypeList: Array<LeaveTypeApiModel> = [];
  public buttonDisabled = false;

  public workdayStart: number;
  public workdayLength: number;
  public possibleHours: Array<number> = [];
  public settings: Array<SettingApiModel> = [];
  public fromHourSelectControl: FormControl = new FormControl();
  public toHourSelectControl: FormControl = new FormControl();


  constructor(
      private leaveTypeService: LeaveTypeService,
      private leaveService: LeaveService,
      private settingService: SettingService,
      private messageService: MessageService
  ) {
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

  createLeaveRequest(event: any) {
    event.preventDefault();
    if (!this.leaveTypesSelectControl.valid) {
      return;
    }

    if (this.dateRange === undefined) {
      throw 'Date range was not selected';
    }

    const tmpDateFrom: Date = new Date(this.dateRange.begin.getTime());
    const tmpDateTo: Date = new Date(this.dateRange.end.getTime());
    tmpDateFrom.setHours(this.fromHourSelectControl.value, 0, 0, 0);
    tmpDateTo.setHours(this.toHourSelectControl.value, 0, 0, 0);

    const userTimezoneOffset = this.dateRange.begin.getTimezoneOffset() * 60000;
    const dateFrom: Date = new Date(tmpDateFrom.getTime() - userTimezoneOffset);
    const dateTo: Date = new Date(tmpDateTo.getTime() - userTimezoneOffset);
    const leaveRequest: LeaveRequestCreateApiModel = {
      leaveType: this.leaveTypesSelectControl.value.id,
      fromDate: dateFrom,
      toDate: dateTo
    };

    this.buttonDisabled = true;
    this.leaveService.createLeaveRequest(leaveRequest).subscribe(response => {
      this.messageService.info('Leave request has been created successfully');
      this.buttonDisabled = false;
    }, error => {
      this.buttonDisabled = false;
      throw error;
    });
  }

  dateRangeChange(event: any) {
    this.dateRange = event;
    this.dateRangeControl.setValue(' '); // set valid formControl for rangeDatePicker
    this.stepper.next();
  }
}
