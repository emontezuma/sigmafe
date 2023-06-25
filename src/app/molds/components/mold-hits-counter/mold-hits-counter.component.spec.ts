import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldHitsCounterComponent } from './mold-hits-counter.component';

describe('MoldHitsCounterComponent', () => {
  let component: MoldHitsCounterComponent;
  let fixture: ComponentFixture<MoldHitsCounterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoldHitsCounterComponent]
    });
    fixture = TestBed.createComponent(MoldHitsCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
