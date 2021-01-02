import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardByRoundComponent } from './event-card-by-round.component';

describe('EventCardByRoundComponent', () => {
  let component: EventCardByRoundComponent;
  let fixture: ComponentFixture<EventCardByRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCardByRoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCardByRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
