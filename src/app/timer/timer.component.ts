import { Component, OnInit } from '@angular/core';
import {SessionInformationService} from '../session-information.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  sessionInformation: SessionInformationService;
  timeRemaining = 0;

  constructor() {
    // Load from db if user is logged in
    this.sessionInformation = new SessionInformationService();
  }

  ngOnInit() {
  }

  startSession() {
    // Add start date to db to track info
    const currentTime = new Date();
    this.sessionInformation.setStartTime(currentTime);
  }

  pauseSession() {
    console.log('pause');
  }

  stopSession() {
    console.log(this.sessionInformation.getElapsedTime());
  }



}
