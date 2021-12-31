import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { CodeComponent } from './code/code.component';
import { SignupDetailsComponent } from './signup-details/signup-details.component';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { NgOtpInputModule } from 'ng-otp-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupNavbarComponent } from './_layout/signup-navbar/signup-navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AsyncValidatorDirective } from './directives/async-validator.directive';
import { TcsDisplayComponent } from './tcs-display/tcs-display.component';
import { AuthGuard } from './auth.guard';
import { EmailValidatorDirective } from './directives/email-validator.directive';
import { PromoCodeValidatorDirective } from './directives/promo-code-validator.directive';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetMessageComponent } from './password-reset-message/password-reset-message.component';
import { PasswordResetInputComponent } from './password-reset-input/password-reset-input.component';
import { GeneralNavbarComponent } from './_layout/general-navbar/general-navbar.component';
import { GeneralLayoutComponent } from './_layout/general-layout/general-layout.component';
import { SignupLayoutComponent } from './_layout/signup-layout/signup-layout.component';
import { GeneralFooterComponent } from './_layout/general-footer/general-footer.component';


@NgModule({
  declarations: [
    AppComponent,
    PhonenumberComponent,
    CodeComponent,
    SignupDetailsComponent,
    SignupNavbarComponent,
    AsyncValidatorDirective,
    TcsDisplayComponent,
    EmailValidatorDirective,
    PromoCodeValidatorDirective,
    HomepageComponent,
    LoginComponent,
    PasswordResetComponent,
    PasswordResetMessageComponent,
    PasswordResetInputComponent,
    GeneralNavbarComponent,
    GeneralLayoutComponent,
    SignupLayoutComponent,
    GeneralFooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
		ReactiveFormsModule,
    NgOtpInputModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
