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

  buttonValue: number = 0;
  followValue: number = 0;

  loggedInUsername: string = '';

  isUserFollowed: boolean= false;
  loggedInUser: boolean = true;

  userFollows: User[] = [];
  LoggedInUserFollows: User[] = [];
  userFollowersProfiles: User[] = [];

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
    if(this.loggedInUser){
      if(this.userFollows.findIndex(item => item.username === username)>= 0){
        return true
      }
      else{
        return false
      }
    }
    else{
      if(this.LoggedInUserFollows.findIndex(item => item.username === username)>= 0){
        return true
      }
      else{
        return false
      }
    }
  }

  followers(){
    this.followValue = 1

    if(this.loggedInUser){
      this.service.getUserFollows(this.user.username).subscribe(res =>{
        this.userFollows = res;
        this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
          this.userFollowersProfiles = res
        })
      })
    }
    else{
      this.service.getUserFollows(this.user.username).subscribe(res =>{
        this.userFollows = res;
        this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
          this.userFollowersProfiles = res
        })
      })

      onAuthStateChanged(this.auth, (user) =>{
        if(user){
          if(user.email){
            this.service.getUser(user.email).subscribe(loggedUser =>{
              this.loggedInUsername = loggedUser.username
              this.service.getUserFollows(loggedUser.username).subscribe(res =>{
                this.LoggedInUserFollows = res;
              })
            })
          }
        }
        else{}
      })
    }
    
  }

  following(){
    this.followValue = 2

    if(!this.loggedInUser){
      onAuthStateChanged(this.auth, (user) =>{
        if(user){
          if(user.email){

            this.service.getUser(user.email).subscribe(loggedUser =>{
              this.loggedInUsername = loggedUser.username
              this.service.getUserFollows(loggedUser.username).subscribe(res =>{
                this.LoggedInUserFollows = res;
              })
            })
          }
        }
        else{}
      })
    }

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
    if(this.loggedInUser){
      onAuthStateChanged(this.auth, (user) =>{
        if (user) {
  
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
    else{
      onAuthStateChanged(this.auth, (user) =>{
        if (user) {
          if(user.email){
            this.service.getUser(user.email).subscribe(res =>{
              this.follow.followedUserId = followedUser.id
              this.follow.followerUserId = res.id
              this.follow.followerName = res.username
  
              this.service.followUser(this.follow).subscribe(data =>{
                this.isUserFollowed = true
  
                this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
                  this.userFollowersProfiles = res
                  for(let i = 0; i < this.userFollowersProfiles.length; i++){
                    if(this.userFollowersProfiles[i].username === followedUser.username){
                      this.LoggedInUserFollows.unshift(this.userFollowersProfiles[i]);
                      this.isUserFollowedOrNot(this.userFollowersProfiles[i].username);
                      break;
                    }
                  }
                })
                
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
    if(this.loggedInUser){
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
    else{
      onAuthStateChanged(this.auth, (user) =>{
        if (user) {
          if(user.email){
            this.service.getUser(user.email).subscribe(res =>{
              for(let i = 0; i < unFollowedUser.followings.length; i++){
                if(unFollowedUser.followings[i].followerName === res.username){
                  this.service.unFollowUser(unFollowedUser.followings[i].id).subscribe(data =>{
                    this.service.getUserFollows(res.username).subscribe(users =>{
                      this.LoggedInUserFollows = users
      
                      this.service.getUserFollowersProfiles(this.user.username).subscribe(profiles =>{
                        this.userFollowersProfiles = profiles
                        this.isUserFollowedOrNot(unFollowedUser.username);
                      })
                    })
  
                  })
                  break
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
  }

  onModalClose(){
    this.service.getUserFollows(this.user.username).subscribe(res =>{
        this.userFollows = res
    })
  }

  gotToProfile(username: string){
    this.route.navigateByUrl(`user-profile/${username}`) 
  }

  editProfile(username: string){
    this.route.navigateByUrl(`edit-profile/${username}`)
  }

}
