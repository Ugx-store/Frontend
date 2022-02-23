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

  ladyCats: string[]= ["Dresses", " ", "Tops", " ", "Accessories", " ", "Lingerie", " ", "Shoes", " ", "Skirts", " ", "Pants", " ", "Jackets", " ", "Others"]
  menCats: string[] = ["Jackets", " ", "Shirts", " ", "Pants", " ", "Underwear", " ", "Shoes", " ", "Accessories", " ", "Others"]
  jewelry: string[] = ["Necklaces", " ", "Pins", " ", "Bracelets", " ", "Earrings", " ", "Rings", " ", "Watches", " ", "Others"]
  beauty: string[] = ["Make up", " ", "Fragrance", " ", "Skin care", " ", "Hair", " ", "Other"]
  kids: string[] = ["Girls", " ", "Boys"]
  rentals: string[] = ["Ladies", " ", "Men"]

  ngOnInit(): void {
  }

  categoryChange(){
    console.log(this.category) 
  }

  optionClick(event: any){
    console.log(event.target.innerText)
    this.category = event.target.innerText
  }

}
