import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPlantsListComponent } from './catalog-plants-list.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogPlantsListComponent;
  let fixture: ComponentFixture<CatalogPlantsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogPlantsListComponent]
    });
    fixture = TestBed.createComponent(CatalogPlantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
