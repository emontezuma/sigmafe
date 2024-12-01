import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogUomsListComponent } from './catalog-recipients-list.component';

describe('CatalogUomsComponent', () => {
  let component: CatalogUomsListComponent;
  let fixture: ComponentFixture<CatalogUomsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogUomsListComponent]
    });
    fixture = TestBed.createComponent(CatalogUomsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
