import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogVariablesListComponent } from './catalog-variables-list.component';

describe('CatalogMoldsComponent', () => {
  let component: CatalogVariablesListComponent;
  let fixture: ComponentFixture<CatalogVariablesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogVariablesListComponent]
    });
    fixture = TestBed.createComponent(CatalogVariablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
