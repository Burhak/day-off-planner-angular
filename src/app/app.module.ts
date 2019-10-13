import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatFormFieldModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { BASE_PATH, ApiModule, Configuration, ConfigurationParameters, AuthService as LoginService } from './api';
import { AuthService } from './auth.service';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: NavigationComponent
      },
      {
        path: 'login-form',
        component: LoginFormComponent
      }
    ])
  ],
  providers: [
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
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
