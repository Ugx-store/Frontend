import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { newUser } from '../models/newUser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-signup-details',
  templateUrl: './signup-details.component.html',
  styleUrls: ['./signup-details.component.css']
})
export class SignupDetailsComponent implements OnInit {

  constructor(private service: AppServiceService) { }

  form: any;
  confirmPassword: string = '';
  usernameChecker: string = '';


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

  onUsernameChange(username: any){
    this.user.username = username;
  }

  usernameCheckUnique(){
    console.log(this.user.username)
    this.service.checkUsername(this.user.username).then(res => {
      console.log(res);
      if(res === 1){
        this.usernameChecker = "Username already taken";
      }
      else{
        this.usernameChecker = '';
      }
    })
  }

  OnSubmit(f: NgForm){}

}
