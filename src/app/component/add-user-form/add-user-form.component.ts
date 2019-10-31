import { Component, OnInit, NgZone } from '@angular/core';
import {AdminService, UserApiModel, UserCreateApiModel, UserService} from '../../api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoService } from 'src/app/service/user-info.service';
import {MatSelectChange} from "@angular/material";

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})
export class AddUserFormComponent implements OnInit {

  public form: FormGroup;
  public buttonDisabled: boolean;
  public posibleUserSupervisors: Array<UserApiModel> = [];
  public selectControl: FormControl = new FormControl();
  public isUserAdded: boolean;
  public errorMsg: string = '';

  constructor(private adminService: AdminService, private userService: UserService, private userInfoService: UserInfoService, private router: Router, private ngZone: NgZone) {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      this.posibleUserSupervisors = user;
    });
  }


  ngOnInit() {
    if (!this.userInfoService.hasAdminPrivileges) {
      this.router.navigate(['']);
    }
    this.form = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      jobdescription: new FormControl('', [Validators.required])
    }, {updateOn: 'submit'});
    this.isUserAdded = false;
    this.buttonDisabled = false;
  }

  goBack() {
    this.router.navigate(['']);
  }


  createNewUser(event) {
    event.preventDefault();
    if (!this.form.valid) {
      console.log(this.form.valid);
      return;
    }
    const newUser: UserCreateApiModel = {
      firstName: event.target.firstname.value,
      lastName: event.target.lastname.value,
      email: event.target.email.value,
      admin: event.target.admin.checked,
      supervisor: this.selectControl.value,
      jobDescription: event.target.jobdescription.value,
      phone: event.target.phone.value

    };

    this.buttonDisabled = true;
    this.adminService.createUser(newUser).subscribe(
      response => {
        console.log(response);
        this.buttonDisabled = false;
        this.isUserAdded = true;
      },
      error => {
        this.buttonDisabled = false;
        console.log(error);
        console.log(error.status);
        if (error.status == 409) {
          this.ngZone.run(() => {
            this.errorMsg = 'Email already taken'
          })
        } else throw error;
      }
    );
    console.log(newUser);
  }
}
