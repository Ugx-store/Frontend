import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private imageCompress: NgxImageCompressService) { }

  selectedFile!: ImageSnippet;

  profilePic: ProfilePictures = {
    Id: 0,
    Username: '',
    imageData: ''
  }

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
      imageData: ''
    }
  }

  imgResultAfterCompress:any;

  userImg: string = ''

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).subscribe(res =>{
        this.user = res
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
  
            this.profilePic.Username = this.user.username
            this.profilePic.imageData = this.imgResultAfterCompress.split(',')[1]
  
            this.service.postProfilePicture(this.profilePic).subscribe(res =>{
              console.log("Success")
            },
            (err) => {
              console.log(err) 
            }
            )
          }
        )
      })
  
      reader.readAsDataURL(file)
    }
  }

}
