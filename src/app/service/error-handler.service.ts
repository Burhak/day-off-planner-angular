import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserInfoService } from './user-info.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  private static readonly UNEXPECTED_ERROR = 'An unexpected error has occured';

  private errorMsg = new Subject<any>();
  public errorUpdate$ = this.errorMsg.asObservable();

  private updateMsg(msg: string) {
    this.errorMsg.next(msg);
  }

  constructor(private injector: Injector) { }

  handleError(error: any) {
    // handle common error
    if (error instanceof HttpErrorResponse) {
      this.updateMsg(this.handleErrorResponse(error));
      return;
    }

    // handle error in promise
    if (error.rejection && error.rejection instanceof HttpErrorResponse) {
      this.updateMsg(this.handleErrorResponse(error.rejection));
      return;
    }

    console.error(error);
    this.updateMsg(ErrorHandlerService.UNEXPECTED_ERROR);
  }

  handleErrorResponse(error: HttpErrorResponse): string {
    const errorMessage: string = (error.error && (error.error.message || error.error.error)) || ErrorHandlerService.UNEXPECTED_ERROR;
    console.error('Status code: ', error.status);
    console.error('Error: ', errorMessage);

    // specific error status
    switch (error.status) {
      case 401: {
        const auth = this.injector.get(UserInfoService);
        const router = this.injector.get(Router);
        const ngZone = this.injector.get(NgZone);
        auth.logout(() => ngZone.run(() => router.navigate(['login'])));
        return 'Session expired';
      }
    }

    return ErrorHandlerService.UNEXPECTED_ERROR;
  }
}
