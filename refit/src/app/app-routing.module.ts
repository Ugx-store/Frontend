import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CodeComponent } from './code/code.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { SignupDetailsComponent } from './signup-details/signup-details.component';
import { TcsDisplayComponent } from './tcs-display/tcs-display.component';

const routes: Routes = [
  {path: 'phone', component: PhonenumberComponent},
  {path: 'code', component: CodeComponent, canActivate: [AuthGuard]},
  {path: 'signup', component: SignupDetailsComponent, canActivate: [AuthGuard]},
  {path: 'tcsdisplay', component: TcsDisplayComponent, canActivate: [AuthGuard]},
  {path: 'homepage', component: HomepageComponent},
  {path: '', redirectTo:'/phone', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
