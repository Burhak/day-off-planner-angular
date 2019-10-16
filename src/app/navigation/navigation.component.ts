import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private userService: UserInfoService) { }


  ngOnInit() {

  }

  logOut() {
    this.userService.removeToken();
    this.userService.removeUser();
  }

}
