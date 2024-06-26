import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogEquipmentsListComponent } from './catalog-equipments-list.component';

describe('CatalogEquipmentsComponent', () => {
  let component: CatalogEquipmentsListComponent;
  let fixture: ComponentFixture<CatalogEquipmentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogEquipmentsListComponent]
    });
    fixture = TestBed.createComponent(CatalogEquipmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
