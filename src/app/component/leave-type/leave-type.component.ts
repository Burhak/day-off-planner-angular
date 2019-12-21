import {Component, NgZone, OnInit} from '@angular/core';
import {AdminService, LeaveTypeApiModel, LeaveTypeCreateApiModel, LeaveTypeService, UserApiModel} from "../../api";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material";
import {DeleteUserDialogComponent} from "../user-profile/delete-user-dialog/delete-user-dialog.component";
import {DeleteLeaveTypeDialogComponent} from "./delete-leave-type-dialog/delete-leave-type-dialog.component";

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css']
})
export class LeaveTypeComponent implements OnInit {

  public leaveType: LeaveTypeApiModel;
  public form: FormGroup;
  public isCheckboxChanged: boolean;
  public isLeaveTypeUpdated: boolean;
  public isColorChanged: boolean;
  public leaveTypeId: string;
  public errorMsg: string = '';
  public color: string = 'rgb(44, 62, 80)';

  constructor(private router: Router, private leaveTypeService: LeaveTypeService, private adminService: AdminService, private dialog: MatDialog, private ngZone: NgZone) {
    this.isLeaveTypeUpdated = false;
    this.isCheckboxChanged = false;
    this.isColorChanged = false;
    if (this.router.getCurrentNavigation().extras.state != null) {
      this.leaveTypeId =  this.router.getCurrentNavigation().extras.state.leaveTypeId;
      localStorage.setItem('leaveTypeId', this.leaveTypeId);
    } else {
      this.leaveTypeId = localStorage.getItem('leaveTypeId');
    }

    this.leaveTypeService.getLeaveTypeById(this.leaveTypeId).subscribe((leaveType: LeaveTypeApiModel) => {
      this.leaveType = leaveType;
      this.color = leaveType.color;
    });

    this.form = new FormGroup({
      name: new FormControl('x', [Validators.required]),
      limit: new FormControl('', [Validators.pattern('[0-9]+')]),
      carryover: new FormControl('', [Validators.pattern('[0-9]+')])
    });

  }

  ngOnInit() {
  }

  updateLeaveType(event) {
    event.preventDefault();
    if (!this.form.valid) {
      console.log(this.form.valid);
      return;
    }

    const updatedLeaveType: LeaveTypeCreateApiModel = {
      name: event.target.name.value,
      approvalNeeded: event.target.approvalNeeded.checked,
      limit: event.target.limit.value,
      carryover: event.target.carryover.value,
      color: this.color,
    };

    this.adminService.updateLeaveType(updatedLeaveType, this.leaveTypeId).subscribe(
      response => {
        this.isLeaveTypeUpdated = true;
        this.hideMessage();
        this.errorMsg = '';
      }, error => {
        if (error.status === 409) {
          this.ngZone.run(() => {
            this.errorMsg = 'Name already taken';
          });
        } else throw error;
      }
    );
  }

  hideMessage() {
    (function(that) {
      setTimeout(function() {
        that.isLeaveTypeUpdated = false;
      }, 3000);
    }(this));
  }

  onCheckboxChanged(event) {
    this.isCheckboxChanged = true;
  }

  openDialogDeleteLeaveType(leaveType) {
    let dialogRef = this.dialog.open(DeleteLeaveTypeDialogComponent, {data: {leaveTypeName: leaveType.name}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'true') {
        this.deleteLeaveType(leaveType);
      }
    });
  }

  deleteLeaveType(leaveType) {
    this.adminService.deleteLeaveType(leaveType.id).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['admin/leaveTypes']);
      });
  }

}
