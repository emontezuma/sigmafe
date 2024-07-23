import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogChecklistPlansEditionComponent } from './catalog-checklist-plans-edition.component';

describe('CatalogChecklistPlansEditionComponent', () => {
  let component: CatalogChecklistPlansEditionComponent;
  let fixture: ComponentFixture<CatalogChecklistPlansEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogChecklistPlansEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogChecklistPlansEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
