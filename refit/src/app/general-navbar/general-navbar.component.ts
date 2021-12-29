import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-navbar',
  templateUrl: './general-navbar.component.html',
  styleUrls: ['./general-navbar.component.css']
})
export class GeneralNavbarComponent implements OnInit {

  constructor(private route: Router) { }

  ladyCats: string[]= ["Dresses", "Tops", "Accessories", "Lingerie", "Shoes", "Skirts", "Pants", "Jackets", "Others"]
  menCats: string[] = ["Jackets", "Shirts", "Pants", "Underwear", "Shoes", "Accessories", "Others"]
  jewelry: string[] = ["Necklaces", "Pins", "Bracelets", "Earrings", "Rings", "Watches", "Others"]
  beauty: string[] = ["Make up", "Fragrance", "Skin care", "Hair", "Other"]
  kids: string[] = ["Girls", "Boys"]
  rentals: string[] = ["Ladies", "Men"]

  ngOnInit(): void {
  }

  goToLogin(){
    this.route.navigate(["/login"])
  }

  goToSignup(){
    this.route.navigate(["/phone"])
  }

}
