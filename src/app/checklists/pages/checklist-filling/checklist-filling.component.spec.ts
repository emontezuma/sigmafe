import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistFillingComponent } from './checklist-filling.component';

describe('ChecklistFillingComponent', () => {
  let component: ChecklistFillingComponent;
  let fixture: ComponentFixture<ChecklistFillingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistFillingComponent]
    });
    fixture = TestBed.createComponent(ChecklistFillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
