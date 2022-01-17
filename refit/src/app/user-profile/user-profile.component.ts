import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { Follow } from '../models/follow';
import { User } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';
import { Location } from '@angular/common';
import { LoaderService } from '../Loader';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute, private service: AppServiceService, 
    private route: Router, public loaderService: LoaderService) { }

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

  followingCountChanged: boolean = false;

  followedAUserOrNot: boolean = false //Used to check if logged in user has followed someone on the modal

  ngOnInit(): void {
    this.buttonValue = 1

    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).subscribe(res =>{
        onAuthStateChanged(this.auth, (user) =>{
          if (user) {
            if(user.phoneNumber === res.phoneNumber){
              this.loggedInUser = true;
              this.user = res;
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
          }
        })

        this.service.getUserFollows(param.username).subscribe(res =>{
          this.userFollows = res;
        })
      })
    })
  }

  ngOnDestroy() {
    this.userFollows = []
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

  isUserFollowedOrNot(username: string): boolean{
    if(this.userFollows.findIndex(item => item.username === username)>= 0){
      this.isUserFollowed = true
    }
    else{
      this.isUserFollowed = false
    }

    return this.isUserFollowed
  }

  followers(){
    onAuthStateChanged
    this.followValue = 1

    this.service.getUserFollows(this.user.username).subscribe(res =>{
      this.userFollows = res;
      this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
        this.userFollowersProfiles = res
      })
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
          if(user.email){
            this.service.getUserFollows(user.email).subscribe(loggedUser =>{
              for(let i = 0; i < this.userFollows.length; i++){
                if(loggedUser.findIndex(item => item.username === this.userFollows[i].username)>=0){
                  this.isUserFollowed = true;
                }
                else{
                  this.isUserFollowed = false
                }
              }
            })
          }
        }
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

              //Check if the user whose profile we are viewing is the user who has been followed
              if(this.user.username === followedUser.username){
                this.service.getUser(followedUser.username).subscribe(loggedUser =>{
                  this.user = loggedUser
                })
              }
              else{
                this.service.getUser(this.user.username).subscribe(loggedUser =>{
                  this.user = loggedUser
                })
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

  followUserInModal(followedUser: User){
    onAuthStateChanged(this.auth, (user) =>{
      if (user) {
        console.log(followedUser);

        this.follow.followedUserId = followedUser.id
        this.follow.followerUserId = this.user.id
        this.follow.followerName = this.user.username

        this.service.followUser(this.follow).subscribe(data =>{
          this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
            this.userFollowersProfiles = res
            for(let i = 0; i < this.userFollowersProfiles.length; i++){
              if(this.userFollowersProfiles[i].username === followedUser.username){
                this.userFollows.unshift(this.userFollowersProfiles[i]);
                this.isUserFollowedOrNot(this.userFollowersProfiles[i].username);
                break;
              }
            }
          })
          
        })
        
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
            for(let i = 0; i < followedUser.followings.length; i++){
              if(followedUser.followings[i].followerName === res.username){
                this.service.unFollowUser(followedUser.followings[i].id).subscribe(data =>{
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
                  }

                })
              }
            }
          })
        }
        
      } 
      else {
        this.route.navigate(['/login'])
      }
    })
  }

  unFollowUserInModal(unFollowedUser: User){
    onAuthStateChanged(this.auth, (user) =>{
      if (user) {

        for(let j = 0; j < unFollowedUser.followings.length; j++){
          if(unFollowedUser.followings[j].followerName === this.user.username){
            this.service.unFollowUser(unFollowedUser.followings[j].id).subscribe(data =>{
              this.service.getUserFollows(this.user.username).subscribe(res =>{
                this.userFollows = res

                this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
                  this.userFollowersProfiles = res
  
                  this.isUserFollowedOrNot(unFollowedUser.username);
                })
              })
              
            })
            break
          }
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
