import { Injectable } from '@angular/core';

@Injectable()
export class SessionInformationService {
  startTimeInformation: Date;
  startTime: Date;
  sessionDuration: number;
  sessionType: number;
  taskName: string;
  elapsedTime: number;

  constructor() { }

  setStartTime(time) {
    this.startTime = time;
  }

  getStartTime(time) {
    return this.startTime;
  }

  setSessionDuration(duration: number) {
    this.sessionDuration = duration;
  }

}
