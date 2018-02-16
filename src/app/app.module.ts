import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';

// Material Angular
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { OptionsComponent } from './options/options.component';
import { StatisicsComponent } from './statisics/statisics.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CountdownComponent } from './countdown/countdown.component';
import { CircleCountdownComponent } from './circle-countdown/circle-countdown.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    OptionsComponent,
    StatisicsComponent,
    ToolbarComponent,
    CountdownComponent,
    CircleCountdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSliderModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
