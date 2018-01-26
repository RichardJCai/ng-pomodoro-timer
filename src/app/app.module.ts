import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { OptionsComponent } from './options/options.component';
import { StatisicsComponent } from './statisics/statisics.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CountdownComponent } from './countdown/countdown.component';
import { SetDurationComponent } from './set-duration/set-duration.component';
import { CircleCountdownComponent } from './circle-countdown/circle-countdown.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    OptionsComponent,
    StatisicsComponent,
    ToolbarComponent,
    CountdownComponent,
    SetDurationComponent,
    CircleCountdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
