import { Component, OnInit } from '@angular/core';
import "firebase/auth"
import "firebase/firestore"
import { Router } from '@angular/router';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  constructor(private router: Router) { }

  app: any = initializeApp(environment.firebaseConfig);
  otp!: string;
  phoneNumber: any = localStorage.getItem('phonenumber' || '{}')
  verify: any;
  auth: any = getAuth(this.app);

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
    console.log(this.verify)
  }

  onOtpChange(otpCode: any){
    this.otp = otpCode;
    console.log(this.otp)
  }

  handleClick() {
    var credentials = PhoneAuthProvider.credential(this.verify, this.otp);
    signInWithCredential(this.auth, credentials).then((response) => {
      localStorage.setItem('user_data', JSON.stringify(response))
      this.router.navigate(['/signup'])
    }).catch((error) =>{
      alert(error.message)
    })
  }

  returnToPhone(){
    this.router.navigate(['/phone'])
  }

}
