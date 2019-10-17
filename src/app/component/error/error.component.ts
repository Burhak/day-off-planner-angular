import { Component, OnInit, Injector, ErrorHandler, NgZone } from '@angular/core';
import { ErrorHandlerService } from '../../service/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorMsg: string = '';

  constructor(private errorService: ErrorHandler, private zone: NgZone, private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
      // Instance of should be: 
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  ngOnInit() {
    this.zone.run(() => { this.errorMsg = (<ErrorHandlerService>this.errorService).lastError.message.split('\n')[0]; });
  }
}
