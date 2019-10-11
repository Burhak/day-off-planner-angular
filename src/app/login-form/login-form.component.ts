import { Component, OnInit } from '@angular/core';
import { DefaultService, UserLoginApiModel } from '../api';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(private apiService: DefaultService) { }

  ngOnInit() {
    const user: UserLoginApiModel = {
      email: 'admin@admin.com',
      password: 'password'
    };

    this.apiService.getAllUsers().subscribe(val => console.log(val));
  }

  loginUser(event) {
    event.preventDefault();
    if (!this.emailFormControl.valid || !this.passwordFormControl) {
      return;
    }
    const target = event.target;
    const email = target.email.value;
    const password = target.password.value;

    this.apiService.loginUser(email, password);
    
    console.log(email, password);
  }

}
