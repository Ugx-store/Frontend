import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeComponent } from './code/code.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { SignupDetailsComponent } from './signup-details/signup-details.component';
import { TcsDisplayComponent } from './tcs-display/tcs-display.component';

const routes: Routes = [
  {path: 'phone', component: PhonenumberComponent},
  {path: 'code', component: CodeComponent},
  {path: 'signup', component: SignupDetailsComponent},
  {path: 'tcsdisplay', component: TcsDisplayComponent},
  {path: '', redirectTo:'/phone', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
