import { Component, OnInit } from '@angular/core';
import {LeaveRequestCreateApiModel, LeaveService, LeaveTypeApiModel, LeaveTypeService} from '../../api';
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


  constructor(private leaveTypeService: LeaveTypeService, private leaveService: LeaveService) {
    this.leaveTypeService.getAllLeaveTypes().subscribe((leaveTypes: LeaveTypeApiModel[]) => {
      this.leaveTypeList = leaveTypes;
    });
  }

  ngOnInit() {
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

    const leaveRequest: LeaveRequestCreateApiModel = {
      leaveType: this.leaveTypesSelectControl.value,
      fromDate: this.dateRange.begin,
      toDate: this.dateRange.end
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
