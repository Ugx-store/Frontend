import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { newUser } from '../models/newUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public route: Router) { }

  auth: any = getAuth(app);
  spinner: boolean = false;
  wrongCredentials: boolean = false;

  user: newUser = {
    id: 0,
    name: '', 
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    receiveEmailConsent: false,
    promoCode: '',
    FacebookLink: '',
    TwitterLink: '',
    InstagramLink: '',
    dateTimeJoined: new Date(0)
  }

  ngOnInit(): void {
  }

  OnSubmit(f: NgForm){
    this.spinner = true

    signInWithEmailAndPassword(this.auth, this.user.email, this.user.password)
    .then((userCredential) => {
      // Signed in 
      this.spinner = false;

      this.route.navigate(['/homepage'])
    })
    .catch((error) => {
      this.wrongCredentials = true;
      this.spinner = false;
    });
  }

  gotoSignup(){
    this.route.navigate(['/phone'])
  }

  forgotPassword(){
    this.route.navigate(['/passwordReset'])
  }

}
