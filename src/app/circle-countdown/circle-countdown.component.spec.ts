import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleCountdownComponent } from './circle-countdown.component';

describe('CircleCountdownComponent', () => {
  let component: CircleCountdownComponent;
  let fixture: ComponentFixture<CircleCountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleCountdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
