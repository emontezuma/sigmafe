import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPartNumbersListComponent } from './catalog-part-numbers-list.component';

describe('CatalogPartNumbersComponent', () => {
  let component: CatalogPartNumbersListComponent;
  let fixture: ComponentFixture<CatalogPartNumbersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogPartNumbersListComponent]
    });
    fixture = TestBed.createComponent(CatalogPartNumbersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
