import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, updatePassword } from 'firebase/auth';
import { app } from '../models/firebaseapp';

@Component({
  selector: 'app-password-reset-input',
  templateUrl: './password-reset-input.component.html',
  styleUrls: ['./password-reset-input.component.css']
})
export class PasswordResetInputComponent implements OnInit {

  constructor(public route: Router) { }

  auth: any = getAuth(app)
  user: any = this.auth.currentUser;
  userPassword: string = ''
  confirmPassword: string = '';
  spinner: boolean = false;

  

  ngOnInit(): void {
  }

  OnSubmit(f: NgForm){
    this.spinner = true

    updatePassword(this.user, this.userPassword).then(() => {
      alert("Success")
      // Update successful.
    }).catch((error) => {
      // An error ocurred
      // ...
      alert(error.message)
    });
  }

}
