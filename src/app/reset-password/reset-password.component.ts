import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private form: FormGroup;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    }, {updateOn: 'submit'});
  }

  goBack() {
      this.router.navigate(['login']);
  }

  resetPassword(event) {
    event.preventDefault();
    if (!this.form.valid) {
      console.log(this.form.valid);
      return;
    }
    const newPassword: any = {
      email: event.target.email.value
    };

    this.userService.resetPassword(newPassword).subscribe(
      response => {
        console.log(response);
      }
    );
  }

}
