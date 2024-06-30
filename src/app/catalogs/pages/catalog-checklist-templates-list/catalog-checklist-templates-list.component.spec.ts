import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogChecklistTemplatesListComponent } from './catalog-checklist-templates-list.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogChecklistTemplatesListComponent;
  let fixture: ComponentFixture<CatalogChecklistTemplatesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogChecklistTemplatesListComponent]
    });
    fixture = TestBed.createComponent(CatalogChecklistTemplatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
