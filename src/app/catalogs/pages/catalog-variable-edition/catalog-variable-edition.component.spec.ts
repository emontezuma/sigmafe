import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogMoldEditionComponent } from './catalog-mold-edition.component';

describe('CatalogMoldEditionComponent', () => {
  let component: CatalogMoldEditionComponent;
  let fixture: ComponentFixture<CatalogMoldEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogMoldEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogMoldEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
