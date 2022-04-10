import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../models/firebaseapp';
import { Follow } from '../models/follow';
import { User } from '../models/newUser';
import { AppServiceService } from '../services/app-service.service';
import { LoaderService } from '../Loader';
import { DomSanitizer} from '@angular/platform-browser';
import { LooseObject, ProfilePictures } from '../models/profilepic';
import { LikesChecker, Product } from '../models/product';
import { Like } from '../models/like';

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
  currentLoggedInUser: any;
  LoginStatus: any;

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

  products: Product[] = []

  like: Like = {
    id: 0,
    productId: 0,
    likerName: ''
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
  modalUserName: string = '';
  

  isUserFollowed: boolean= false;
  loggedInUser: boolean = true;
  authFlag: boolean = true;
  showModalBox: boolean = false;

  userFollows: User[] = [];
  LoggedInUserFollows: User[] = [];
  userFollowersProfiles: User[] = [];
  followerProfilePics: ProfilePictures[] = [];

  isUserFollowedObject: LooseObject = {}
  followerImage: LooseObject = {}

  isProductLiked: LikesChecker = {}

  followedAUserOrNot: boolean = false //Used to check if logged in user has followed someone on the modal

  @ViewChild('content') content: any;

  ngOnInit(): void {
    this.buttonValue = 1

    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).subscribe(res =>{
        this.loggedInUsername = res.username
        if(res.profilePicture.length){
          this.profilePic = 'data:image/jpg;base64,' + res.profilePicture[0].imageData
        }

        this.service.getUserProducts(res.username).subscribe(prod =>{
          this.products = prod
          console.log(this.products)
          if(this.products){
            for(let product of this.products){
              if(product.productImages.length){
                for(let image of product.productImages){
                  image.imageData = 'data:image/jpg;base64,' + image.imageData
                }
              }

              this.checkLikeStatus(res.username, product)
            }
          }
        })

        onAuthStateChanged(this.auth, (user) =>{
          if (user && this.authFlag) {
            if(user.phoneNumber === res.phoneNumber){
              this.loggedInUser = true;
              this.user = res;
            }
            else{
              this.loggedInUser = false;
              this.user = res;
              this.LoginStatus = this.getLoggedInUser();

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
            this.LoginStatus = null 
          }
        })

        this.service.getUserFollows(param.username).subscribe(res =>{
          this.userFollows = res;
        })
      })
    })
  }

  // ngAfterViewChecked(): void {
  //   this.cd.detectChanges();
  // }

  allButton(){
    this.buttonValue = 1
  }

  sellingButton(){
    this.buttonValue = 2
  }

  soldButton(){
    this.buttonValue = 3
  }

  getLoggedInUser(){
    var user = localStorage.getItem('LoggedInUserDetails')
    if(user){
      let anotherUser = JSON.parse(user)
      return anotherUser
    }
    else{
      return null
    }
    
  }

  followingImages(userFollowMethod: User[]){
    for(let user of userFollowMethod){
      if(user.profilePicture.length){
        var key = user.username
        this.followerImage[key] = 'data:image/jpg;base64,' + user.profilePicture[0].imageData;
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

  checkLikeStatus(username: string, product: Product){
    if(product.like){
      if(product.like.findIndex(like => like.likerName === username) >= 0){
        this.isProductLiked[product.id] = true
      }
      else{
        this.isProductLiked[product.id] = false
      }
    }
  }

  cleanseProduct(product: Product){
    this.service.getOneProduct(product.id).subscribe(prod =>{
      for(let image of prod.productImages){
        image.imageData = 'data:image/jpg;base64,' + image.imageData
      }
      const i = this.products.indexOf(product);
      if(i >= 0){
          this.products.splice(i, 1, prod);
      }
    })
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
        this.followingImages(this.userFollowersProfiles)
      })
      
      this.currentLoggedInUser = this.getLoggedInUser();
      if(this.currentLoggedInUser){
        if(this.currentLoggedInUser.email){
          this.service.getUser(this.currentLoggedInUser.email).subscribe(loggedUser =>{
            this.loggedInUsername = loggedUser.username
            this.service.getUserFollows(loggedUser.username).subscribe(res =>{
              this.LoggedInUserFollows = res;
              console.log(this.LoggedInUserFollows)

              this.checkFollowStatus(this.LoggedInUserFollows, this.userFollowersProfiles)
            })
          })
        }
      }
      else{
        this.LoggedInUserFollows = [];
        this.checkFollowStatus(this.LoggedInUserFollows, this.userFollowersProfiles)
      }
    }
    
  }

  following(){
    this.followValue = 2
    this.followingImages(this.userFollows)

    if(!this.loggedInUser){
      this.currentLoggedInUser = this.getLoggedInUser();
      if(this.currentLoggedInUser){
        if(this.currentLoggedInUser.email){
          this.service.getUser(this.currentLoggedInUser.email).subscribe(loggedUser =>{
            this.loggedInUsername = loggedUser.username
            this.service.getUserFollows(loggedUser.username).subscribe(res =>{
              this.LoggedInUserFollows = res;

              this.checkFollowStatus(this.LoggedInUserFollows, this.userFollows)
            })
          })
        }
      }
      else{
        this.LoggedInUserFollows = [];
        this.checkFollowStatus(this.LoggedInUserFollows, this.userFollowersProfiles)
      }
    }

  }

  likeUser(product: Product){
    let user = this.getLoggedInUser();
    if(user){
      if(user.email){
        if(!this.isProductLiked[product.id]){
          this.like.productId = product.id
          this.like.likerName = this.loggedInUsername
          this.service.likeAProduct(this.like).subscribe(res =>{
            this.isProductLiked[product.id] = true

            this.cleanseProduct(product)
          })
        }
        else{
          for(let like of product.like){
            if(like.likerName === this.loggedInUsername){
              this.service.unLikeAProduct(like.id).subscribe(res =>{
                this.isProductLiked[product.id] = false

                this.cleanseProduct(product)
              })
              break
            }
          }
        }
        
      }
    }
  }


  followUser(event:Event, followedUser: User){
    this.currentLoggedInUser = this.getLoggedInUser();
    if (this.currentLoggedInUser) {
      if(this.currentLoggedInUser.email){
        this.service.getUser(this.currentLoggedInUser.email).subscribe(res =>{
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
        })
      }
      
    } 
    else {
      //alert("Please log in to follow @" + followedUser.username)
    }
  }

  followUserInModal(followedUser: User){
    if(this.loggedInUser){
      if (this.user) {
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
            this.isUserFollowedObject[followedUser.username] = true
            this.followingImages(this.userFollows)
          })
          
        })
        
      } 
      else {
        //alert("Please log in to follow @" + followedUser.username)
      }
    }
    else{
      this.currentLoggedInUser = this.getLoggedInUser();
      if (this.currentLoggedInUser) {
        if(this.currentLoggedInUser.email){
          this.service.getUser(this.currentLoggedInUser.email).subscribe(res =>{
            this.follow.followedUserId = followedUser.id
            this.follow.followerUserId = res.id
            this.follow.followerName = res.username

            this.service.followUser(this.follow).subscribe(data =>{
              this.isUserFollowed = true
              console.log("Created")

              this.service.getUserFollowersProfiles(this.user.username).subscribe(res =>{
                this.userFollowersProfiles = res
                for(let i = 0; i < this.userFollowersProfiles.length; i++){
                  if(this.userFollowersProfiles[i].username === followedUser.username){
                    this.service.getUserFollows(this.user.username).subscribe(users =>{
                      this.userFollows = users
                    })
                    break;
                  }
                }
                this.isUserFollowedObject[followedUser.username] = true
              })
              
            })
          })
        }
        
      } 
      else {
        //alert("Please log in to follow @" + followedUser.username)
      }
    }
    
  }

  unFollowUser(followedUser: User){
    this.currentLoggedInUser = this.getLoggedInUser();
    if (this.currentLoggedInUser) {
      if(this.currentLoggedInUser.email){
        this.service.getUser(this.currentLoggedInUser.email).subscribe(res =>{
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
      //alert("Please log in to unfollow @" + followedUser.username)
    }
  }

  unFollowUserInModal(unFollowedUser: User){
    if(this.loggedInUser){
      if (this.user) {
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
        this.isUserFollowedObject[unFollowedUser.username] = false
        this.followingImages(this.userFollows)
      } 
      else {
        //alert("Please log in to unfollow @" + unFollowedUser.username)
      }
    }
    else{
      this.currentLoggedInUser = this.getLoggedInUser();
      if (this.currentLoggedInUser) {
        if(this.currentLoggedInUser.email){
          this.service.getUser(this.currentLoggedInUser.email).subscribe(res =>{
            for(let i = 0; i < unFollowedUser.followings.length; i++){
              if(unFollowedUser.followings[i].followerName === res.username){
                this.service.unFollowUser(unFollowedUser.followings[i].id).subscribe(data =>{
                  this.service.getUserFollowersProfiles(this.user.username).subscribe(profiles =>{
                    this.userFollowersProfiles = profiles
                    this.service.getUserFollows(this.user.username).subscribe(users =>{
                      this.userFollows = users
                    })
                  })
                })
                break
              }
            }
            this.isUserFollowedObject[unFollowedUser.username] = false
          })
        }
        
      } 
      else {
        //alert("Please log in to unfollow @" + unFollowedUser.username)
      }
    }
  }
  goToProfile(username: string){
    this.route.navigateByUrl(`user-profile/${username}`) 
  }

  goToLogin(){
    this.route.navigate(['/login']) 
  }

  goToSignup(){
    this.route.navigate(['/phone']) 
  }

  editProfile(username: string){
    this.route.navigateByUrl(`edit-profile/${username}`)
  }

  toggleModal(name: string){
    this.modalUserName = name;
  }

}
