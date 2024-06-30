import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPositionsListComponent } from './catalog-positions-list.component';

describe('CatalogPositionsComponent', () => {
  let component: CatalogPositionsListComponent;
  let fixture: ComponentFixture<CatalogPositionsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogPositionsListComponent]
    });
    fixture = TestBed.createComponent(CatalogPositionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
