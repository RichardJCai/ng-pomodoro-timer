import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-set-duration',
  templateUrl: './set-duration.component.html',
  styleUrls: ['./set-duration.component.css']
})
export class SetDurationComponent implements OnInit {
  @Output() workDurationChange = new EventEmitter<number>();
  @Output() breakDurationChange = new EventEmitter<number>();

  public workDuration: number;
  public breakDuration: number;

  constructor() { }

  ngOnInit() {
  }

  setWorkDuration(duration: number) {
    this.workDuration = duration;
    this.workDurationChange.emit(this.workDuration);
  }

  setBreakDuration(duration: number) {
    this.breakDuration = duration;
    this.breakDurationChange.emit(this.breakDuration);
  }

}
