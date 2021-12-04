import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeComponent } from './code/code.component';
import { FirebaseComponent } from './firebase/firebase.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { SignupDetailsComponent } from './signup-details/signup-details.component';

const routes: Routes = [
  {path: 'phone', component: PhonenumberComponent},
  {path: 'code', component: CodeComponent},
  {path: 'signup', component: SignupDetailsComponent},
  {path: '', redirectTo:'/path', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
