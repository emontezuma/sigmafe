import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPlantEditionComponent } from './catalog-plant-edition.component';

describe('CatalogPlantEditionComponent', () => {
  let component: CatalogPlantEditionComponent;
  let fixture: ComponentFixture<CatalogPlantEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogPlantEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogPlantEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
