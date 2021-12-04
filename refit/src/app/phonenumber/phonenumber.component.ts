import { Component, OnInit } from '@angular/core';
import "firebase/auth"
import "firebase/firestore"
import { Router } from '@angular/router';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-phonenumber',
  templateUrl: './phonenumber.component.html',
  styleUrls: ['./phonenumber.component.css']
})
export class PhonenumberComponent implements OnInit {

  constructor(private router: Router) { }

  app: any = initializeApp(environment.firebaseConfig)
  phoneNumber: any;
  reCaptchaVerifier: any
  auth: any = getAuth(this.app)

  ngOnInit(): void {
  }

  getOTP(){
    this.reCaptchaVerifier = new RecaptchaVerifier('sign-in-button', 
    {size: 'invisible'},
    this.auth)

    signInWithPhoneNumber(this.auth, this.phoneNumber, this.reCaptchaVerifier)
    .then((confirmationResult) => {
      localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId))
      this.router.navigate(['/code'])
    }).catch((error) => {
      alert(error.message)
      window.location.reload()
    })
  }

}
