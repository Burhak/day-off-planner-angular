import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService as LoginService, UserLoginApiModel } from '../api';
import { Router } from '@angular/router';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(private apiService: LoginService, private userService: UserInfoService, private router: Router) { }

  ngOnInit() {
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

    this.apiService.loginUser(user).subscribe(
      response => {
        // save response.token
        this.userService.saveToken(response.token);
        this.userService.saveUser(response.user);
        this.router.navigate(['']);
      },
      error => {
        window.alert(error.message);
        console.log(error);
        console.log(error.status);
      }
    );
  }

}
