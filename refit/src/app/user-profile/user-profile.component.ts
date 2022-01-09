import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor() { }

  buttonValue: number = 0;

  ngOnInit(): void {
    this.buttonValue = 1
  }

  allButton(){
    this.buttonValue = 1
  }

  sellingButton(){
    this.buttonValue = 2
  }

  soldButton(){
    this.buttonValue = 3
  }

}
