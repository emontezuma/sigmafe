import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogTableEditionComponent } from './catalog-table-edition.component';

describe('CatalogTableEditionComponent', () => {
  let component: CatalogTableEditionComponent;
  let fixture: ComponentFixture<CatalogTableEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogTableEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogTableEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
