import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AdminService, UserApiModel, UserCreateApiModel, UserService } from '../../api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoService } from 'src/app/service/user-info.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  public form: FormGroup;
  public buttonDisabled: boolean;
  public posibleUserSupervisors: Array<UserApiModel> = [];
  public selectControl: FormControl = new FormControl();
  public isUserUpdated: boolean;

  @Input() public user: UserApiModel;

  @Output() userUpdatedEvent = new EventEmitter<boolean>();

  constructor(private adminService: AdminService, private userService: UserService, private userInfoService: UserInfoService, private router: Router) {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      this.posibleUserSupervisors = user;
    });
  }


  ngOnInit() {
    if (!this.userInfoService.hasAdminPrivileges) {
      this.router.navigate(['']);
    }
    this.form = new FormGroup({
      firstname: new FormControl('x', [Validators.required]),
      lastname: new FormControl('x', [Validators.required]),
      email: new FormControl('x@x', [Validators.required, Validators.email]),
      jobdescription: new FormControl('x', [Validators.required])
    }, { updateOn: 'submit' });
    this.isUserUpdated = false;
    this.buttonDisabled = false;
  }

  goBack() {
    this.userUpdatedNotify()
  }


  createNewUser(event) {
    event.preventDefault();
    this.form.updateValueAndValidity();
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
    this.adminService.updateUser(newUser, this.user.id).subscribe(
      response => {
        console.log(response);
        this.buttonDisabled = false;
        this.isUserUpdated = true;
      }
    );
    console.log(newUser);
  }

  userUpdatedNotify() {
    this.userUpdatedEvent.emit(this.isUserUpdated);
  }
}
