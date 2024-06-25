import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProviderEditionComponent } from './catalog-provider-edition.component';

describe('CatalogProviderEditionComponent', () => {
  let component: CatalogProviderEditionComponent;
  let fixture: ComponentFixture<CatalogProviderEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogProviderEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogProviderEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
