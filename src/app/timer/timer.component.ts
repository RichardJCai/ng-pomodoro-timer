import { Component, OnInit, Input, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { SessionInformationService } from '../session-information.service';
import * as workerTimers from 'worker-timers';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {
  @ViewChild('circleCountdown') circleCountdown;
  public sessionType = 0; // 0 for work, 1 for break
  public workDuration: number;
  public breakDuration: number;
  public sessionInformation: SessionInformationService;
  private timeElapsed;
  private countDown;
  private sessionPaused: boolean;
  private sessionActive: boolean;

  constructor(private _ngZone: NgZone) {
    // Load from db if user is logged in
  }

  ngOnInit() {
  }

  onStart() {
    this.startNewSession(this.workDuration, this.sessionType);
  }

  onPause() {
    if (this.sessionPaused) {
      this.startNewSession(this.sessionInformation.sessionDuration, this.sessionType);
    } else {
      workerTimers.clearInterval(this.countDown);
      this.sessionPaused = true;
    }
  }

  onStop() {
    workerTimers.clearInterval(this.countDown);
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
    this.countDown = workerTimers.setInterval(() => {
      this._ngZone.run(() => {
      console.log(this.timeElapsed);
      if (this.sessionInformation.sessionDuration - this.timeElapsed <= 0) {
        console.log('session done!');
        this.timeElapsed = 0;
        workerTimers.clearInterval(this.countDown);
        this.sessionDone();
      }
      this.timeElapsed++;
    }); }, 1000);
  }

  sessionDone() {
    const audio = new Audio();
    audio.src = '../assets/sounds/alarm/analog-alarm.wav';
    audio.play();
    const notificationMsg = this.sessionType === 0 ? 'Work session complete! Take a break' :
      'Your break is over! Get back to work!';
    Notification.requestPermission(permission => {
      if (permission === 'granted') {
        const notification = new Notification(notificationMsg);
      }
    });

    this.sessionType = this.sessionType === 0 ? 1 : 0;
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

  testGetTimeElapsed() {
    console.log(this.timeElapsed);
  }

  getSessionDuration() {
    if (this.sessionInformation) {
      return this.sessionInformation.sessionDuration;
    } else {
      return undefined;
    }
  }

}
