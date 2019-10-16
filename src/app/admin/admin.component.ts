import { Component, OnInit } from '@angular/core';

import { AdminService, UserApiModel, UserCreateApiModel } from '../api';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    // const user: UserCreateApiModel = {
    //   firstName: 'Lukas',
    //   lastName: 'Havrisak',
    //   admin: false,
    //   email: 'altair213@gmail.com'
    // }
    // this.adminService.createUser(user).subscribe(val => console.log(val))
  }

}
