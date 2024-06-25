import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProvidersListComponent } from './catalog-providers-list.component';

describe('CatalogProvidersComponent', () => {
  let component: CatalogProvidersListComponent;
  let fixture: ComponentFixture<CatalogProvidersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogProvidersListComponent]
    });
    fixture = TestBed.createComponent(CatalogProvidersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
