import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogDepartmentsListComponent } from './catalog-departments-list.component';

describe('CatalogDepartmentsComponent', () => {
  let component: CatalogDepartmentsListComponent;
  let fixture: ComponentFixture<CatalogDepartmentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogDepartmentsListComponent]
    });
    fixture = TestBed.createComponent(CatalogDepartmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
