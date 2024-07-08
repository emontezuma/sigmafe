import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogShiftsListComponent } from './catalog-shifts-list.component';

describe('CatalogShiftsComponent', () => {
  let component: CatalogShiftsListComponent;
  let fixture: ComponentFixture<CatalogShiftsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogShiftsListComponent]
    });
    fixture = TestBed.createComponent(CatalogShiftsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
