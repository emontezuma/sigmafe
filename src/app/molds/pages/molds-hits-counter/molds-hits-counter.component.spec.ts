import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldsHitsCounterComponent } from './molds-hits-counter.component';

describe('MoldsHitsCounterComponent', () => {
  let component: MoldsHitsCounterComponent;
  let fixture: ComponentFixture<MoldsHitsCounterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoldsHitsCounterComponent]
    });
    fixture = TestBed.createComponent(MoldsHitsCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
