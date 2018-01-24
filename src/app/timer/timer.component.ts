import { Component, OnInit, Input } from '@angular/core';
import { SessionInformationService } from '../session-information.service';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  public sessionType = 0;
  public workDuration: number;
  public breakDuration: number;

  private tick: number;
  private sessionInformation: SessionInformationService;
  private sessionPaused: boolean;
  private sessionActive: boolean;
  private timeElapsed = 0;
  private timeRemaining = 0;
  private subscription: Subscription;


  constructor() {
    // Load from db if user is logged in
  }

  ngOnInit() {
  }

  onStart() {
    this.startNewSession(this.workDuration, this.sessionType);
  }

  onPause() {
    if (this.sessionPaused) {
      this.timeRemaining = this.sessionInformation.sessionDuration - this.timeElapsed;
      this.startNewSession(this.timeRemaining, this.sessionType);
    } else {
      this.subscription.unsubscribe();
      this.sessionPaused = true;
    }
    console.log(this.sessionPaused);
  }

  onStop() {
    this.subscription.unsubscribe();
    this.sessionActive = false;
    this.timeElapsed = 0;
  }

  private startNewSession(duration, sessionType) {
    // Add start date to db to track info
    this.sessionInformation = new SessionInformationService();
    this.sessionInformation.sessionType = this.sessionType;
    this.sessionActive = true;
    this.sessionPaused = false;
    const currentTime = new Date();
    this.sessionInformation.setStartTime(currentTime);
    this.sessionInformation.setSessionDuration(duration);
    const timer = TimerObservable.create(0, 1000);
    this.subscription = timer.subscribe( t => {
      this.timeElapsed = t;
      if (this.sessionInformation.sessionDuration - this.timeElapsed <= 0) {
        console.log('session done!');
        this.subscription.unsubscribe();
        this.sessionDone();
      }
    });
    console.log('hi');
  }

  updateTime(duration) {
    this.timeRemaining = this.timeRemaining - 1;
  }

  sessionDone() {
    this.sessionType = this.sessionType === 0 ? 1 : 0;
    confirm('press a button to start next session');
    if (this.sessionType === 0) {
      this.startNewSession(this.workDuration, 0);
    } else {
      this.startNewSession(this.breakDuration, 1);
    }
  }

  isSessionActive() {
    return this.sessionActive;
  }

  setWorkDuration(duration) {
    this.workDuration = duration;
  }

  setBreakDuration(duration) {
    this.breakDuration = duration;
  }

  getTimeElapsed() {
    return this.timeElapsed;
  }

  getSessionDuration() {
    return this.sessionInformation.sessionDuration;
  }

}
