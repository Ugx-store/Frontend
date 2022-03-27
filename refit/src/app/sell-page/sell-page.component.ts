import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { LoaderService } from '../Loader';
import { Product } from '../models/product';
import { ProductImage } from '../models/productImage';
import { AppServiceService } from '../services/app-service.service';


@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrls: ['./sell-page.component.css']
})
export class SellPageComponent implements OnInit {

  constructor(private imageCompress: NgxImageCompressService, private route: Router, private service: AppServiceService,
    public loaderService: LoaderService) { }
  product: Product = {
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
    dateTimeAdded: new Date(0)
  }

  productImage: ProductImage = {
    id: 0,
    productId: 0,
    imageData: ''
  }

  imagesToUpload: ProductImage[] = []

  category: string = "";
  subcategory: string = "";
  condition: string = "";

  itemPrice: any
  originalPrice: any
  quantity: any
  user: any

  imageResultAfterCompressOne: any;
  imageResultAfterCompressTwo: any;
  imageResultAfterCompressThree: any;
  emptyImage: any;

  message: string = '';
  error: any;

  categories: string[] = ["Ladieswear", "Menswear", "Jewelry", "Beauty", "Kids", "Rentals"]
  ladyCats: string[]= ["Dresses", "Tops", "Accessories", "Lingerie", "Shoes", "Skirts", "Pants", "Jackets", "Others"]
  menCats: string[] = ["Jackets", "Shirts", "Pants", "Underwear", "Shoes", "Accessories", "Others"]
  jewelry: string[] = ["Necklaces", "Pins", "Bracelets", "Earrings", "Rings", "Watches", "Others"]
  beauty: string[] = ["Make up", "Fragrance", "Skin care", "Hair", "Other"]
  kids: string[] = ["Girls", "Boys"]
  rentals: string[] = ["Ladies", "Men"]

  conditions: string[] = ["Brand new", "Like new", "Used - Excellent", "Used - Good", "Used - Fair"]

  catFound: boolean = true
  subCatFound: boolean = true
  conditionFound: boolean = true

  ngOnInit(): void {
    var loggedInUser = localStorage.getItem('LoggedInUserDetails') 
    if(loggedInUser){
      var user = JSON.parse(loggedInUser)
      if(user.email){
        this.service.getUser(user.email).subscribe(res =>{
          this.user = res
        })}
    }
  }

  processFileOne(imageInput: any){
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    var orientation = -1;

    if(file){
      reader.addEventListener('load', (event:any) =>{
        this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
          result => {
            this.imageResultAfterCompressOne = result
            console.log(this.imageResultAfterCompressOne)
          }
        )

      })

      reader.readAsDataURL(file)
    }
  } 

  processFileTwo(imageInput: any){
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    var orientation = -1;

    if(file){
      reader.addEventListener('load', (event:any) =>{
        this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
          result => {
            this.imageResultAfterCompressTwo = result
          }
        )

      })

      reader.readAsDataURL(file)
    }
  }

  processFileThree(imageInput: any){
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    var orientation = -1;

    if(file){
      reader.addEventListener('load', (event:any) =>{
        this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
          result => {
            this.imageResultAfterCompressThree = result
          }
        )

      })

      reader.readAsDataURL(file)
    }
  }

  deletePic(image: any){
    if(image === this.imageResultAfterCompressOne){
      this.imageResultAfterCompressOne = this.emptyImage;
    }
    else if(image === this.imageResultAfterCompressTwo){
      this.imageResultAfterCompressTwo = this.emptyImage;
    }
    else{
      this.imageResultAfterCompressThree = this.emptyImage;
    }
  }

  optionClick(event: any){
    this.product.subCategory = ""
    this.product.category = event.target.innerText
    this.checkCategory(this.product.category)
  }

  subcategoryClick(event: any){
    this.product.subCategory = event.target.innerText
    this.checkSubcategory(this.product.subCategory)
  }

  conditionClick(event: any){
    if(event.childNodes.length > 1){
      this.product.condition = event.childNodes[0].innerText
    }
    else{
      this.product.condition = event.childNodes[0].textContent
      //console.log(event.childNodes[0].textContent)
    }
    this.checkCondition(this.product.condition)
  }

  freeDeliveryClicked(){
    this.product.freeDelivery = true;
  }

  cancel(){
    this.route.navigateByUrl('homepage')
  }

  goToLogin(){
    this.route.navigate(["/login"])
  }

  addButton(){
    location.reload();
  }

  checkCategory(category: any){
    if(this.categories.findIndex(c => c === category) < 0){
      this.catFound = false
    }
    else{
      this.catFound = true
    }
  }

  checkSubcategory(subcategory: any){
    if(this.ladyCats.findIndex(c => c === subcategory) < 0
      && this.menCats.findIndex(c => c === subcategory) < 0
      && this.jewelry.findIndex(c => c === subcategory) < 0
      && this.beauty.findIndex(c => c === subcategory) < 0
      && this.kids.findIndex(c => c === subcategory) < 0
      && this.rentals.findIndex(c => c === subcategory) < 0){
      this.subCatFound = false
    }
    else{
      this.subCatFound = true
    }
  }

  checkCondition(condition: any){
    if(this.conditions.findIndex(c => c === condition) < 0){
      this.conditionFound = false
    }
    else{
      this.conditionFound = true
    }
  }

  save(){
    var images = [
      this.imageResultAfterCompressOne, 
      this.imageResultAfterCompressTwo,
      this.imageResultAfterCompressThree
    ]

    if(this.originalPrice) {this.product.originalPrice = this.originalPrice}
    if(this.quantity){this.product.quantity = this.quantity}

    this.product.itemPrice = this.itemPrice
    this.product.ownerName = this.user.username
    this.product.dateTimeAdded = new Date();

    if(this.product.ownerName){
      this.service.addProduct(this.product).then(res =>{
        for(let i=0; i<images.length; i++){
          if(images[i]){
            this.productImage.productId = res.id
            this.productImage.imageData = images[i].split(',')[1]
  
            this.imagesToUpload.push(this.productImage)
          }
        }
  
        this.service.addProductImages(this.imagesToUpload).subscribe(img =>{
          this.message = "Product saved! Press 'Add' to add another product or 'Continue' to return to the homepage."
          console.log(img)
        },
        err => {
          console.log(err)
          this.error = err
          this.message = "Sorry we failed to upload the product images. Please try again!"
        })
      },
      err =>{
        console.log(err)
        this.error = err
        this.message = "Sorry we failed to upload the product information. Please try again!"
      })
    }
  }

}
