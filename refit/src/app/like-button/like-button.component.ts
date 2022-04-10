import { Component, ChangeDetectionStrategy, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Product } from '../models/product';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class LikeButtonComponent implements OnInit, OnChanges {

  constructor(private service: AppServiceService) { }

  liked: boolean = false
  user: any
  
  @Input() product: Product = {
    id: 0,
    description: '',
    condition: '',
    itemPrice: 0,
    originalPrice: 0,
    quantity: 1,
    ownerName: '',
    category: '',
    subCategory: '',
    brand: '',
    color: '',
    age: '',
    town: '',
    city: '',
    size: '',
    freeDelivery: false,
    dateTimeAdded: new Date(0),
    productImages: [],
    like: []
  }
  @Output() toggle = new EventEmitter<boolean>();

  ngOnInit(): void {
    console.log(this.product)
    var loggedInUser = localStorage.getItem('LoggedInUserDetails') 
    if(loggedInUser){
      var user = JSON.parse(loggedInUser)
      if(user.email){
        this.service.getUser(user.email).subscribe(res =>{
          this.user = res
          // if(this.product.likes?.length){
          //   for(let i=0; i<this.product.likes.length; i++){
          //     if(this.product.likes[i].likerName === this.user.username){
          //       this.liked = true
          //     }
          //   }
          // }
        })}
    }
  }

  ngOnChanges(){
    this.liked = false;
    this.ngOnInit();
  }

}
