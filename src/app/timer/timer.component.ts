import { Component, OnInit, Input, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { SessionInformationService } from '../session-information.service';
import * as workerTimers from 'worker-timers';
import * as idb from 'idb-keyval';

const WORKSESSION = 0;
const BREAKSESSION = 1;
const LONGBREAKSESSION = 2;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {
  @ViewChild('circleCountdown') circleCountdown;
  public sessionType = WORKSESSION;
  
  // Options
  public workDuration: number;
  public breakDuration: number;
  public longBreakDuration: number;
  public sessionsUntilLongBreak: number;
  public soundNotifications: boolean;
  public floatNotifications: boolean;
  public volume: number;

  public workSessionsDone: number;
  public sessionInformation: SessionInformationService;
  public showOptions: boolean;
  public showContinue: boolean;

  private timeElapsed: number;
  private countDown;
  private sessionPaused: boolean;
  private sessionActive: boolean;
  private audio;

  constructor(private _ngZone: NgZone) {
  }

  ngOnInit() {
    // Load from db if user is logged in
    // Load work sessions done
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
    idb.get('sound-notifications').then(val => {
      this.soundNotifications = val ? true : false;
    })
    idb.get('float-notifications').then(val => {
      this.floatNotifications = val ? true : false;
    })  
    idb.get('volume').then(val => {
      this.volume = val ? Number(val) : 50;
    })

    this.workSessionsDone = 0;
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
    this.showContinue = false;
    const currentTime = new Date();

    this.sessionInformation = new SessionInformationService();

    this.sessionInformation.sessionType = this.sessionType;
    this.sessionInformation.setStartTime(currentTime);
    this.sessionInformation.setSessionDuration(duration);

    this.countDown = workerTimers.setInterval(this.startCountDown, 1000)
  }

  private resumeSession() {
    this.sessionActive = true;
    this.sessionPaused = false;
    this.countDown = workerTimers.setInterval(this.startCountDown, 1000)
  }

  private sessionDone() {
    this.displayNotifications()
    if (this.sessionType === WORKSESSION) {
      this.workSessionsDone++;
    }

    // Determine session type and start new session.
    this.determineSessionType();
    let sessionDuration;
    if (this.sessionType === WORKSESSION) {
      sessionDuration = this.workDuration;
    } else if (this.sessionType === BREAKSESSION) {
      sessionDuration = this.breakDuration;
    } else if (this.sessionType === LONGBREAKSESSION) {
      sessionDuration = this.longBreakDuration;
    }
    this.showContinue = true;
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
    if (this.sessionType === WORKSESSION) {
      if (this.workSessionsDone >= this.sessionsUntilLongBreak) {
        this.sessionType = LONGBREAKSESSION;
        this.workSessionsDone = 0;
      } else {
          this.sessionType = BREAKSESSION;
      }
    } else if (this.sessionType === BREAKSESSION || this.sessionType === LONGBREAKSESSION) {
        this.sessionType = WORKSESSION;
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
    if (settings.soundNotifications !== undefined) {
      idb.set('sound-notifications', settings.soundNotifications);
      this.soundNotifications = settings.soundNotifications;
    }
    if (settings.floatNotifications !== undefined) {
      idb.set('float-notifications', settings.floatNotifications);
      this.floatNotifications = settings.floatNotifications;
    }
    if (settings.volume) {
      idb.set('volume', settings.volume);
      this.volume = settings.volume;
    }
  }

  public getRemainingTime() {
    const durationInSeconds = this.getSessionDuration() - this.timeElapsed;
    if (!this.sessionActive) {
      if (this.sessionType === WORKSESSION) {
        return this.formatTime(this.workDuration);
      } else if (this.sessionType === BREAKSESSION) {
        return this.formatTime(this.breakDuration);
      } else if (this.sessionType === LONGBREAKSESSION) {
        return this.formatTime(this.longBreakDuration);
      } 
    }

    return this.formatTime(durationInSeconds);
  }

  public getSessionTypeString() {
    if (this.sessionType === WORKSESSION) {
      return 'Work'
    }
    else if (this.sessionType === BREAKSESSION) {
      return 'Break'
    }
    else if (this.sessionType === LONGBREAKSESSION) {
      return 'Long Break'
    }
  }

  private startCountDown = () => {
    this._ngZone.run(() => {
      this.timeElapsed++;
      if (this.sessionInformation.sessionDuration - this.timeElapsed <= 0) {
        console.log('session done!');
        workerTimers.clearInterval(this.countDown);
        this.sessionDone();
      }
  })}

  // format seconds to mm:ss
  private formatTime(seconds: number) {
    if (!seconds) {
      return '0:00'
    }
    const minutes = Math.floor(seconds / 60);
    seconds = seconds - 60 * minutes;
    
    return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
  }

  private displayNotifications() {
    const notificationMsg = this.getSessionCompleteMsg();
    if (this.soundNotifications) {
      this.audio.volume = this.volume / 100;
      this.audio.play();
    }
    if (this.floatNotifications) {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          const notification = new Notification(notificationMsg);
        }
      });
    }
  }

}