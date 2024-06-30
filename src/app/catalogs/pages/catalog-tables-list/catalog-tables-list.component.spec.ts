import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogTablesListComponent } from './catalog-tables-list.component';

describe('CatalogTablesComponent', () => {
  let component: CatalogTablesListComponent;
  let fixture: ComponentFixture<CatalogTablesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogTablesListComponent]
    });
    fixture = TestBed.createComponent(CatalogTablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
