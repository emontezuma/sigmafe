import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogChecklistPlansListComponent } from './catalog-checklist-plans-list.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogChecklistPlansListComponent;
  let fixture: ComponentFixture<CatalogChecklistPlansListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogChecklistPlansListComponent]
    });
    fixture = TestBed.createComponent(CatalogChecklistPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
