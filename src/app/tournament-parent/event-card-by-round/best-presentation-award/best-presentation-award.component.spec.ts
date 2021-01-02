import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestPresentationAwardComponent } from './best-presentation-award.component';

describe('BestPresentationAwardComponent', () => {
  let component: BestPresentationAwardComponent;
  let fixture: ComponentFixture<BestPresentationAwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestPresentationAwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestPresentationAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
