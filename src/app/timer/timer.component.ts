import { Component, OnInit, Input, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { SessionInformationService } from '../session-information.service';
import * as workerTimers from 'worker-timers';
import * as idb from 'idb-keyval';

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
  public showOptions: boolean;
  private timeElapsed: number;
  private countDown;
  private sessionPaused: boolean;
  private sessionActive: boolean;
  private audio;

  constructor(private _ngZone: NgZone) {
    // Load from db if user is logged in
    // Load work sessions done
    // if (storage) {
    idb.get('work-duration').then(val => {
      this.workDuration = val ? Number(val) : 1500;
    });
    idb.get('break-duration').then(val => {
      this.breakDuration = val ? Number(val) : 300;
    });
    idb.get('long-break-duration').then(val => {
      this.longBreakDuration = val ? Number(val) : 900;
    });
    idb.get('sessions-until-long-break').then(val => {
      this.sessionsUntilLongBreak = val ? Number(val) : 4;
    });

    this.workSessionsDone = 0;
  }

  ngOnInit() {
    this.audio = new Audio();
    this.audio.src = '../assets/sounds/alarm/analog-alarm.wav';
  }

  public onStart() {
    this.startNewSession(this.workDuration);
  }

  public onPause() {
    if (this.sessionPaused) {
      this.resumeSession();
    } else {
      workerTimers.clearInterval(this.countDown);
      this.sessionPaused = true;
    }
  }

  public onStop() {
    workerTimers.clearInterval(this.countDown);
    this.sessionActive = false;
    this.sessionPaused = false;
    //  this.sessionInformation.end
    this.sessionInformation.setSessionDuration(0);
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

  private resumeSession() {
    this.sessionActive = true;
    this.sessionPaused = false;
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
    const notificationMsg = this.getSessionCompleteMsg();
    Notification.requestPermission(permission => {
      if (permission === 'granted') {
        const notification = new Notification(notificationMsg);
        this.audio.play();
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

  public toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  public updateSettings(settings) {
    if (settings.workDuration) {
      idb.set('work-duration', settings.workDuration);
      this.workDuration = settings.workDuration;
    }
    if (settings.breakDuration) {
      idb.set('break-duration', settings.breakDuration);
      this.breakDuration = settings.breakDuration;
    }
    if (settings.longBreakDuration) {
      idb.set('long-break-duration', settings.longBreakDuration);
      this.longBreakDuration = settings.longBreakDuration;
    }
    if (settings.sessionsUntilLongBreak) {
      idb.set('sessions-until-long-break', settings.sessionsUntilLongBreak);
      this.sessionsUntilLongBreak = settings.sessionsUntilLongBreak;
    }
  }

  public getRemainingTime() {
    const durationInSeconds = this.getSessionDuration() - this.timeElapsed;
    if (!durationInSeconds) {
      return '0:00'
    }
    
    return this.formatTime(durationInSeconds)
  }

  // format seconds to mm:ss
  private formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds - 60 * minutes;
    
    return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
  }

}
