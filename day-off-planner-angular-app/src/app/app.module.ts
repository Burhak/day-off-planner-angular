import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { BASE_PATH, ApiModule, Configuration, ConfigurationParameters, DefaultService } from './api';
import { AuthService } from './auth.service';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    accessToken: 'Bearer '
  }
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
    // ApiModule.forRoot(apiConfigFactory)
  ],
  providers: [
    {
      provide: BASE_PATH,
      useValue: environment.API_BASE_PATH
    },
    {
      provide: Configuration,
      useFactory: (authSvc: AuthService) => new Configuration({accessToken: authSvc.getAccessToken.bind(authSvc)}),
      deps: [AuthService],
      multi: false
    },
    DefaultService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
