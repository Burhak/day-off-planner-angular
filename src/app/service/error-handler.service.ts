import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler{

  private errorMsg = new Subject<any>();
  public errorUpdate$ = this.errorMsg.asObservable();

  private updateMsg(msg: string) {
    this.errorMsg.next(msg);
  }

  constructor(private injector: Injector) { }

  handleError(error: any) {
    //const router = this.injector.get(Router);
    const auth = this.injector.get(AuthService);
    //const ngZone = this.injector.get(NgZone);

    let errorMsg: string = error.message;

    if (error instanceof HttpErrorResponse) {

      console.error('Backend returned status code: ', error.status);
      console.error('Response body: ', error.message);

      //Specific error status
      switch (error.status) {
        case 401: {
          auth.removeToken();
          errorMsg = '401: Invalid credentials'
          //ngZone.run(() => router.navigate(['error']));
          break;
        }
        case 403: {
          //errorMsg = '403: No admin rights'
          break;
        }
      }

    } else {
      console.error('An error occurred: ', (<Error>error).message);
    }

    this.updateMsg(errorMsg);
    //ngZone.run(() => router.navigate(['error']));
  }
}
