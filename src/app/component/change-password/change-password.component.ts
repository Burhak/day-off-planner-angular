import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../api";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public form: FormGroup;
  public isPasswordChanged: boolean;
  public buttonDisabled: boolean;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required])
    }, {updateOn: 'submit'});
    this.isPasswordChanged = false;
    this.buttonDisabled = false;
  }

  goBack() {
    this.router.navigate(['']);
  }

  changePassword(event) {
    event.preventDefault();
    if (!this.form.valid) {
      return;
    }
    this.buttonDisabled = true;
    const newPassword: any = {
      oldPassword: event.target.oldPassword.value,
      newPassword: event.target.newPassword.value
    };

    this.userService.changePassword(newPassword).subscribe(
      response => {
        this.isPasswordChanged = true;
        this.buttonDisabled = false;
      },
      error => {
        // error.status == 403 invalid current password
        console.log(error);
        console.log(error.status);
        if (error.status == 403) {
          error.message = 'invalid current password';
        }
        this.buttonDisabled = false;
        throw error;
      }
    );
  }

}
