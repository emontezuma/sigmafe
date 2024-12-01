import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogMoldControlEditionComponent } from './catalog-mold-control-edition.component';

describe('CatalogMoldControlEditionComponent', () => {
  let component: CatalogMoldControlEditionComponent;
  let fixture: ComponentFixture<CatalogMoldControlEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogMoldControlEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogMoldControlEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
