import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogEquipmentEditionComponent } from './catalog-equipment-edition.component';

describe('CatalogEquipmentEditionComponent', () => {
  let component: CatalogEquipmentEditionComponent;
  let fixture: ComponentFixture<CatalogEquipmentEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogEquipmentEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogEquipmentEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
