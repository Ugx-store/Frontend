import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { confirmPasswordReset, getAuth, updatePassword, verifyPasswordResetCode } from 'firebase/auth';
import { app } from '../models/firebaseapp';

@Component({
  selector: 'app-password-reset-input',
  templateUrl: './password-reset-input.component.html',
  styleUrls: ['./password-reset-input.component.css']
})
export class PasswordResetInputComponent implements OnInit {

  constructor(public route: Router, public activatedRoute: ActivatedRoute) { }

  auth: any = getAuth(app)
  user: any = this.auth.currentUser;
  userPassword: string = ''
  confirmPassword: string = '';
  spinner: boolean = false;
  code: any;

  

  ngOnInit(): void {
    this.code = this.activatedRoute.snapshot.queryParams['oobCode']
  }

  OnSubmit(f: NgForm){
    this.spinner = true

    verifyPasswordResetCode(this.auth, this.code).then(email => {
      confirmPasswordReset(this.auth, this.code, this.userPassword).then(res =>{
        alert("Password successfully changed. Now you can login with the new password")
        this.route.navigate(['/login'])
      }).catch(error => {
        alert(error.message)
      })
    }).catch(error => {
      alert(error.message)
    })
  }

}
