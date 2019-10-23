import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler{

  private error: Error;

  get lastError(): Error {
    return this.error;
  }

  constructor(private injector: Injector) { }

  handleError(error: any) {
    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      console.error('Backend returned status code: ', error.status);
      console.error('Response body: ', error.message);
    } else {
      console.error('An error occurred: ', (<Error>error).message);
    }

    this.error = error;
    router.navigate(['error']);
  }
}