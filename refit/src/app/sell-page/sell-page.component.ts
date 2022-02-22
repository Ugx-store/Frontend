import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrls: ['./sell-page.component.css']
})
export class SellPageComponent implements OnInit {

  constructor() { }

  category: string = "";
  subcategory: string = "";
  color: ThemePalette = 'warn'; 

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

}
