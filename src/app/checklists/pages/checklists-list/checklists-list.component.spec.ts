import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistsListComponent } from './checklists-list.component';

describe('CatalogMoldsComponent', () => {
  let component: ChecklistsListComponent;
  let fixture: ComponentFixture<ChecklistsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistsListComponent]
    });
    fixture = TestBed.createComponent(ChecklistsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
