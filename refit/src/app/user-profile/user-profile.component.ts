import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { Follow } from '../models/follow';
import { User } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private service: AppServiceService, private route: Router, private location: Location) { }

  buttonValue: number = 0;
  followValue: number = 0;
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
  userFollows: User[] = [];

  userFollowersProfiles: User[] = [];

  placeHolder: boolean = true;

  followingCountChanged: boolean = false;

  ngOnInit(): void {
    this.buttonValue = 1
    this.placeHolder = true;

    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).subscribe(res =>{
        onAuthStateChanged(this.auth, (user) =>{
          if (user) {
            if(user.phoneNumber === res.phoneNumber){
              this.loggedInUser = true;
              this.user = res;
              this.placeHolder = false;
            }
            else{
              this.loggedInUser = false;
              this.user = res;
              console.log(this.user)

              if(user.email){
                this.service.getUser(user.email).subscribe(loggedUser =>{
                  for(let i = 0; i < this.user.followings?.length; i++){
                    if(this.user.followings[i].followerName == loggedUser.username){
                      this.isUserFollowed = true
                      this.placeHolder = false;
                      break
                    }
                  }
                })
              }

            }
          } 
          else {
            this.loggedInUser = false;
            this.isUserFollowed = false
            this.user = res;
            this.placeHolder = false;
          }
        })

        this.placeHolder = true;

        this.service.getUserFollows(param.username).subscribe(res =>{
          this.userFollows = res;
          this.placeHolder = false;
        })
      })
    })

    this.placeHolder = true;
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

  followers(){
    this.followValue = 1
    
    this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
      this.userFollowersProfiles = res
      for(let i = 0; i< res.length; i++){
        if(this.userFollows.findIndex(item => item.username === res[i].username)>= 0){
          this.isUserFollowed = true
        }
        else{
          this.isUserFollowed = false
        }
      }
      this.placeHolder = false;
    })
  }

  following(){
    this.followValue = 2
    //To make all buttons in the following section of the modal have the value 'Following'
    onAuthStateChanged(this.auth, (user) =>{
      if (user) {
        if(user.phoneNumber === this.user.phoneNumber){
          this.isUserFollowed = true;
        }
        else{
          this.isUserFollowed = false;
        }
        this.placeHolder = false;
      }
    })
  }

  followUser(followedUser: User){
    onAuthStateChanged(this.auth, (user) =>{
      if (user) {
        if(user.email){
          this.service.getUser(user.email).subscribe(res =>{
            this.follow.followedUserId = followedUser.id
            this.follow.followerUserId = res.id
            this.follow.followerName = res.username

            this.service.followUser(this.follow).subscribe(data =>{
              this.isUserFollowed = true

              //Check if the user who profile we are viewing is the user who has been followed
              if(this.user.username === followedUser.username){
                this.service.getUser(followedUser.username).subscribe(loggedUser =>{
                  this.user = loggedUser
                })
              }
              else{
                this.service.getUser(this.user.username).subscribe(loggedUser =>{
                  this.user = loggedUser
                })
                this.followingCountChanged = true;
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

  unFollowUser(followedUser: User){
    onAuthStateChanged(this.auth, (user) =>{
      if (user) {
        if(user.email){
          this.service.getUser(user.email).subscribe(res =>{
            this.service.getUser(followedUser.username).subscribe(returnedUser =>{
              for(let i = 0; i < returnedUser.followings.length; i++){
                if(returnedUser.followings[i].followerName === res.username){
                  this.service.unFollowUser(returnedUser.followings[i].id).subscribe(data =>{
                    this.isUserFollowed = false

                    if(this.user.username === followedUser.username){
                      this.service.getUser(followedUser.username).subscribe(loggedUser =>{
                        this.user = loggedUser
                      })
                    }
                    else{
                      this.service.getUser(this.user.username).subscribe(loggedUser =>{
                        this.user = loggedUser
                      })
                      this.followingCountChanged = true;
                    }

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

  onModalClose(){
    this.service.getUserFollows(this.user.username).subscribe(res =>{
        this.userFollows = res
      })
  }

}
