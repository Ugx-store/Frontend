import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-footer',
  templateUrl: './general-footer.component.html',
  styleUrls: ['./general-footer.component.css']
})
export class GeneralFooterComponent implements OnInit {

  constructor() { }

  date: Date = new Date()
  year: number = 0

  ngOnInit(): void {
    this.year = this.date.getFullYear();
  }

}
