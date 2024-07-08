import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogGenericEditionComponent } from './catalog-generic-edition.component';

describe('CatalogGenericEditionComponent', () => {
  let component: CatalogGenericEditionComponent;
  let fixture: ComponentFixture<CatalogGenericEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogGenericEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogGenericEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
