import { Component, OnInit, Injector, ErrorHandler, NgZone } from '@angular/core';
import { ErrorHandlerService } from '../../service/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public errorMsg: string = '';
  public errorShown = false;

  constructor(private errorService: ErrorHandler, private ngZone: NgZone) {
  }

  ngOnInit() {
    (<ErrorHandlerService>this.errorService).errorUpdate$.subscribe((msg) => this.updateMsg(msg));
  }

  private updateMsg(msg: string) {
    this.ngZone.run(() => {
      this.errorMsg = msg.split('\n')[0];
      this.errorShown = true;
    })
  }

  public clearMsg() {
    this.errorMsg = '';
    this.errorShown = false;
  }
}
