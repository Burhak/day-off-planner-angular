import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService as LoginService, UserLoginApiModel } from '../api';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(private apiService: LoginService,
    private authService: AuthService,
    private router: Router) { }

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
        this.authService.saveToken(response.token);
        this.router.navigate(['']);
      },
      error => {
        window.alert(error.message)
        console.log(error);
        console.log(error.status);
      }
    );
  }

}
