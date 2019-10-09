import { Component, OnInit } from '@angular/core';
import { DefaultService, UserLoginApiModel } from '../api';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private apiService: DefaultService) { }

  ngOnInit() {
    const user: UserLoginApiModel = {
      email: 'admin@admin.com',
      password: 'password'
    };

    this.apiService.getAllUsers().subscribe(val => console.log(val));
  }

}
