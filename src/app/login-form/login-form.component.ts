import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService as LoginService, UserLoginApiModel } from '../api';
import { Router } from '@angular/router';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  private form: FormGroup;

  constructor(private apiService: LoginService, private userService: UserInfoService, private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) {
      this.router.navigate(['']);
    }
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    }, {updateOn: 'submit'});
  }

  loginUser(event) {
    event.preventDefault();
    if (!this.form.valid) {
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
