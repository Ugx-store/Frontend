import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CodeComponent } from './code/code.component';
import { GeneralNavbarComponent } from './_layout/general-navbar/general-navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetInputComponent } from './password-reset-input/password-reset-input.component';
import { PasswordResetMessageComponent } from './password-reset-message/password-reset-message.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { SignupDetailsComponent } from './signup-details/signup-details.component';
import { TcsDisplayComponent } from './tcs-display/tcs-display.component';
import { GeneralLayoutComponent } from './_layout/general-layout/general-layout.component';
import { SignupLayoutComponent } from './_layout/signup-layout/signup-layout.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SellPageComponent } from './sell-page/sell-page.component';
import { CountdownComponent } from './countdown/countdown.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralLayoutComponent,
    children: [
      {path: '', redirectTo:'/homepage', pathMatch: 'full'},
      {path: 'homepage', component: HomepageComponent},
      {path: 'login', component: LoginComponent},
      {path: 'passwordReset', component: PasswordResetComponent},
      {path: 'passwordResetMessage', component: PasswordResetMessageComponent},
      {path: 'passwordResetInput', component: PasswordResetInputComponent},
      {path: 'user-profile/:username', component: UserProfileComponent},
      {path: 'edit-profile/:username', component: EditProfileComponent},
      {path: 'sell', component: SellPageComponent},
      {path: 'counter', component: CountdownComponent}
    ]
  },
  {
    path: '',
    component: SignupLayoutComponent,
    children: [
      {path: 'phone', component: PhonenumberComponent},
      {path: 'code', component: CodeComponent, canActivate: [AuthGuard]},
      {path: 'signup', component: SignupDetailsComponent, canActivate: [AuthGuard]},
      {path: 'tcsDisplay', component: TcsDisplayComponent}
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {onSameUrlNavigation: 'reload'}
    )],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
