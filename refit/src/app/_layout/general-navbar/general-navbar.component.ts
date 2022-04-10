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
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    dateTimeJoined: new Date(0),
    followings: [],
    profilePicture: []
  }

  profileImage: any;

  date: Date = new Date()
  year: number = 0

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) =>{
      if(user){
        if(user.email !== null){
          this.authStatus = true;
          this.service.getUser(user.email).subscribe(res =>{
            this.user = res;
            if(this.user.profilePicture.length){
              this.profileImage = 'data:image/jpg;base64,' + this.user.profilePicture[0].imageData
            }
          })
        }
      }
      else{
        this.authStatus = false;
      }
    })

    this.year = this.date.getFullYear();
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
  goToSell(){
    this.route.navigate(["/sell"])
  }

  signOut(){
    signOut(this.auth).then(() => {
      this.authStatus = false;
      localStorage.removeItem('LoggedInUserDetails')
      localStorage.removeItem('loggedInUser')
    }).catch((error) => {
      alert(error.message);
    });
  }

}
