import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../error-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private errorService: ErrorHandlerService) {
  }

  ngOnInit() {
  }

}
