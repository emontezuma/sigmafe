import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogMoldsComponent } from './catalog-molds.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogMoldsComponent;
  let fixture: ComponentFixture<CatalogMoldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogMoldsComponent]
    });
    fixture = TestBed.createComponent(CatalogMoldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
