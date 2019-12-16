import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/service/user-info.service';
import {AuthService} from "../../api";
import {Router} from "@angular/router";



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public userService: UserInfoService, public authService: AuthService, public router: Router) { }


  ngOnInit() {

  }

  logOut() {
    this.authService.logoutUser().subscribe(
      response => {
        this.userService.logout(() => this.router.navigate(['login']));
      }, error => {
        throw error;
      }
    );
  }

  openUserProfile() {
    this.router.navigate(['userProfile'], { state: { userId: this.userService.currentUser.id } });
  }

}
