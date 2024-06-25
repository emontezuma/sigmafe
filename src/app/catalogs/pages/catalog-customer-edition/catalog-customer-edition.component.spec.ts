import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogVariableEditionComponent } from './catalog-variable-edition.component';

describe('CatalogVariableEditionComponent', () => {
  let component: CatalogVariableEditionComponent;
  let fixture: ComponentFixture<CatalogVariableEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogVariableEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogVariableEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
