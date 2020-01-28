import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService, LeaveTypeCreateApiModel } from '../../api';
import { ColorUtils } from 'src/app/util/color.util';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-add-leave-type',
  templateUrl: './add-leave-type.component.html',
  styleUrls: ['./add-leave-type.component.css']
})
export class AddLeaveTypeComponent implements OnInit {

  public form: FormGroup;
  public buttonDisabled = false;
  public color: string = ColorUtils.randomColor();

  constructor(private adminService: AdminService, private messageService: MessageService) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      limit: new FormControl('', [Validators.pattern('[0-9]+')]),
      carryover: new FormControl('', [Validators.pattern('[0-9]+')])
    }, {updateOn: 'submit'});
  }

  pickColor(color: string) {
    this.color = color;
  }

  createLeaveType(event: any, formDirective: any) {
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
    this.adminService.createLeaveType(newLeaveType).subscribe(response => {
      this.messageService.info('New leave type has been added successfully');
      this.buttonDisabled = false;
      this.form.reset();
      this.color = ColorUtils.randomColor();
      formDirective.resetForm();
    }, error => {
      this.buttonDisabled = false;
      throw error;
    });
  }
}
