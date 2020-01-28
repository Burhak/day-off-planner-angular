import { Component, OnInit, NgZone } from '@angular/core';
import { AdminService, UserApiModel, UserCreateApiModel, UserService } from '../../api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoService } from 'src/app/service/user-info.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})
export class AddUserFormComponent implements OnInit {

  public form: FormGroup;
  public buttonDisabled: boolean;
  public posibleUserSupervisorsOrApprovers: Array<UserApiModel> = [];
  public supervisorSelectControl: FormControl = new FormControl();
  public approversSelectControl: FormControl = new FormControl();

  constructor(
      private adminService: AdminService,
      private userService: UserService,
      private userInfoService: UserInfoService,
      private messageService: MessageService,
      private router: Router
  ) {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      this.posibleUserSupervisorsOrApprovers = user;
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
      phone: new FormControl(''),
      jobdescription: new FormControl('', [Validators.required])
    }, {updateOn: 'submit'});
    this.buttonDisabled = false;
  }

  goBack() {
    this.router.navigate(['']);
  }


  createNewUser(event: any, formDirective: any) {
    event.preventDefault();
    if (!this.form.valid) {
      return;
    }

    const newUser: UserCreateApiModel = {
      firstName: event.target.firstname.value,
      lastName: event.target.lastname.value,
      email: event.target.email.value,
      admin: event.target.admin.checked,
      supervisor: this.supervisorSelectControl.value,
      jobDescription: event.target.jobdescription.value,
      phone: event.target.phone.value,
      approvers: this.approversSelectControl.value || []
    };

    this.buttonDisabled = true;
    this.adminService.createUser(newUser).subscribe(response => {
      this.messageService.info('New user has been added successfully');
      this.buttonDisabled = false;
      this.form.reset();
      formDirective.resetForm();
    }, error => {
      this.buttonDisabled = false;
      throw error;
    });
  }

}
