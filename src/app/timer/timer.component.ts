import { Component, OnInit, Input, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { SessionInformationService } from '../session-information.service';
import * as workerTimers from 'worker-timers';

const workSession = 0;
const breakSession = 1;
const longBreakSession = 2;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {
  @ViewChild('circleCountdown') circleCountdown;
  public sessionType = workSession;
  public workDuration: number;
  public breakDuration: number;
  public longBreakDuration: number;
  public sessionsUntilLongBreak: number;
  public workSessionsDone: number;
  public sessionInformation: SessionInformationService;
  private timeElapsed: number;
  private countDown;
  private sessionPaused: boolean;
  private sessionActive: boolean;

  constructor(private _ngZone: NgZone) {
    // Load from db if user is logged in
    // Load work sessions done

    // if (storage) {
    if (false) {
      // load from storage
    } else { // load default settings
      this.workDuration = 1500;
      this.breakDuration = 300;
      this.longBreakDuration = 900;
      this.sessionsUntilLongBreak = 4;
      this.workSessionsDone = 0;
    }
  }

  ngOnInit() {
  }

  public onStart() {
    this.startNewSession(this.workDuration);
  }

  public onPause() {
    if (this.sessionPaused) {
      this.startNewSession(this.sessionInformation.sessionDuration);
    } else {
      workerTimers.clearInterval(this.countDown);
      this.sessionPaused = true;
    }
  }

  public onStop() {
    workerTimers.clearInterval(this.countDown);
    this.sessionActive = false;
    this.timeElapsed = 0;
  }

  private startNewSession(duration) {
    // Add start date to db to track info
    this.timeElapsed = 0;
    this.sessionActive = true;
    this.sessionPaused = false;
    const currentTime = new Date();

    this.sessionInformation = new SessionInformationService();

    this.sessionInformation.sessionType = this.sessionType;
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

  private sessionDone() {
    const audio = new Audio();
    audio.src = '../assets/sounds/alarm/analog-alarm.wav';
    audio.play();
    const notificationMsg = this.getSessionCompleteMsg();
    Notification.requestPermission(permission => {
      if (permission === 'granted') {
        const notification = new Notification(notificationMsg);
      }
    });

    if (this.sessionType === workSession) {
      this.workSessionsDone++;
    }

    // Determine session type and start new session.
    this.determineSessionType();
    let sessionDuration;
    if (this.sessionType === workSession) {
      sessionDuration = this.workDuration;
    } else if (this.sessionType === breakSession) {
      sessionDuration = this.breakDuration;
    } else if (this.sessionType === longBreakSession) {
      sessionDuration = this.longBreakDuration;
    }

    this.startNewSession(sessionDuration);
  }

  private getSessionCompleteMsg(): string {
    if (this.sessionType === 0) {
      if (this.workSessionsDone >= this.sessionsUntilLongBreak) {
        return 'Work session complete! Take a long break!';
      } else {
          return 'Work session complete! Take a break';
      }
    } else if (this.sessionType === 1) {
        return 'Your break is over! Get back to work!';
    } else if (this.sessionType === 2) {
        return 'Your long break is over! Get back to work!';
    }
  }

  private determineSessionType(): void {
    if (this.sessionType === workSession) {
      if (this.workSessionsDone >= this.sessionsUntilLongBreak) {
        this.sessionType = longBreakSession;
        this.workSessionsDone = 0;
      } else {
          this.sessionType = breakSession;
      }
    } else if (this.sessionType === breakSession || this.sessionType === longBreakSession) {
        this.sessionType = workSession;
    }
  }

  public isSessionActive() {
    return this.sessionActive;
  }

  public setWorkDuration(duration) {
    this.workDuration = duration;
  }

  public setBreakDuration(duration) {
    this.breakDuration = duration;
  }

  public getTimeElapsed() {
    return this.timeElapsed;
  }

  public getSessionTypeName() {
    if (this.sessionType === 0) {
      return 'Work';
    } else if (this.sessionType === 1) {
      return 'Break';
    } else if (this.sessionType === 2) {
      return 'Long Break';
    }
  }

  public getSessionDuration() {
    if (this.sessionInformation) {
      return this.sessionInformation.sessionDuration;
    } else {
      return undefined;
    }
  }

}
