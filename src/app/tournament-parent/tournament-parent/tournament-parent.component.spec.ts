import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentParentComponent } from './tournament-parent.component';

describe('TournamentParentComponent', () => {
  let component: TournamentParentComponent;
  let fixture: ComponentFixture<TournamentParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentParentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
