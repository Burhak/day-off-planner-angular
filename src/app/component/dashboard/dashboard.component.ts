import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/api';
import { UserInfoService } from 'src/app/service/user-info.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public isApprover = false;

  constructor(public userService: UserInfoService, private userApi: UserService) {
    this.userService.currentUserPromise.then(user => {
      this.userApi.isApprover(user.id).subscribe(response => this.isApprover = response);
    });
  }

  ngOnInit() {
  }

}
