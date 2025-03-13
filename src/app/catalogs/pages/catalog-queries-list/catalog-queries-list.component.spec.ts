import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogQueriesListComponent } from './catalog-queries-list.component';

describe('CatalogDepartmentsComponent', () => {
  let component: CatalogQueriesListComponent;
  let fixture: ComponentFixture<CatalogQueriesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogQueriesListComponent]
    });
    fixture = TestBed.createComponent(CatalogQueriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
