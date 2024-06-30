import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPartNumberEditionComponent } from './catalog-part-number-edition.component';

describe('CatalogPartNumberEditionComponent', () => {
  let component: CatalogPartNumberEditionComponent;
  let fixture: ComponentFixture<CatalogPartNumberEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogPartNumberEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogPartNumberEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
