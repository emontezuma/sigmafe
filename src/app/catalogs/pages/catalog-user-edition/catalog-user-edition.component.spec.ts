import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogUserEditionComponent } from './catalog-user-edition.component';

describe('CatalogUserEditionComponent', () => {
  let component: CatalogUserEditionComponent;
  let fixture: ComponentFixture<CatalogUserEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogUserEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogUserEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
