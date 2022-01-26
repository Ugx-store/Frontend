import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { Follow } from '../models/follow';
import { User } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';
import { LoaderService } from '../Loader';
import { DomSanitizer} from '@angular/platform-browser';
import { LooseObject, ProfilePictures } from '../models/profilepic';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  //changeDetection : ChangeDetectionStrategy.OnPush
})

export class UserProfileComponent implements OnInit{

  constructor(private activatedRoute: ActivatedRoute, private service: AppServiceService, 
    private route: Router, public loaderService: LoaderService, private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef) {
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    }

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
    followings: [],
    profilePicture: {
      Id: 0,
      Username: '',
      imageData: []
    }
  }

  follow: Follow = {
    id: 0,
    followerUserId: 0,
    followedUserId: 0,
    followerName: ''
  }

  buttonValue: number = 0;
  followValue: number = 0;
  p: number = 0;

  loggedInUsername: string = '';
  profilePic: string = '';
  

  isUserFollowed: boolean= false;
  loggedInUser: boolean = true;

  userFollows: User[] = [];
  LoggedInUserFollows: User[] = [];
  userFollowersProfiles: User[] = [];
  followerProfilePics: ProfilePictures[] = [];

  isUserFollowedObject: LooseObject = {}
  followerImage: LooseObject = {}

  followedAUserOrNot: boolean = false //Used to check if logged in user has followed someone on the modal

  ngOnInit(): void {
    this.buttonValue = 1

    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).subscribe(res =>{
        this.service.getProfilePicture(param.username).subscribe(data =>{
          if(data){
            this.profilePic = 'data:image/jpg;base64,' + data;
          }
        })

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


  allButton(){
    this.buttonValue = 1
  }

  sellingButton(){
    this.buttonValue = 2
  }

  soldButton(){
    this.buttonValue = 3
  }

  followingImages(userFollowMethod: User[]){
    for(let user of userFollowMethod){
      if(user.profilePicture){
        console.log(user.username + this.p++)
        var key = user.username
        this.followerImage[key] = 'data:image/jpg;base64,' + user.profilePicture.imageData;
      }
    } 
  }

  checkFollowStatus(userFollowMethod: User[], userProfileMethod: User[]){
    for(let user of userProfileMethod){
      if(userFollowMethod.findIndex(item => item.username === user.username)>= 0){
        var key = user.username
        var value = true
        this.isUserFollowedObject[key] = value
      }
      else{
        var key = user.username
        var value = false
        this.isUserFollowedObject[key] = value 
      }
    }
  }

  followers(){
    this.followValue = 1

    if(this.loggedInUser){
      this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
        this.userFollowersProfiles = res

        this.checkFollowStatus(this.userFollows, this.userFollowersProfiles)
        this.followingImages(this.userFollowersProfiles)
      })
    }
    else{
      this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
        this.userFollowersProfiles = res
      })

      onAuthStateChanged(this.auth, (user) =>{
        if(user){
          if(user.email){
            this.service.getUser(user.email).subscribe(loggedUser =>{
              this.loggedInUsername = loggedUser.username
              this.service.getUserFollows(loggedUser.username).subscribe(res =>{
                this.LoggedInUserFollows = res;

                this.checkFollowStatus(this.LoggedInUserFollows, this.userFollowersProfiles)
                this.followingImages(this.userFollowersProfiles)
              })
            })
          }
        }
        else{
          this.LoggedInUserFollows = [];
        }
      })
    }
    
  }

  following(){
    this.followValue = 2
    this.followingImages(this.userFollows)

    if(!this.loggedInUser){
      onAuthStateChanged(this.auth, (user) =>{
        if(user){
          if(user.email){

            this.service.getUser(user.email).subscribe(loggedUser =>{
              this.loggedInUsername = loggedUser.username
              this.service.getUserFollows(loggedUser.username).subscribe(res =>{
                this.LoggedInUserFollows = res;

                this.checkFollowStatus(this.LoggedInUserFollows, this.userFollows)
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
            if(this.userFollows.findIndex(item => item.username === followedUser.username)<0){
              console.log("Logged in user")
              this.follow.followedUserId = followedUser.id
              this.follow.followerUserId = res.id
              this.follow.followerName = res.username

              if(this.follow.followedUserId !== this.follow.followerUserId){
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
              }
            }
          })
        }
        
      } 
      else {
        console.log("Not Logged in user")
        
        alert("Please log in to follow @" + followedUser.username)
        window.location.reload()
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
                  break;
                }
              }
              this.checkFollowStatus(this.userFollows, this.userFollowersProfiles)
              this.followingImages(this.userFollows)
            })
            
          })
          
        } 
        else {
          window.location.reload()
          alert("Please log in to follow @" + followedUser.username)
          window.location.reload()
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
                      break;
                    }
                  }
                  this.checkFollowStatus(this.LoggedInUserFollows, this.userFollowersProfiles)
                })
                
              })
            })
          }
          
        } 
        else {
          alert("Please log in to follow @" + followedUser.username)
          window.location.reload()
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
        alert("Please log in to unfollow @" + followedUser.username)
        window.location.reload()
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
                })
                
              })
              break
            }
          }
          this.checkFollowStatus(this.userFollows, this.userFollowersProfiles)
          this.followingImages(this.userFollows)
        } 
        else {
          alert("Please log in to unfollow @" + unFollowedUser.username)
          window.location.reload()
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
                      })
                    })
  
                  })
                  break
                }
              }
              this.checkFollowStatus(this.LoggedInUserFollows, this.userFollowersProfiles)
            })
          }
          
        } 
        else {
          alert("Please log in to unfollow @" + unFollowedUser.username)
          window.location.reload()
        }
      })
    }
  }
  gotToProfile(username: string){
    this.route.navigateByUrl(`user-profile/${username}`) 
  }

  editProfile(username: string){
    this.route.navigateByUrl(`edit-profile/${username}`)
  }

}
