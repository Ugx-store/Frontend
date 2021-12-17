import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(private service: AppServiceService, public route: Router) { }

  auth: any = getAuth(app);
  spinner: boolean = false;
  userEmail: string = '';

  ngOnInit(): void {
  }

  OnSubmit(f: NgForm){
    this.spinner = true

  }

}
