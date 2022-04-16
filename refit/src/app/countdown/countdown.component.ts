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
    let time = new Date();
    time.setMinutes(time.getMinutes() + 20)
    console.log(time)

    
    this.endTime.setMinutes(this.endTime.getMinutes() +30)
    console.log(this.endTime)
    this.timeLeft$ = interval(1000).pipe(
      map(x => this.timeDiff(this.endTime)),
      shareReplay(1)
    );
  }

  timeLeft$: Observable<Counter> = new Observable()
  endTime: Date = new Date()

  

  timeDiff(timeDiff: Date){
    const hoursInADay = 24
    const minutesInAHour = 60
    const secondsInAMinute = 60
    const milliSecondsInASecond = 1000


    const timeDifference = timeDiff.getTime() - new Date().getTime()

    console.log(timeDifference/60000)

    const hours = Math.floor(
      (timeDifference / 3600000)
    )

    const minutes = Math.floor(
      (timeDifference / 60000)
    )

    //console.log(minutes)

    const seconds = Math.floor(
      (timeDifference / milliSecondsInASecond) % secondsInAMinute
    )

    return {seconds, minutes, hours}
  } 

}
