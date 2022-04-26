import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, updateEmail } from 'firebase/auth';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LoaderService } from '../Loader';
import { app } from '../models/firebaseapp';
import { User } from '../models/newUser';
import { ProfilePictures } from '../models/profilepic';
import { AppServiceService } from '../services/app-service.service';

class ImageSnippet{
  pending: boolean = false;
  status: string = 'init';
  constructor(public src: string, public file: File){}
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  constructor(private service: AppServiceService, private activatedRoute: ActivatedRoute, 
    private imageCompress: NgxImageCompressService, private route: Router, public loaderService: LoaderService) { }

  selectedFile!: ImageSnippet;
  auth: any = getAuth(app);

  profilePic: ProfilePictures = {
    id: 0,
    userId: 0,
    username: '',
    imageData: ''
  }

  modalTrigger: number = 0;
  message: string = '';
  error: any;
  authLoader: boolean = false

  user: User = {
    id: 0,
    name: '', 
    email: '',
    username: '',
    password: '',
    bio: '',
    phoneNumber: '',
    profileVisits: 0,
    receiveEmailConsent: false,
    promoCode: '',
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    dateTimeJoined: new Date(0),
    followings: [],
    profilePicture: []
  }

  imgResultAfterCompress:any;

  userImg: string = ''
  theEmail: any;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).subscribe(res =>{
        this.theEmail = res.email
        this.user = res
        localStorage.setItem('UserBeforeEdit', JSON.stringify(this.user))
        if(this.user.profilePicture.length){
          this.userImg = 'data:image/jpg;base64,' + this.user.profilePicture[0].imageData
        }
      })
    })
  }

  ngOnDestroy(){
    localStorage.removeItem('UserBeforeEdit')
  }

  processFile(imageInput: any){
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    var orientation = -1

    if(imageInput.files[0]){
      reader.addEventListener('load', (event:any) =>{
        this.selectedFile = new ImageSnippet(event.target.result, file)
  
        this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
          result => {
            this.imgResultAfterCompress = result
          }
        )
      })
  
      reader.readAsDataURL(file)
    }
  }

  cancel(){
    this.route.navigateByUrl(`user-profile/${this.user.username}`)
  }

  nextPage(){
    this.route.navigateByUrl(`user-profile/${this.user.username}`)
  }

  save(){
    this.modalTrigger = 0;
    this.message = '';
    this.error = '';
    this.authLoader = false;

    var userBeforeEdit = localStorage.getItem('UserBeforeEdit')
    if(userBeforeEdit){
      let anotherUser = JSON.parse(userBeforeEdit)

      if(this.user.name !== anotherUser.name
        || this.user.email !== anotherUser.email
        || this.user.bio !== anotherUser.bio
        || this.user.facebookLink !== anotherUser.facebookLink
        || this.user.twitterLink !== anotherUser.twitterLink
        || this.user.instagramLink !== anotherUser.instagramLink
        || this.imgResultAfterCompress){
          
        this.modalTrigger = 1;
        this.user.followings = []
        this.user.profilePicture = []

        if(this.user.email !== anotherUser.email){
          this.authLoader = true
          updateEmail(this.auth.currentUser, this.user.email).then(() =>{
            this.authLoader = false
            localStorage.removeItem('LoggedInUserDetails')
            localStorage.setItem('LoggedInUserDetails', JSON.stringify(this.auth.currentUser))
            this.service.updateUser(this.user).then(res =>{
              localStorage.removeItem('UserBeforeEdit')
            },
            err =>{
              this.error = err
              this.message = "Sorry we failed to update your information. Please try again!"
            })
          }).catch(err => {
            this.authLoader = false
            this.error = err
            this.message = "To change your email address, please log out, login and try again!"
          })
        }
        else{
          this.service.updateUser(this.user).then(res =>{
            localStorage.removeItem('UserBeforeEdit')
          },
          err =>{
            this.error = err
            this.message = "Sorry we failed to update your information. Please try again!"
          })
        }

        if(this.imgResultAfterCompress){
          this.modalTrigger = 1;
          this.profilePic.username = this.user.username
          this.profilePic.imageData = this.imgResultAfterCompress.split(',')[1]
    
          this.service.postProfilePicture(this.profilePic).subscribe(res =>{
            console.log(res)
          },
          (err) => {
            this.error = err
            this.message = "Sorry we failed to update your information. Please try again!"
            console.log(err)
          }
          )
        }
        
      }
      else{
        this.message = "You did not update your information. Click continue to update some of your information."
      }
    }
    else{
      this.message = "Please login and try again"
    }
    
  }

}
