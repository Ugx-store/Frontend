import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
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
export class EditProfileComponent implements OnInit {

  constructor(private service: AppServiceService, private activatedRoute: ActivatedRoute, 
    private imageCompress: NgxImageCompressService, private route: Router) { }

  selectedFile!: ImageSnippet;

  profilePic: ProfilePictures = {
    Id: 0,
    Username: '',
    imageData: ''
  }

  modalTrigger: number = 0;
  message: string = '';

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
    profilePicture: {
      Id: 0,
      Username: '',
      imageData: ''
    }
  }

  imgResultAfterCompress:any;

  userImg: string = ''
  theUsername: any;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).subscribe(res =>{
        this.theUsername = param.username
        this.user = res
        localStorage.setItem('UserBeforeEdit', JSON.stringify(this.user))
        if(this.user.profilePicture){
          this.userImg = 'data:image/jpg;base64,' + this.user.profilePicture.imageData
        }
      })
    })
  }

  private onSuccess(){
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError(){
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
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
  
            // this.profilePic.Username = this.user.username
            // this.profilePic.imageData = this.imgResultAfterCompress.split(',')[1]
  
            // this.service.postProfilePicture(this.profilePic).subscribe(res =>{
            //   console.log("Success")
            // },
            // (err) => {
            //   console.log(err) 
            // }
            // )
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
    if(this.imgResultAfterCompress){
      this.profilePic.Username = this.user.username
      this.profilePic.imageData = this.imgResultAfterCompress.split(',')[1]

      console.log("Image to change")

      this.service.postProfilePicture(this.profilePic).subscribe(res =>{
        console.log("Success")
      },
      (err) => {
        console.log(err) 
      }
      )
    }

    console.log(this.user)

    var userBeforeEdit = localStorage.getItem('UserBeforeEdit')
    if(userBeforeEdit){
      let anotherUser = JSON.parse(userBeforeEdit)

      if(this.user.name !== anotherUser.name
        || this.user.bio !== anotherUser.bio
        || this.user.facebookLink !== anotherUser.facebookLink
        || this.user.twitterLink !== anotherUser.twitterLink
        || this.user.instagramLink !== anotherUser.instagramLink){
        this.service.updateUser(this.user).then(res =>{
          this.modalTrigger = 1;
        },
        err =>{
          this.message = "Sorry we failed to update your information. Please try again!"
        })
      }
    }
  }

}
