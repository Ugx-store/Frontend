import { Component, OnInit } from '@angular/core';
import "firebase/auth"
import "firebase/firestore"
import { Router } from '@angular/router';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { app } from '../models/firebaseapp';
import { AppServiceService } from '../services/app-service.service';


@Component({
  selector: 'app-phonenumber',
  templateUrl: './phonenumber.component.html',
  styleUrls: ['./phonenumber.component.css']
})
export class PhonenumberComponent implements OnInit {

  constructor(private router: Router, private service: AppServiceService) { }

  phoneNumber: any; 
  reCaptchaVerifier: any
  auth: any = getAuth(app)
  spinner: boolean = false;
  userPhone: number = 1;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Uganda]
	phoneForm = new FormGroup({
		phone: new FormControl(undefined, [Validators.required])
	});

  ngOnInit(): void {
  }

  signInUser(){
    this.reCaptchaVerifier = new RecaptchaVerifier('sign-in-button', 
      {size: 'invisible'}, this.auth)

      signInWithPhoneNumber(this.auth, this.phoneNumber.e164Number, this.reCaptchaVerifier)
      .then((confirmationResult) => {
        localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId))

        this.reCaptchaVerifier.clear();

        this.router.navigate(['/code'])
      }).catch((error) => {
        alert(error.message)

        window.location.reload()
      })
  }

  getOTP(){
    this.spinner = true;
    
    this.reCaptchaVerifier = new RecaptchaVerifier('sign-in-button', 
    {size: 'invisible'}, this.auth)

    signInWithPhoneNumber(this.auth, this.phoneNumber.e164Number, this.reCaptchaVerifier)
    .then((confirmationResult) => {
      localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId))

      localStorage.removeItem('refit_phoneNumber')
      localStorage.setItem('refit_phoneNumber', this.phoneNumber.e164Number)
      
      this.reCaptchaVerifier.clear();

      this.spinner = false;

      this.router.navigate(['/code'])
    }).catch((error) => {
      switch(error.message){
        case "Firebase: Error (auth/internal-error).":
          alert("An error has occurred. Please refresh your page and try again.")
          break
        default:
          alert(error.message)
          break
      }

      this.spinner = false;
      
      window.location.reload()
      })

  }

}
