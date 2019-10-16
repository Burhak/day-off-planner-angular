import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

export interface Option {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})
export class AddUserFormComponent implements OnInit {

  options: Option[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
