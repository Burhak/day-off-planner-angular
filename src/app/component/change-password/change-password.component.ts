import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../api';
import {passwordConfirmValidator} from './passwordValidator';
import {ErrorStateMatcher} from '@angular/material';

class CrossFieldErrorMatcher implements ErrorStateMatcher{
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return form.submitted && (form.hasError('misMatch') || form.hasError('required', ['confirmPassword']));
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public form: FormGroup;
  public isPasswordChanged: boolean;
  public buttonDisabled: boolean;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {updateOn: 'submit', validators: passwordConfirmValidator});
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
      }
    );
  }



}
