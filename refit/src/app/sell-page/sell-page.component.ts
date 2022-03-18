import { Component, OnInit } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Product } from '../models/product';


@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrls: ['./sell-page.component.css']
})
export class SellPageComponent implements OnInit {

  constructor(private imageCompress: NgxImageCompressService) { }
  product: Product = {
    id: 0,
    description: '',
    condition: '',
    itemPrice: '',
    originalPrice: '',
    quantity: '',
    ownerName: '',
    category: '',
    subCategory: '',
    brand: '',
    color: '',
    age: '',
    location: '',
    size: '',
    freeDelivery: false,
    dateTimeAdded: new Date(0)
  }

  category: string = "";
  subcategory: string = "";
  condition: string = "";

  imageResultAfterCompressOne: any;
  imageResultAfterCompressTwo: any;
  imageResultAfterCompressThree: any;
  emptyImage: any;

  ladyCats: string[]= ["Dresses", "Tops", "Accessories", "Lingerie", "Shoes", "Skirts", "Pants", "Jackets", "Others"]
  menCats: string[] = ["Jackets", "Shirts", "Pants", "Underwear", "Shoes", "Accessories", "Others"]
  jewelry: string[] = ["Necklaces", "Pins", "Bracelets", "Earrings", "Rings", "Watches", "Others"]
  beauty: string[] = ["Make up", "Fragrance", "Skin care", "Hair", "Other"]
  kids: string[] = ["Girls", "Boys"]
  rentals: string[] = ["Ladies", "Men"]

  ngOnInit(): void {
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
    console.log(this.product.category)
  }

  subcategoryClick(event: any){
    this.product.subCategory = event.target.innerText
  }

  conditionClick(event: any){
    if(event.childNodes.length > 1){
      this.product.condition = event.childNodes[0].innerText
    }
    else{
      this.product.condition = event.childNodes[0].textContent
      console.log(event.childNodes[0].textContent)
    }
  }

}
