import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogUomEditionComponent } from './catalog-recipient-edition.component';

describe('CatalogUomEditionComponent', () => {
  let component: CatalogUomEditionComponent;
  let fixture: ComponentFixture<CatalogUomEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogUomEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogUomEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
