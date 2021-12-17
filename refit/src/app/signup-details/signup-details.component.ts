import {  Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { newUser } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';
import { EmailAuthProvider, getAuth, linkWithCredential } from 'firebase/auth';
import { app } from '../models/firebaseapp';

@Component({
  selector: 'app-signup-details',
  templateUrl: './signup-details.component.html',
  styleUrls: ['./signup-details.component.css']
})
export class SignupDetailsComponent implements OnInit {

  constructor(private service: AppServiceService, public route: Router) { }

  auth: any = getAuth(app);
  form: any;
  confirmPassword: string = '';
  spinner: boolean = false;
  modalTrigger: any;
  error: any;

  user: newUser = {
    id: 0,
    name: '', 
    email: '',
    username: '',
    password: '',
    phoneNumber: localStorage.getItem('refit_phoneNumber') as string,
    receiveEmailConsent: false,
    promoCode: '',
    FacebookLink: '',
    TwitterLink: '',
    InstagramLink: '',
    dateTimeJoined: new Date(0)
  }

  credential: any;

  ngOnInit(): void {
  }

  onCodeChange(code: any){
    this.user.promoCode = code;
    console.log(this.user.promoCode)
  }

  checkBoxClicked(){
    this.user.receiveEmailConsent = true;
  }

  OnSubmit(f: NgForm){
    this.spinner = true

    this.user.dateTimeJoined = new Date();

    this.credential = EmailAuthProvider.credential(this.user.email, this.user.password);

    linkWithCredential(this.auth.currentUser, this.credential)
    .then(userCred => {
      const user = userCred.user;
      localStorage.removeItem('verificationId');
      localStorage.removeItem('refit_phoneNumber');

      this.service.addUser(this.user).then(res =>{
        this.modalTrigger = 1;
        this.spinner = false
      })
    }).catch(error => {
      switch(error.message){
        case "Firebase: Error (auth/provider-already-linked).":
          alert("The account already exists. Please login or use another phone number to create a new account.")
          break
        default:
          alert(error.message)
          break
      }

      this.spinner = false;

      window.location.reload();  
    })
  }

  nextPage(){
    this.route.navigate(['homepage'])
  }

}
