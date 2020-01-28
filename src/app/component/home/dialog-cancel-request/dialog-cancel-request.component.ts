import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-cancel-request',
  templateUrl: './dialog-cancel-request.component.html',
  styleUrls: ['./dialog-cancel-request.component.scss']
})
export class DialogCancelRequestComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
