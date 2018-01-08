import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisicsComponent } from './statisics.component';

describe('StatisicsComponent', () => {
  let component: StatisicsComponent;
  let fixture: ComponentFixture<StatisicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
