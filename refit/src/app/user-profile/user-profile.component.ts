import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { User } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private service: AppServiceService) { }

  buttonValue: number = 0;
  loggedInUser: boolean = true;

  auth: any = getAuth(app);
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
    dateTimeJoined: new Date(0)
  }


  ngOnInit(): void {
    this.buttonValue = 1

    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).then(res =>{
        onAuthStateChanged(this.auth, (user) =>{
          if (user) {
            if(user.phoneNumber === res.phoneNumber){
              this.user = res;
            }
            else{
              this.loggedInUser = false;
              this.user = res;
            }
          } else {
            this.loggedInUser = true;
            this.user = res;
          }
        })
      })
    })
  }

  allButton(){
    this.buttonValue = 1
  }

  sellingButton(){
    this.buttonValue = 2
  }

  soldButton(){
    this.buttonValue = 3
  }

}
