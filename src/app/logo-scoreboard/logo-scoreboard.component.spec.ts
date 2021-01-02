import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoScoreboardComponent } from './logo-scoreboard.component';

describe('LogoScoreboardComponent', () => {
  let component: LogoScoreboardComponent;
  let fixture: ComponentFixture<LogoScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoScoreboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
