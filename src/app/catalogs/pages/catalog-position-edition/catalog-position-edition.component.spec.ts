import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPositionEditionComponent } from './catalog-position-edition.component';

describe('CatalogPositionEditionComponent', () => {
  let component: CatalogPositionEditionComponent;
  let fixture: ComponentFixture<CatalogPositionEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogPositionEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogPositionEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
