import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogLinesListComponent } from './catalog-lines-list.component';

describe('CatalogLinesComponent', () => {
  let component: CatalogLinesListComponent;
  let fixture: ComponentFixture<CatalogLinesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogLinesListComponent]
    });
    fixture = TestBed.createComponent(CatalogLinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
