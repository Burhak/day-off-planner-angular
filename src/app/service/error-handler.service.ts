import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserInfoService } from './user-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  private static readonly UNEXPECTED_ERROR = 'An unexpected error has occured';

  constructor(private injector: Injector, private messageService: MessageService) { }

  handleError(error: any) {
    // handle common error
    if (error instanceof HttpErrorResponse) {
      this.messageService.error(this.handleErrorResponse(error));
      return;
    }

    // handle error in promise
    if (error.rejection && error.rejection instanceof HttpErrorResponse) {
      this.messageService.error(this.handleErrorResponse(error.rejection));
      return;
    }
    console.log(error);
    this.messageService.error(ErrorHandlerService.UNEXPECTED_ERROR);
  }

  handleErrorResponse(error: HttpErrorResponse): string {
    const errorMessage: string = (error.error && (error.error.message || error.error.error)) || ErrorHandlerService.UNEXPECTED_ERROR;
    console.error('Status code: ', error.status);
    console.error('Error: ', errorMessage);

    const auth = this.injector.get(UserInfoService);
    const router = this.injector.get(Router);
    const ngZone = this.injector.get(NgZone);

    // specific error status
    switch (error.status) {
      case 401: {
        auth.logout(() => ngZone.run(() => router.navigate(['login'])));
        return 'Session expired';
      }

      case 409: {
        if (window.location.pathname.startsWith('/admin/addLeaveType')) {
          return 'This name is already used';
        }

        if (window.location.pathname.startsWith('/admin/leaveType/')) {
          return 'This name is already used';
        }

        if (window.location.pathname.startsWith('/admin/addUser')) {
          return 'This email is already taken';
        }

        if (window.location.pathname.startsWith('/userProfile')) {
          return 'This email is already taken';
        }

      }
    }

    return errorMessage;
  }
}
