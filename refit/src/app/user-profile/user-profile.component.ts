import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { Follow } from '../models/follow';
import { User } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private service: AppServiceService, private route: Router) { }

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
    dateTimeJoined: new Date(0),
    followings: []
  }

  follow: Follow = {
    id: 0,
    followerUserId: 0,
    followedUserId: 0,
    followerName: ''
  }

  isUserFollowed: boolean= false;


  ngOnInit(): void {
    this.buttonValue = 1

    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).then(res =>{
        onAuthStateChanged(this.auth, (user) =>{
          if (user) {
            if(user.phoneNumber === res.phoneNumber){
              this.loggedInUser = true;
              this.user = res;
            }
            else{
              this.loggedInUser = false;
              this.user = res;

              if(user.email){
                this.service.getUser(user.email).then(loggedUser =>{
                  for(let i = 0; i < this.user.followings?.length; i++){
                    if(this.user.followings[i].followerName == loggedUser.username){
                      this.isUserFollowed = true
                      break
                    }
                  }
                })
              }

            }
          } else {
            this.loggedInUser = false;
            this.isUserFollowed = false
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

  followUser(followedUser: User){
    onAuthStateChanged(this.auth, (user) =>{
      if (user) {
        if(user.email){
          this.service.getUser(user.email).then(res =>{
            this.follow.followedUserId = followedUser.id
            this.follow.followerUserId = res.id
            this.follow.followerName = res.username

            this.service.followUser(this.follow).subscribe(data =>{
              this.isUserFollowed = true
            })
          })
        }
        
      } 
      else {
        this.route.navigate(['/login'])
      }
    })
  }

  unFollowUser(followedUser: User){
    onAuthStateChanged(this.auth, (user) =>{
      if (user) {
        if(user.email){
          this.service.getUser(user.email).then(res =>{
            this.service.getUser(followedUser.username).then(returnedUser =>{
              for(let i = 0; i < returnedUser.followings.length; i++){
                if(returnedUser.followings[i].followerName === res.username){
                  this.service.unFollowUser(returnedUser.followings[i].id).subscribe(data =>{
                    this.isUserFollowed = false
                  })
                }
              }
            })
          })
        }
        
      } 
      else {
        this.route.navigate(['/login'])
      }
    })
  }

}
