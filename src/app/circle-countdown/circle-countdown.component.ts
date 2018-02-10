import { Component, OnInit, OnChanges, ElementRef, ViewChild, Input } from '@angular/core';
import * as workerTimers from 'worker-timers';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-circle-countdown',
  templateUrl: './circle-countdown.component.html',
  styleUrls: ['./circle-countdown.component.css']
})
export class CircleCountdownComponent implements OnInit, OnChanges {
  @ViewChild('circle') circleEl: ElementRef;
  @Input() timeElapsed: number;
  @Input() duration: number;
  public radius: number;
  public circleStrokeDashOffset: number;
  public circleStrokeDashArray: number;
  public initialStrokeDashOffset: number;
  public countDown;

  constructor() {}

  ngOnInit() {
    this.radius = 63.6619772368;
    this.initialStrokeDashOffset = 400;
    this.circleStrokeDashOffset = 400;
    this.circleStrokeDashArray = 400;
  }

  ngOnChanges() {
    if (this.duration !== 0) {
      this.circleStrokeDashOffset = this.initialStrokeDashOffset -
        (this.initialStrokeDashOffset * this.timeElapsed / this.duration);
    }
  }
}
