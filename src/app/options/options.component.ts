import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import 'hammerjs'

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  @Output() settingsChange = new EventEmitter<Object>();
  @Input() workDuration: number;
  @Input() breakDuration: number;
  @Input() longBreakDuration: number;
  @Input() sessionsUntilLongBreak: number;
  @Input() soundNotifications: boolean;
  @Input() floatNotifications: boolean;
  @Input() volume: number;

  constructor() { }

  ngOnInit() {
  }

  public settingsFormSubmit() {
      const settingsConfig = {
        workDuration: this.workDuration,
        breakDuration: this.breakDuration,
        longBreakDuration: this.longBreakDuration,
        sessionsUntilLongBreak: this.sessionsUntilLongBreak,
        soundNotifications: this.soundNotifications,
        floatNotifications: this.floatNotifications,
        volume: this.volume
      };
      console.log(settingsConfig)
      this.settingsChange.emit(settingsConfig);
  }

}
