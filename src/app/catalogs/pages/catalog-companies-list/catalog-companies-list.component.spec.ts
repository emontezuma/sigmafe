import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogCompaniesListComponent } from './catalog-companies-list.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogCompaniesListComponent;
  let fixture: ComponentFixture<CatalogCompaniesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogCompaniesListComponent]
    });
    fixture = TestBed.createComponent(CatalogCompaniesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
