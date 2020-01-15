import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-leave-type-dialog.component.html',
  styleUrls: ['./delete-leave-type-dialog.component.css']
})
export class DeleteLeaveTypeDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
