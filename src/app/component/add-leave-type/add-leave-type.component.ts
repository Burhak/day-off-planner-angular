import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService, LeaveTypeCreateApiModel } from '../../api';
import { ColorUtils } from 'src/app/util/color.util';

@Component({
  selector: 'app-add-leave-type',
  templateUrl: './add-leave-type.component.html',
  styleUrls: ['./add-leave-type.component.css']
})
export class AddLeaveTypeComponent implements OnInit {

  public form: FormGroup;
  public buttonDisabled: boolean;
  public isLeaveTypeAdded: boolean;
  public errorMsg = '';
  public color: string = ColorUtils.randomColor();

  constructor(private adminService: AdminService, private ngZone: NgZone) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      limit: new FormControl('', [Validators.pattern('[0-9]+')]),
      carryover: new FormControl('', [Validators.pattern('[0-9]+')])
    }, {updateOn: 'submit'});
    this.isLeaveTypeAdded = false;
    this.buttonDisabled = false;
  }

  pickColor(color: string) {
    this.color = color;
  }

  createLeaveType(event, formDirective) {
    event.preventDefault();
    if (!this.form.valid) {
      return;
    }
    const newLeaveType: LeaveTypeCreateApiModel = {
      name: event.target.name.value,
      approvalNeeded: event.target.approvalNeeded.checked,
      limit: event.target.limit.value,
      carryover: event.target.carryover.value,
      color: this.color,
    };

    this.buttonDisabled = true;
    this.adminService.createLeaveType(newLeaveType).subscribe(
      response => {
        this.buttonDisabled = false;
        this.isLeaveTypeAdded = true;
        this.hideMessage();
        this.form.reset();
        formDirective.resetForm();
        this.errorMsg = '';
      }, error => {
        this.buttonDisabled = false;
        if (error.status === 409) {
          this.ngZone.run(() => {
            this.errorMsg = 'Name already taken';
          });
        } else {
          throw error;
        }
      }
    );
  }

  hideMessage() {
    setTimeout(() => this.isLeaveTypeAdded = false, 3000);
  }
}
