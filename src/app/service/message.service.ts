import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private snackBar: MatSnackBar, private ngZone: NgZone) { }

  public info(msg: string) {
    this.ngZone.run(() => this.snackBar.open(msg, 'Dismiss', { duration: 3000, panelClass: ['mat-toolbar', 'mat-primary'] }));
  }

  public error(msg: string) {
    this.ngZone.run(() => this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] }));
  }
}
