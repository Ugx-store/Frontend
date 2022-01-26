import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/newUser';
import { ProfilePic } from '../models/profilepic';
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

  constructor(private service: AppServiceService, private activatedRoute: ActivatedRoute) { }

  selectedFile!: ImageSnippet;

  profilePic: ProfilePic = {
    Id: 0,
    Username: '',
    ImageData: new FormData()
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
      imageData: []
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.service.getUser(param.username).subscribe(res =>{
        this.user = res
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
    const fileData = new FormData();

    reader.addEventListener('load', (event:any) =>{
      this.selectedFile = new ImageSnippet(event.target.result, file)

      this.profilePic.Username = this.user.username
      this.profilePic.ImageData.append('image', this.selectedFile.file, this.selectedFile.file.name)

      this.service.postProfilePicture(this.profilePic).subscribe(res =>{
        console.log("Success")
      },
      (err) => {
        console.log(err) 
      }
      )
    })

    reader.readAsDataURL(file)
  }

}
