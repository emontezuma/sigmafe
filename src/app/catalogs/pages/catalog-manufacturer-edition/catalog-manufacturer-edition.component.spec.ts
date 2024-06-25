import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogManufacturerEditionComponent } from './catalog-manufacturer-edition.component';

describe('CatalogManufacturerEditionComponent', () => {
  let component: CatalogManufacturerEditionComponent;
  let fixture: ComponentFixture<CatalogManufacturerEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogManufacturerEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogManufacturerEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
