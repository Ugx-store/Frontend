import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { CodeComponent } from './code/code.component';
import { SignupDetailsComponent } from './signup-details/signup-details.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from '../environments/environment';
import { NgOtpInputModule } from 'ng-otp-input';


@NgModule({
  declarations: [
    AppComponent,
    PhonenumberComponent,
    CodeComponent,
    SignupDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    NgOtpInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
