import { Component, OnInit } from '@angular/core';
import {AdminService, UserCreateApiModel} from '../api';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserInfoService} from '../user-info.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})
export class AddUserFormComponent implements OnInit {

  private form: FormGroup;
  private buttonDisabled: boolean;

  constructor(private adminService: AdminService, private userService: UserInfoService, private router: Router) {
  }

  ngOnInit() {
    if (!this.userService.hasAdminPrivileges) {
      this.router.navigate(['']);
    }
    this.form = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    }, {updateOn: 'submit'});
    this.buttonDisabled = false;
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
      admin: event.target.admin.checked
    };
    this.buttonDisabled = true;
    this.adminService.createUser(newUser).subscribe(
      response => {
        console.log(response);
        this.buttonDisabled = false;
      }
    );
    console.log(newUser);
  }
}
