import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteFieldComponent } from './auto-complete-field.component';

describe('LabelEllipsisComponent', () => {
  let component: AutoCompleteFieldComponent;
  let fixture: ComponentFixture<AutoCompleteFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoCompleteFieldComponent]
    });
    fixture = TestBed.createComponent(AutoCompleteFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
