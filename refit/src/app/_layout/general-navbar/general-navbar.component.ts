import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from 'src/app/models/firebaseapp';
import { User } from 'src/app/models/newUser';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-general-navbar',
  templateUrl: './general-navbar.component.html',
  styleUrls: ['./general-navbar.component.css']
})
export class GeneralNavbarComponent implements OnInit {

  constructor(private route: Router, private service: AppServiceService) { }

  ladyCats: string[]= ["Dresses", "Tops", "Accessories", "Lingerie", "Shoes", "Skirts", "Pants", "Jackets", "Others"]
  menCats: string[] = ["Jackets", "Shirts", "Pants", "Underwear", "Shoes", "Accessories", "Others"]
  jewelry: string[] = ["Necklaces", "Pins", "Bracelets", "Earrings", "Rings", "Watches", "Others"]
  beauty: string[] = ["Make up", "Fragrance", "Skin care", "Hair", "Other"]
  kids: string[] = ["Girls", "Boys"]
  rentals: string[] = ["Ladies", "Men"]

  authStatus: boolean = false;

  auth: any = getAuth(app);
  userName: string = "";

  user: User = {
    id: 0,
    name: '', 
    email: '',
    username: '',
    password: '',
    bio: '',
    phoneNumber: '',
    receiveEmailConsent: false,
    promoCode: '',
    FacebookLink: '',
    TwitterLink: '',
    InstagramLink: '',
    dateTimeJoined: new Date(0),
    followings: []
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) =>{
      if(user){
        if(user.email !== null){
          this.authStatus = true;
          this.service.getUser(user.email).then(res =>{
            this.user = res;
            console.log(this.user.username)
          })
        }
      }
      else{
        this.authStatus = false;
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

  gotToProfile(username: string){
    this.route.navigateByUrl(`user-profile/${username}`) 
  }

  signOut(){
    signOut(this.auth).then(() => {
      this.authStatus = false;
    }).catch((error) => {
      alert(error.message);
    });
  }

}
