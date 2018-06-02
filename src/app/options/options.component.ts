import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import 'hammerjs'

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  @Output() settingsChange = new EventEmitter<Object>();
  @Input() workDurationPlaceHolder;
  @Input() breakDurationPlaceHolder;
  @Input() longBreakDurationPlaceHolder;
  @Input() sessionsUntilLongBreakPlaceHolder;
  public soundNotifications: boolean;
  public floatNotifications: boolean;

  public readonly timeValues = [300, 600, 900, 1500, 1800, 2700, 3600] // Time in seconds

  ngOnInit() {
  }

  public settingsFormSubmit(workDuration: number, breakDuration: number, longBreakDuration: number,
    sessionsUntilLongBreak: number) {
      const settingsConfig = {
        workDuration: workDuration,
        breakDuration: breakDuration,
        longBreakDuration: longBreakDuration,
        sessionsUntilLongBreak: sessionsUntilLongBreak
      };
      this.settingsChange.emit(settingsConfig);
  }

}
