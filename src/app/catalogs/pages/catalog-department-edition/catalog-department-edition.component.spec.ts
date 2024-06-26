import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogDepartmentEditionComponent } from './catalog-department-edition.component';

describe('CatalogDepartmentEditionComponent', () => {
  let component: CatalogDepartmentEditionComponent;
  let fixture: ComponentFixture<CatalogDepartmentEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogDepartmentEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogDepartmentEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
