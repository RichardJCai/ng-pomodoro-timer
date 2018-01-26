import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-circle-countdown',
  templateUrl: './circle-countdown.component.html',
  styleUrls: ['./circle-countdown.component.css']
})
export class CircleCountdownComponent implements OnInit {
  @ViewChild('circle') circleEl: ElementRef;
  constructor() { }
  public radius: number
  public circleStrokeDashOffset: number
  public circleStrokeDashArray: number
  public initialStrokeDashOffset: number
  public duration: number
  public elapsedTime: number
  public countDown
  

  ngOnInit() {
    this.radius = 63.6619772368
    this.initialStrokeDashOffset = 400
    this.circleStrokeDashOffset = 400
    this.circleStrokeDashArray = 400
  }

  public countdown(duration: number, reset: boolean) {
    let currentDuration
    if (reset) {
      this.circleStrokeDashOffset = this.initialStrokeDashOffset
      this.elapsedTime
      currentDuration = duration
      this.duration = duration
    } else {
      currentDuration = duration - this.elapsedTime
    }
    this.countDown = setInterval(() => {
      console.log(this.circleStrokeDashOffset)
      this.circleStrokeDashOffset -= (this.initialStrokeDashOffset / this.duration)
      if (this.circleStrokeDashOffset < 0) {
        this.circleStrokeDashOffset = 0
      }
      this.elapsedTime++
      if (currentDuration <= 1 || this.circleStrokeDashOffset <= 0) {
        clearInterval(this.countDown)
      }
      currentDuration--
    }, 1000)
    console.log(this.circleStrokeDashOffset)
  }

  public onPause() {
    clearInterval(this.countDown)
    alert(this.circleStrokeDashOffset)
  }

  public onResume(duration: number) {
    this.countdown(duration, false)
  }

  public onStop() {
    clearInterval(this.countDown)
    this.circleStrokeDashOffset = this.initialStrokeDashOffset
  }

}
