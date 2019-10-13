import { Component, OnInit } from '@angular/core';
import { AuthService as LoginService, UserLoginApiModel } from '../api';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(private apiService: LoginService, private authService: AuthService) { }

  ngOnInit() {
    const user: UserLoginApiModel = {
      email: 'admin@admin.com',
      password: 'password'
    };

    //this.apiService.getAllUsers().subscribe(val => console.log(val));
  }

  loginUser(event) {
    event.preventDefault();
    if (!this.emailFormControl.valid || !this.passwordFormControl) {
      return;
    }

    const user: UserLoginApiModel = {
      email: event.target.email.value,
      password: event.target.password.value
    };

    this.apiService.loginUser(user, 'body', true).subscribe(
      response => {
        // save response.token
        this.authService.saveLoginSession(response.token, response.user);
      },
      error => {
        console.log(error);
        console.log(error.status);
      }
    );
  }

}
