import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogMoldsListComponent } from './catalog-molds-list.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogMoldsListComponent;
  let fixture: ComponentFixture<CatalogMoldsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogMoldsListComponent]
    });
    fixture = TestBed.createComponent(CatalogMoldsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
