import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { newUser } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-signup-details',
  templateUrl: './signup-details.component.html',
  styleUrls: ['./signup-details.component.css']
})
export class SignupDetailsComponent implements OnInit {

  constructor(private service: AppServiceService, public route: Router) { }

  form: any;
  confirmPassword: string = '';
  spinner: boolean = false;


  user: newUser = {
    id: 0,
    name: '', 
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    receiveEmailConsent: false,
    dateTimeJoined: new Date(0)
  }



  ngOnInit(): void {
  }

  OnSubmit(f: NgForm){
    this.spinner = true

    this.route.navigate([''])
  }

}
