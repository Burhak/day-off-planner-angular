import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-limit',
  templateUrl: './dialog-limit.component.html',
  styleUrls: ['./dialog-limit.component.scss']
})
export class DialogLimitComponent implements OnInit {

  public saveEnabled: boolean = false;
  public form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.form = new FormGroup({
      limit: new FormControl(this.data.limit, [Validators.pattern('[0-9]+')]),
    });
  }

  get limit(): string {
    return this.form.controls.limit.value;
  }

  inputUpdate() {
    if (this.form.valid) {
      this.saveEnabled = true;
    } else {
      this.saveEnabled = false;
    };
  }
}
