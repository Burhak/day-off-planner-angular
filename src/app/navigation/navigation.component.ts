import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserInfoService } from '../user-info.service';
import { UserApiModel } from '../api';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private auth: AuthService, private userService: UserInfoService) { }


  ngOnInit() {
  }

}
