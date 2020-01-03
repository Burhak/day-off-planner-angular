import {Component, NgZone, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminService, LeaveTypeCreateApiModel, UserApiModel, UserCreateApiModel, UserService} from "../../api";
import {UserInfoService} from "../../service/user-info.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-leave-type',
  templateUrl: './add-leave-type.component.html',
  styleUrls: ['./add-leave-type.component.css']
})
export class AddLeaveTypeComponent implements OnInit {

  public form: FormGroup;
  public buttonDisabled: boolean;
  public isLeaveTypeAdded: boolean;
  public errorMsg: string = '';

  constructor(private router: Router, private adminService: AdminService, private ngZone: NgZone) {

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

  goBack() {
    this.router.navigate(['admin/leaveTypes']);
  }


  createLeaveType(event, formDirective) {
    event.preventDefault();
    if (!this.form.valid) {
      console.log(this.form.valid);
      return;
    }
    const newLeaveType: LeaveTypeCreateApiModel = {
      name: event.target.name.value,
      color: '', // TODO
      approvalNeeded: event.target.approvalNeeded.checked,
      limit: event.target.limit.value,
      carryover: event.target.carryover.value,
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
        } else throw error;
      }
    );
  }


  hideMessage(){
    (function(that){
      setTimeout(function() {
        that.isLeaveTypeAdded = false;
      }, 3000);
    }(this));
  }
}
