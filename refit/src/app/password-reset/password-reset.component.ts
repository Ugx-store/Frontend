import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../models/firebaseapp';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(public route: Router) { }

  auth: any = getAuth(app);
  spinner: boolean = false;
  userEmail: string = '';

  ngOnInit(): void {
  }

  OnSubmit(f: NgForm){
    this.spinner = true

    sendPasswordResetEmail(this.auth, this.userEmail)
    .then(() => {
      this.spinner = false;

      this.route.navigate(['/passwordResetMessage'])
    })
    .catch((error) => {
      switch(error.message){
        case "Firebase: Error (auth/user-not-found).": 
          alert("We cannot find the provided email. Please try again.")
          break
        case "Firebase: Error (auth/invalid-email).":
          alert("Please input a valid email address.")
          break
        case "Firebase: Error (auth/internal-error).":
          alert("An error has occurred. Please refresh your page and try again.")
          break
        default:
          alert(error.message)
          break
      }

      this.spinner = false;
    });

  }

}
