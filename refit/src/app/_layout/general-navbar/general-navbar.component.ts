import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from 'src/app/models/firebaseapp';

@Component({
  selector: 'app-general-navbar',
  templateUrl: './general-navbar.component.html',
  styleUrls: ['./general-navbar.component.css']
})
export class GeneralNavbarComponent implements OnInit {

  constructor(private route: Router) { }

  ladyCats: string[]= ["Dresses", "Tops", "Accessories", "Lingerie", "Shoes", "Skirts", "Pants", "Jackets", "Others"]
  menCats: string[] = ["Jackets", "Shirts", "Pants", "Underwear", "Shoes", "Accessories", "Others"]
  jewelry: string[] = ["Necklaces", "Pins", "Bracelets", "Earrings", "Rings", "Watches", "Others"]
  beauty: string[] = ["Make up", "Fragrance", "Skin care", "Hair", "Other"]
  kids: string[] = ["Girls", "Boys"]
  rentals: string[] = ["Ladies", "Men"]

  authStatus: boolean = false;

  auth: any = getAuth(app);
  user: any = this.auth.currentUser;
  userName: string = "";

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) =>{
      if(user !== null){
        this.authStatus = true;
        console.log("signed in")
        const userId = user.phoneNumber
        console.log(userId)
      }
      else{
        this.authStatus = false;
        console.log("Not signed in")
      }
    })
  
  }

  checkAuthStatus(): boolean{
    return this.authStatus;
  }
  

  goToLogin(){
    this.route.navigate(["/login"])
  }

  goToSignup(){
    this.route.navigate(["/phone"])
  }

  signOut(){
    signOut(this.auth).then(() => {
      this.authStatus = false;
    }).catch((error) => {
      alert(error.message);
    });
  }

}
