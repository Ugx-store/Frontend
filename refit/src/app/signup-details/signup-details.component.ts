import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { newUser } from '../models/newUser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-details',
  templateUrl: './signup-details.component.html',
  styleUrls: ['./signup-details.component.css']
})
export class SignupDetailsComponent implements OnInit {

  constructor() { }

  form: any;
  confirmPassword: any;

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
    this.form = new FormGroup({
      password: new FormControl(this.user.password, [
        Validators.required,
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@$!%*?&])(?=[^A-Z]*[A-Z]).{8,30}$/)
      ])
    })
  }

  OnSubmit(f: NgForm){}

}
