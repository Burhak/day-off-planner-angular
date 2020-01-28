import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService as LoginService, UserLoginApiModel } from '../../api';
import { Router } from '@angular/router';
import { UserInfoService } from 'src/app/service/user-info.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  public form: FormGroup;

  constructor(
      private apiService: LoginService,
      private userService: UserInfoService,
      private router: Router,
      private messageService: MessageService
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) {
      this.router.navigate(['']);
    }
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    }, {updateOn: 'submit'});
  }

  loginUser(event: any) {
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
        this.userService.saveToken(response.token, new Date(response.expiresAt));
        this.userService.saveUser(response.user);
        this.router.navigate(['']);
      },
      error => {
        if (error.status === 401) {
          this.messageService.error('Invalid email or password');
        } else {
          throw error;
        }
      }
    );
  }

}
