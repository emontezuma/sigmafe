import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogCustomersListComponent } from './catalog-customers-list.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogCustomersListComponent;
  let fixture: ComponentFixture<CatalogCustomersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogCustomersListComponent]
    });
    fixture = TestBed.createComponent(CatalogCustomersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
