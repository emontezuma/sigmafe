import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistsHomeComponent } from './checklists-home.component';

describe('ChecklistsHomeComponent', () => {
  let component: ChecklistsHomeComponent;
  let fixture: ComponentFixture<ChecklistsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistsHomeComponent]
    });
    fixture = TestBed.createComponent(ChecklistsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
