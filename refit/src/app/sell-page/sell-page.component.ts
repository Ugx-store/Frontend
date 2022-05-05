import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
export class SellPageComponent implements OnInit, OnDestroy{

  constructor(private imageCompress: NgxImageCompressService, private route: Router, private service: AppServiceService,
    public loaderService: LoaderService, private activatedRoute: ActivatedRoute) { }
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
  imagesToDelete: ProductImage[] = []
  imagesToEdit: ProductImage[] = []

  category: string = "";
  subcategory: string = "";
  condition: string = "";

  mode: string = ""

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

    this.activatedRoute.params.subscribe((param) => {
      this.mode = param.mode
      if(param.mode === 'edit'){
        var pdt = localStorage.getItem('product-edit')
        if(pdt){
          this.product = JSON.parse(pdt)
          this.itemPrice = this.product.itemPrice
          if(this.product.originalPrice !== 0){
            this.originalPrice = this.product.originalPrice
          }
        }
      }
    })
  }

  ngOnDestroy(): void {
    if(localStorage.getItem('product-edit')){
      localStorage.removeItem('product-edit')
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
                if(this.product.productImages.length !== 0){
                  var pdtImage: ProductImage = {
                    id: 0,
                    productId: 0,
                    imageData: ''
                  }
                  pdtImage.productId = this.product.id
                  pdtImage.imageData = result

                  this.product.productImages.push(pdtImage)
                  this.imagesToUpload.push(pdtImage)
                }
                else{
                  this.compressedImages.push(result)
                }
              }
            )
    
          })
        }
        else{
          reader.addEventListener('load', (event:any) =>{
            if(this.product.productImages.length !== 0){
              var pdtImage: ProductImage = {
                id: 0,
                productId: 0,
                imageData: ''
              }
              pdtImage.productId = this.product.id
              pdtImage.imageData = event.target.result

              this.product.productImages.push(pdtImage)
              this.imagesToUpload.push(pdtImage)
            }
            else{
              this.compressedImages.push(event.target.result)
            }
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

    if(imageInput.files[0]){
      if((imageInput.files[0].size)/1024 > 2000){
        reader.addEventListener('load', (event:any) =>{
          this.imageCompress.compressFile(event.target.result, orientation, 50, 50).then(
            result => {
              if(this.compressedImages[0] === image || this.product?.productImages[0]?.imageData === image){
                if(this.compressedImages[0] === image){
                  this.compressedImages[0] = result
                }
                else{
                  this.product.productImages[0].imageData = result
                  this.imagesToEdit.push(this.product.productImages[0])
                } 
              }
              else if(this.compressedImages[1] === image || this.product?.productImages[1]?.imageData  === image){
                if(this.compressedImages[1] === image){
                  this.compressedImages[1] = result
                }
                else{
                  this.product.productImages[1].imageData = result
                  this.imagesToEdit.push(this.product.productImages[1])
                }
              }
              else{
                if(this.compressedImages[2] === image){
                  this.compressedImages[2] = result
                }
                else{
                  this.product.productImages[2].imageData = result
                  this.imagesToEdit.push(this.product.productImages[2])
                }
              }
            }
          )
  
        })
      }
      else{
        reader.addEventListener('load', (event:any) =>{
              if(this.compressedImages[0] === image || this.product?.productImages[0]?.imageData === image){
                if(this.compressedImages[0] === image){
                  this.compressedImages[0] = event.target.result
                }
                else{
                  this.product.productImages[0].imageData = event.target.result
                  this.imagesToEdit.push(this.product.productImages[0])
                } 
              }
              else if(this.compressedImages[1] === image || this.product?.productImages[1]?.imageData === image){
                if(this.compressedImages[1] === image){
                  this.compressedImages[1] = event.target.result
                }
                else{
                  this.product.productImages[1].imageData = event.target.result
                  this.imagesToEdit.push(this.product.productImages[1])
                } 
              }
              else{
                if(this.compressedImages[2] === image){
                  this.compressedImages[2] = event.target.result
                }
                else{
                  this.product.productImages[2].imageData = event.target.result
                  this.imagesToEdit.push(this.product.productImages[2])
                } 
              }
        })
      }

      reader.readAsDataURL(imageInput.files[0])
    }
    
  }

  deletePic(image: any){
    if(image === this.compressedImages[0] || this.product?.productImages[0]?.imageData === image){
      if(this.compressedImages[0] === image){
        this.compressedImages.splice(0, 1)
      }
      else{
        let imageId = this.product.productImages[0].id
        this.product.productImages.splice(0, 1)
        this.imagesToDelete.push(this.product.productImages[0])
      }
    }
    else if(image === this.compressedImages[1] || this.product?.productImages[1]?.imageData === image){
      if(this.compressedImages[1] === image){
        this.compressedImages.splice(1, 1)
      }
      else{
        let imageId = this.product.productImages[1].id
        this.product.productImages.splice(1, 1)
        this.imagesToDelete.push(this.product.productImages[1])
      }
    }
    else{
      if(this.compressedImages[2] === image){
        this.compressedImages.splice(2, 1)
      }
      else{
        let imageId = this.product.productImages[2].id
        this.product.productImages.splice(2, 1)
        this.imagesToDelete.push(this.product.productImages[2])
      }
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
    // if(this.originalPrice) {this.product.originalPrice = this.originalPrice}
    // if(this.quantity){this.product.quantity = this.quantity}

    // this.product.itemPrice = this.itemPrice
    // this.product.ownerName = this.user.username
    // this.product.dateTimeAdded = new Date();

    // if(this.product.ownerName){
    //   this.service.addProduct(this.product).then(res =>{
    //     for(let i=0; i<this.compressedImages.length; i++){
    //       var pdtImage: ProductImage = {
    //         id: 0,
    //         productId: 0,
    //         imageData: ''
    //       }
    //       if(this.compressedImages[i]){
    //         pdtImage.productId = res.id
    //         pdtImage.imageData = this.compressedImages[i].split(',')[1]
    //         this.imagesToUpload.push(pdtImage)
    //       }
    //     }

    //     this.service.addProductImages(this.imagesToUpload).subscribe(img =>{
    //       this.message = "Product saved! Press 'Add' to add another product or 'Continue' to return to the homepage."
    //       console.log(img)
    //     },
    //     err => {
    //       console.log(err)
    //       this.error = err
    //       this.message = "Sorry we failed to upload the product images. Please try again!"
    //     })
    //   },
    //   err =>{
    //     console.log(err)
    //     this.error = err
    //     this.message = "Sorry we failed to upload the product information. Please try again!"
    //   })
    // }

    console.log(this.mode)
  }

}
