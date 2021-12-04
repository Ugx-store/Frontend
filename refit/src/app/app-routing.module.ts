import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirebaseComponent } from './firebase/firebase.component';

const routes: Routes = [
  {path: '', component: FirebaseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
