import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  private showOptions = false;
  private showStatistics = false;

  optionClicked() {
    this.showOptions = !this.showOptions;
  }

  statisticsClicked() {
    this.showStatistics = !this.showStatistics;
  }


}
