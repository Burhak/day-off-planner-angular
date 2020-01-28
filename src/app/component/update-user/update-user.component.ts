import { Component, OnInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { AdminService, UserApiModel, UserCreateApiModel, UserService } from '../../api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  public form: FormGroup;
  public buttonDisabled = false;
  public posibleUserSupervisorsOrApprovers: Array<UserApiModel> = [];
  public supervisorSelectControl: FormControl = new FormControl();
  public approversSelectControl: FormControl = new FormControl();
  public isUserUpdated = false;

  @Input() public user: UserApiModel;

  @Output() userUpdatedEvent = new EventEmitter<boolean>();

  constructor(private adminService: AdminService, private userService: UserService, private ngZone: NgZone) {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      const allUsers: Array<UserApiModel> = user;
      const index = allUsers.findIndex(u => u.id === this.user.id); // find currentUser in allUsers
      allUsers.splice(index, 1); // delete currentUser from allUsers
      this.posibleUserSupervisorsOrApprovers = allUsers;
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      firstname: new FormControl('x', [Validators.required]),
      lastname: new FormControl('x', [Validators.required]),
      email: new FormControl('x@x', [Validators.required, Validators.email]),
      jobdescription: new FormControl('x', [Validators.required])
    }, { updateOn: 'submit' });
  }

  goBack() {
    this.userUpdatedNotify();
  }

  createNewUser(event: any) {
    event.preventDefault();
    this.form.updateValueAndValidity();
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
    this.adminService.updateUser(newUser, this.user.id).subscribe(response => {
      this.buttonDisabled = false;
      this.isUserUpdated = true;
    }, error => {
      this.buttonDisabled = false;
      throw error;
    });
  }

  userUpdatedNotify() {
    this.userUpdatedEvent.emit(this.isUserUpdated);
  }
}
