import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() optionClicked = new EventEmitter<string>();  // Emitting string as temp data
  @Output() statisticsClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  optionEvent() {
    this.optionClicked.emit('test');
  }

  statisticEvent() {
    this.statisticsClicked.emit();
  }



}
