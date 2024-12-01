import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogSigmaTypeEditionComponent } from './catalog-sigma-type-edition.component';

describe('CatalogManufacturerEditionComponent', () => {
  let component: CatalogSigmaTypeEditionComponent;
  let fixture: ComponentFixture<CatalogSigmaTypeEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogSigmaTypeEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogSigmaTypeEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
