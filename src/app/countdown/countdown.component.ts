import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  @Input() timeRemaining: number;
  @Input() paused: boolean;
  subscription: Subscription;
  @Output() timesUp = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    const timer = TimerObservable.create(0, 1000);
    this.subscription = timer.subscribe(t => {
      this.timeRemaining = t;
    });
  }

}
