import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogShiftEditionComponent } from './catalog-shift-edition.component';

describe('CatalogShiftEditionComponent', () => {
  let component: CatalogShiftEditionComponent;
  let fixture: ComponentFixture<CatalogShiftEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogShiftEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogShiftEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
