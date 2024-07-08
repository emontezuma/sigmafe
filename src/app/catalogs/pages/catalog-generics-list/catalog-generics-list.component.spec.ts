import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogGenericsListComponent } from './catalog-generics-list.component';

describe('CatalogGenericsComponent', () => {
  let component: CatalogGenericsListComponent;
  let fixture: ComponentFixture<CatalogGenericsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogGenericsListComponent]
    });
    fixture = TestBed.createComponent(CatalogGenericsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
