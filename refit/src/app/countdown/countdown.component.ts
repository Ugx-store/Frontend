import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Counter } from '../models/counter';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.endTime.setMinutes(this.endTime.getMinutes() +30)

    // this.timeLeft$ = interval(1000).pipe(
    //   map(x => this.timeDiff(this.endTime)),
    //   shareReplay(1)
    // );
  }

  timeLeft$: Observable<Counter> = new Observable()
  endTime: Date = new Date()

  timeDiff(timeDiff: Date){
    const timeDifference = timeDiff.getTime() - new Date().getTime()

    const hours = Math.floor(
      (timeDifference / 3600000)
    )

    const minutes = Math.floor(
      (timeDifference / 60000)
    )

    const seconds = Math.floor(
      (timeDifference / 1000) 
    )

    return {seconds, minutes, hours}
  } 

}
