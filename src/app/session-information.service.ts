import { Injectable } from '@angular/core';

@Injectable()
export class SessionInformationService {
  startTime: Date;
  currentTime: Date;
  sessionDuration: number;
  sessionType: string;
  taskName: string;

  constructor() { }

  setStartTime(time) {
    this.startTime = time;
  }

  getStartTime(time) {
    return this.startTime;
  }

}
