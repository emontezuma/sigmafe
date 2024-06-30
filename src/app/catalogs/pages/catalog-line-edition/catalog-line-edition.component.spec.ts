import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogLineEditionComponent } from './catalog-line-edition.component';

describe('CatalogLineEditionComponent', () => {
  let component: CatalogLineEditionComponent;
  let fixture: ComponentFixture<CatalogLineEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogLineEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogLineEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
