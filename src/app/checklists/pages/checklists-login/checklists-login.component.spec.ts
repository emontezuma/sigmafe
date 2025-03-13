import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistsLoginComponent } from './checklists-login.component';

describe('CatalogMoldsComponent', () => {
  let component: ChecklistsLoginComponent;
  let fixture: ComponentFixture<ChecklistsLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistsLoginComponent]
    });
    fixture = TestBed.createComponent(ChecklistsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
