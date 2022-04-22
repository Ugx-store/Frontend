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
    dateTimeAdded: new Date(0),
    productImages: [],
    like: [],
    boost: []
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

  compressedImages: any = []
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

  processFile(imageInput: any){
    //const file: File = imageInput.files[0];
    //const reader = new FileReader();
    var orientation = -1;
    
    for(let i=0; i<imageInput.files.length; i++){
      const reader = new FileReader();
      if(imageInput.files[i]){
        if((imageInput.files[i].size)/1024 > 2000){
          reader.addEventListener('load', (event:any) =>{
            this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
              result => {
                this.compressedImages.push(result)
              }
            )
    
          })
        }
        else{
          reader.addEventListener('load', (event:any) =>{
            this.compressedImages.push(event.target.result)
          })
        }
  
        reader.readAsDataURL(imageInput.files[i])
      }
    }
  } 

  editFile(imageInput: any, image: any){
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    var orientation = -1;

    if(file){
      reader.addEventListener('load', (event:any) =>{
        this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
          result => {
            if(this.compressedImages[0] === image){
              this.compressedImages[0] = result
            }
            else if(this.compressedImages[1] === image){
              this.compressedImages[1] = result
            }
            else{
              this.compressedImages[2] = result
            }
          }
        )

      })

      reader.readAsDataURL(file)
    }
  }

  // processFileThree(imageInput: any){
  //   const file: File = imageInput.files[0];
  //   const reader = new FileReader();
  //   var orientation = -1;

  //   if(file){
  //     reader.addEventListener('load', (event:any) =>{
  //       this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
  //         result => {
  //           this.imageResultAfterCompressThree = result
  //         }
  //       )

  //     })

  //     reader.readAsDataURL(file)
  //   }
  // }

  deletePic(image: any){
    if(image === this.compressedImages[0]){
      this.compressedImages.splice(0, 1)
    }
    else if(image === this.compressedImages[1]){
      this.compressedImages.splice(1, 1);
    }
    else{
      this.compressedImages.splice(2, 1)
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
    if(this.originalPrice) {this.product.originalPrice = this.originalPrice}
    if(this.quantity){this.product.quantity = this.quantity}

    this.product.itemPrice = this.itemPrice
    this.product.ownerName = this.user.username
    this.product.dateTimeAdded = new Date();

    if(this.product.ownerName){
      this.service.addProduct(this.product).then(res =>{
        for(let i=0; i<this.compressedImages.length; i++){
          if(this.compressedImages[i]){
            this.productImage.productId = res.id
            this.productImage.imageData = this.compressedImages[i].split(',')[1]
  
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
