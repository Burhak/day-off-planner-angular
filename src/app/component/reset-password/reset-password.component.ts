import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../api'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public form: FormGroup;
  public isPasswordReset: boolean;
  public buttonDisabled: boolean;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    }, {updateOn: 'submit'});
    this.isPasswordReset = false;
    this.buttonDisabled = false;
  }

  goBack() {
      this.router.navigate(['login']);
  }

  resetPassword(event) {
    event.preventDefault();
    if (!this.form.valid) {
      return;
    }
    this.buttonDisabled = true;
    const newPassword: any = {
      email: event.target.email.value
    };

    this.userService.resetPassword(newPassword).subscribe(
      response => {
        this.isPasswordReset = true;
        this.buttonDisabled = false;
      }, error => {
        this.buttonDisabled = false;
        throw error;
      }
    );
  }

}
