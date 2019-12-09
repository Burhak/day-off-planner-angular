import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-setting-dialog',
  templateUrl: './setting-dialog.component.html',
  styleUrls: ['./setting-dialog.component.css']
})
export class SettingDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SettingDialogComponent>) { }

  ngOnInit() {
    this.form = new FormGroup({
      settingValue: new FormControl('',[Validators.min(this.data.setting.min), Validators.max(this.data.setting.max), Validators.pattern('[0-9]+')])
    }, {updateOn: 'submit'});
  }

  submit(event) {
    event.preventDefault();
    if (!this.form.valid) {
      console.log(this.form.valid);
      return;
    }
    this.dialogRef.close(event.target.settingValue.value);
  }

}
