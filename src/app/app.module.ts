import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatFormFieldModule, MatToolbarModule, MatSelectModule, MatCheckboxModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { environment } from '../environments/environment';

import { TokenInterceptor } from './interceptor/token.interceptor';

import { BASE_PATH, Configuration, AuthService as LoginService, AdminService, UserService, LeaveTypeService } from './api';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './component/login-form/login-form.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { AdminComponent } from './component/admin/admin.component';
import { AddUserFormComponent } from './component/add-user-form/add-user-form.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { HomeComponent } from './component/home/home.component';

import { AuthGuad } from './guard/auth.guard';

import { AuthService } from './service/auth.service';
import { UserInfoService } from './service/user-info.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    NavigationComponent,
    AdminComponent,
    AddUserFormComponent,
    ResetPasswordComponent,
    HomeComponent
  ],
  imports: [
    MatToolbarModule,
    MatCheckboxModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuad]
      },
      {
        path: 'admin/addUser',
        component: AddUserFormComponent,
        canActivate: [AuthGuad]
      },
      {
        path: 'login',
        component: LoginFormComponent,
      },
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuad]
      },
      {
        path: 'resetPassword',
        component: ResetPasswordComponent
      }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: BASE_PATH,
      useValue: environment.API_BASE_PATH
    },
    {
      provide: Configuration,
      useFactory: (authService: AuthService) => new Configuration({accessToken: authService.getAccessToken.bind(authService)}),
      deps: [AuthService],
      multi: false
    },
    LoginService,
    UserService,
    AdminService,
    AuthService,
    UserInfoService,
    AuthGuad
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
