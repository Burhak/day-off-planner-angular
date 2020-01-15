import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatSelectModule,
  MatCheckboxModule,
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule,
  MatIconModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../environments/environment';

import { TokenInterceptor } from './interceptor/token.interceptor';

import {
  BASE_PATH,
  Configuration,
  AuthService as LoginService,
  AdminService,
  UserService,
  LeaveTypeService,
  SettingService, LeaveService
} from './api';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './component/login-form/login-form.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { AdminComponent } from './component/admin/admin.component';
import { AddUserFormComponent } from './component/add-user-form/add-user-form.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { HomeComponent } from './component/home/home.component';
import { ErrorComponent } from './component/error/error.component';

import { AuthGuad } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';

import { AuthService } from './service/auth.service';
import { UserInfoService } from './service/user-info.service';
import { ErrorHandlerService } from './service/error-handler.service';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { UserListComponent } from './component/user-list/user-list.component';
import {MatSortModule} from '@angular/material/sort';
import { DeleteUserDialogComponent } from './component/user-profile/delete-user-dialog/delete-user-dialog.component';
import { UpdateUserComponent } from './component/update-user/update-user.component';
import {AddLeaveTypeComponent} from './component/add-leave-type/add-leave-type.component';
import {LeaveTypesComponent} from './component/leave-types/leave-types.component';
import {LeaveTypeComponent} from './component/leave-type/leave-type.component';
import {DeleteLeaveTypeDialogComponent} from "./component/leave-type/delete-leave-type-dialog/delete-leave-type-dialog.component";
import { SettingsComponent } from './component/settings/settings.component';
import {SettingDialogComponent} from "./component/settings/setting-dialog/setting-dialog.component";
import { AddLeaveRequestComponent } from './component/add-leave-request/add-leave-request.component';
import {MatRangeDatepickerModule, MatRangeNativeDateModule} from 'mat-range-datepicker';
import {SatDatepickerModule, SatNativeDateModule} from "saturn-datepicker";
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    NavigationComponent,
    AdminComponent,
    AddUserFormComponent,
    ErrorComponent,
    ResetPasswordComponent,
    HomeComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    UserListComponent,
    DeleteUserDialogComponent,
    UpdateUserComponent,
    LeaveTypesComponent,
    AddLeaveTypeComponent,
    LeaveTypeComponent,
    DeleteLeaveTypeDialogComponent,
    SettingsComponent,
    SettingDialogComponent,
    AddLeaveRequestComponent
  ],
  entryComponents: [DeleteUserDialogComponent, DeleteLeaveTypeDialogComponent, SettingDialogComponent],
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
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    RouterModule.forRoot([
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuad, AdminGuard]
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
        path: 'error',
        component: ErrorComponent
      },
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuad]
      },
      {
        path: 'resetPassword',
        component: ResetPasswordComponent
      },
      {
        path: 'userProfile',
        component: UserProfileComponent,
        canActivate: [AuthGuad]
      },
      {
        path: 'changePassword',
        component: ChangePasswordComponent,
        canActivate: [AuthGuad]
      },
      {
        path: 'admin/userList',
        component: UserListComponent,
        canActivate: [AuthGuad, AdminGuard]
      },
      {
        path: 'admin/leaveTypes',
        component: LeaveTypesComponent,
        canActivate: [AuthGuad, AdminGuard]
      },
      {
        path: 'admin/addLeaveType',
        component: AddLeaveTypeComponent,
        canActivate: [AuthGuad, AdminGuard]
      },
      {
        path: 'admin/leaveType',
        component: LeaveTypeComponent,
        canActivate: [AuthGuad, AdminGuard]
      },
      {
        path: 'admin/settings',
        component: SettingsComponent,
        canActivate: [AuthGuad, AdminGuard]
      },
      {
        path: 'addLeaveRequest',
        component: AddLeaveRequestComponent,
        canActivate: [AuthGuad]
      }
    ], {onSameUrlNavigation: 'reload'})
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
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    LoginService,
    UserService,
    AdminService,
    AuthService,
    UserInfoService,
    AuthGuad,
    CookieService,
    LeaveTypeService,
    SettingService,
    LeaveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
