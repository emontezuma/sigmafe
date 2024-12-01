import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogSigmaTypesListComponent } from './catalog-sigma-types-list.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogSigmaTypesListComponent;
  let fixture: ComponentFixture<CatalogSigmaTypesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogSigmaTypesListComponent]
    });
    fixture = TestBed.createComponent(CatalogSigmaTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
