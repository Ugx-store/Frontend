import { Component, OnInit } from '@angular/core';
import "firebase/auth"
import "firebase/firestore"
import { Router } from '@angular/router';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { AppServiceService } from '../services/app-service.service';
import { User } from '../models/newUser';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  constructor(private router: Router, private service: AppServiceService) { }

  app: any = initializeApp(environment.firebaseConfig);
  otp!: string;
  spinner: boolean = false;
  phoneNumber: any = localStorage.getItem('refit_phoneNumber' || '{}')
  verify: any;
  auth: any = getAuth(this.app);

  user: User = {
    id: 0,
    name: '', 
    username: '',
    password: '',
    email: '',
    bio: '',
    phoneNumber: '',
    receiveEmailConsent: false,
    promoCode: '',
    FacebookLink: '',
    TwitterLink: '',
    InstagramLink: '',
    dateTimeJoined: new Date(0),
    followings: [],
    profilePicture: {
      Id: 0,
      Username: '',
      imageData: []
    }
  }

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

  ngOnInit(): void {
    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}')
  }

  onOtpChange(otpCode: any){
    this.otp = otpCode;
  }

  handleClick() {
    this.spinner = true

    var credentials = PhoneAuthProvider.credential(this.verify, this.otp);
    signInWithCredential(this.auth, credentials).then((response) => {

      this.spinner = false

      this.router.navigate(['/signup'])

    }).catch((error) =>{
      switch(error.message){
        case "Firebase: Error (auth/code-expired).": 
          alert("This code has expired. Please re-enter your phone number for a new code.")
          break
        case "Firebase: Error (auth/invalid-verification-code).":
          alert("Invalid code. Please check your messages for a valid one.") 
          break
        default:
          alert(error.message)
          break
      }
      window.location.reload();
    })
  }

  returnToPhone(){
    this.router.navigate(['/phone'])
  }

}
