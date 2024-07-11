import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogChecklistTemplatesEditionComponent } from './catalog-checklist-templates-edition.component';

describe('CatalogChecklistTemplatesEditionComponent', () => {
  let component: CatalogChecklistTemplatesEditionComponent;
  let fixture: ComponentFixture<CatalogChecklistTemplatesEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogChecklistTemplatesEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogChecklistTemplatesEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
