import { Component, NgZone, OnInit } from '@angular/core';
import { AdminService, LeaveTypeApiModel, LeaveTypeCreateApiModel, LeaveTypeService } from '../../api';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DeleteLeaveTypeDialogComponent } from './delete-leave-type-dialog/delete-leave-type-dialog.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css']
})
export class LeaveTypeComponent implements OnInit {

  public leaveType: LeaveTypeApiModel;
  public form: FormGroup;
  public isCheckboxChanged = false;
  public isLeaveTypeUpdated = false;
  public isColorChanged = false;
  public leaveTypeId: string;
  public errorMsg = '';
  public color = '';

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private leaveTypeService: LeaveTypeService,
      private adminService: AdminService,
      private dialog: MatDialog,
      private ngZone: NgZone
  ) {
    this.route.paramMap
      .pipe(switchMap(params =>this.leaveTypeService.getLeaveTypeById(params.get('id'))))
      .subscribe(leaveType => {
        this.leaveType = leaveType;
        this.color = leaveType.color;
      }, error => {
        if (error.status === 404 || error.status === 400) {
          console.error('Leave type not found');
        } else {
          throw error;
        }
        this.router.navigate(['']);
      });

    this.form = new FormGroup({
      name: new FormControl('x', [Validators.required]),
      limit: new FormControl('', [Validators.pattern('[0-9]+')]),
      carryover: new FormControl('', [Validators.pattern('[0-9]+')])
    });

  }

  ngOnInit() {
  }

  pickColor(color: string) {
    this.color = color;
    this.isColorChanged = true;
  }

  updateLeaveType(event: any) {
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
        } else {
          throw error;
        }
      }
    );
  }

  hideMessage() {
    setTimeout(() => this.isLeaveTypeUpdated = false, 3000);
  }

  onCheckboxChanged() {
    this.isCheckboxChanged = true;
  }

  openDialogDeleteLeaveType(leaveType: LeaveTypeApiModel) {
    const dialogRef = this.dialog.open(DeleteLeaveTypeDialogComponent, {data: {leaveTypeName: leaveType.name}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'true') {
        this.deleteLeaveType(leaveType);
      }
    });
  }

  deleteLeaveType(leaveType: LeaveTypeApiModel) {
    this.adminService.deleteLeaveType(leaveType.id).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['admin/leaveTypes']);
      });
  }

}
