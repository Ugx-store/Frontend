import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrls: ['./sell-page.component.css']
})
export class SellPageComponent implements OnInit {

  constructor() { }

  category: string = "";
  subcategory: string = "";
  condition: string = "";

  ladyCats: string[]= ["Dresses", "Tops", "Accessories", "Lingerie", "Shoes", "Skirts", "Pants", "Jackets", "Others"]
  menCats: string[] = ["Jackets", "Shirts", "Pants", "Underwear", "Shoes", "Accessories", "Others"]
  jewelry: string[] = ["Necklaces", "Pins", "Bracelets", "Earrings", "Rings", "Watches", "Others"]
  beauty: string[] = ["Make up", "Fragrance", "Skin care", "Hair", "Other"]
  kids: string[] = ["Girls", "Boys"]
  rentals: string[] = ["Ladies", "Men"]

  ngOnInit(): void {
  }

  categoryChange(){
    console.log(this.category) 
  }

  optionClick(event: any){
    this.subcategory = ""
    this.category = event.target.innerText
  }

  subcategoryClick(event: any){
    this.subcategory = event.target.innerText
  }

  conditionClick(event: any){
    if(event.childNodes.length > 1){
      this.condition = event.childNodes[0].innerText
    }
    else{
      this.condition = event.childNodes[0].textContent
      console.log(event.childNodes[0].textContent)
    }
  }

}
