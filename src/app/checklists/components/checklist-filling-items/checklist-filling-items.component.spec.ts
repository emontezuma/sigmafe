import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistFillingItemsComponent } from './checklist-filling-items.component';

describe('ChecklistFillingItemsComponent', () => {
  let component: ChecklistFillingItemsComponent;
  let fixture: ComponentFixture<ChecklistFillingItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistFillingItemsComponent]
    });
    fixture = TestBed.createComponent(ChecklistFillingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
