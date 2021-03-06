import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatFormFieldModule, MatToolbarModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule,
  MatSelectModule, MatCheckboxModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatIconModule, MatDialogModule, MatListModule, MatRadioModule, MatProgressSpinnerModule, MatBadgeModule, MAT_DATE_LOCALE, MatSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ColorPickerModule } from 'ngx-color-picker';

import { DayPilotModule } from 'daypilot-pro-angular';

import { environment } from '../environments/environment';

import { TokenInterceptor } from './interceptor/token.interceptor';

import {
  BASE_PATH, Configuration, AuthService as LoginService, AdminService, UserService, LeaveTypeService, LeaveService, SettingService
} from './api';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './component/login-form/login-form.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { AddUserFormComponent } from './component/add-user-form/add-user-form.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { HomeComponent } from './component/home/home.component';

import { AuthGuad } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';

import { AuthService } from './service/auth.service';
import { UserInfoService } from './service/user-info.service';
import { ErrorHandlerService } from './service/error-handler.service';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { MatSortModule} from '@angular/material/sort';
import { DeleteUserDialogComponent } from './component/user-profile/delete-user-dialog/delete-user-dialog.component';
import { UpdateUserComponent } from './component/update-user/update-user.component';
import { AddLeaveTypeComponent } from './component/add-leave-type/add-leave-type.component';
import { LeaveTypesComponent } from './component/leave-types/leave-types.component';
import { LeaveTypeComponent } from './component/leave-type/leave-type.component';
import { DeleteLeaveTypeDialogComponent } from './component/leave-type/delete-leave-type-dialog/delete-leave-type-dialog.component';
import { SettingsComponent } from './component/settings/settings.component';
import { SettingDialogComponent } from './component/settings/setting-dialog/setting-dialog.component';
import { IndividualLimitsComponent } from './component/individual-limits/individual-limits.component';
import { DialogLimitComponent } from './component/individual-limits/dialog-limit/dialog-limit.component';
import { AddLeaveRequestComponent } from './component/add-leave-request/add-leave-request.component';
import { SatDatepickerModule, SatNativeDateModule, DateAdapter } from 'saturn-datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { CalendarComponent } from './component/calendar/calendar.component';
import { SelectUsersComponent } from './component/calendar/select-users/select-users.component';
import { ApprovingComponent } from './component/approving/approving.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ApprovalsComponent } from './component/approvals/approvals.component';
import { CustomDateAdapter } from './util/date-adapter.util';
import { Platform } from '@angular/cdk/platform';
import { DialogCancelRequestComponent } from './component/home/dialog-cancel-request/dialog-cancel-request.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    NavigationComponent,
    AddUserFormComponent,
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
    AddLeaveRequestComponent,
    CalendarComponent,
    SelectUsersComponent,
    IndividualLimitsComponent,
    DialogLimitComponent,
    ApprovingComponent,
    DashboardComponent,
    ApprovalsComponent,
    DialogCancelRequestComponent
  ],
  entryComponents: [DeleteUserDialogComponent, DeleteLeaveTypeDialogComponent, SettingDialogComponent, SelectUsersComponent, DialogLimitComponent, DialogCancelRequestComponent],
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
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatTabsModule,
    ColorPickerModule,
    DayPilotModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule.forRoot([
      {
        path: 'approve/:id',
        component: ApprovingComponent,
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
      },
      {
        path: 'userProfile',
        component: UserProfileComponent,
        canActivate: [AuthGuad]
      },
      {
        path: 'userProfile/:id',
        component: UserProfileComponent,
        canActivate: [AuthGuad, AdminGuard]
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
        path: 'admin/leaveType/:id',
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
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuad]
      },
      {
        path: '**',
        redirectTo: ''
      }
    ], {onSameUrlNavigation: 'reload'})
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE, Platform] },
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
    LeaveService,
    SettingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
