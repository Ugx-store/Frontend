import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-navbar',
  templateUrl: './general-navbar.component.html',
  styleUrls: ['./general-navbar.component.css']
})
export class GeneralNavbarComponent implements OnInit {

  constructor() { }

  ladyCats: string[]= ["Dresses", "Tops", "Accessories", "Lingerie", "Shoes", "Skirts", "Pants", "Jackets", "Others"]
  menCats: string[] = ["Shorts", "Shirts", "Pants", "Underwear", "Shoes", "Accessories", "Others"]
  jewelry: string[] = ["Necklaces", "Pins", "Bracelets", "Earrings", "Rings", "Watches", "Others"]
  beauty: string[] = ["Make up", "Fragrance", "Skin care", "Hair", "Other"]

  ngOnInit(): void {
  }

}
