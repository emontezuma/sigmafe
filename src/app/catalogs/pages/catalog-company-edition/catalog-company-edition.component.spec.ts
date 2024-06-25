import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogCompanyEditionComponent } from './catalog-company-edition.component';

describe('CatalogCompanyEditionComponent', () => {
  let component: CatalogCompanyEditionComponent;
  let fixture: ComponentFixture<CatalogCompanyEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogCompanyEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogCompanyEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
