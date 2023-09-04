import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyFieldComponent } from './readonly-field.component';

describe('ReadonlyFieldComponent', () => {
  let component: ReadonlyFieldComponent;
  let fixture: ComponentFixture<ReadonlyFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadonlyFieldComponent]
    });
    fixture = TestBed.createComponent(ReadonlyFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
