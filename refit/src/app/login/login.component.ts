import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { User } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public route: Router, private service: AppServiceService) { 
  }

  auth: any = getAuth(app);
  spinner: boolean = false;
  wrongCredentials: boolean = false;

  user: User = {
    id: 0,
    name: '', 
    email: '',
    username: '',
    bio: '',
    password: '',
    phoneNumber: '',
    profileVisits: 0,
    receiveEmailConsent: false,
    promoCode: '',
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    dateTimeJoined: new Date(0),
    followings: [],
    profilePicture: []
  }

  ngOnInit(): void {
  }

  OnSubmit(f: NgForm){
    this.spinner = true

    this.service.getUser(this.user.email).subscribe(loggedUser =>
      {
        signInWithEmailAndPassword(this.auth, loggedUser.email, this.user.password)
        .then((userCredential) => {
          // Signed in 
          this.spinner = false;
          localStorage.setItem('LoggedInUserDetails', JSON.stringify(userCredential.user))
          localStorage.setItem('loggedInUser', loggedUser.username)
          this.route.navigate(['/homepage'])
        })
        .catch((error) => {
          this.wrongCredentials = true;
          this.spinner = false;
        });
      },
      (err) =>{
        this.wrongCredentials = true;
        this.spinner = false;
      })
  }

  gotoSignup(){
    this.route.navigate(['/phone'])
  }

  forgotPassword(){
    this.route.navigate(['/passwordReset'])
  }

}
