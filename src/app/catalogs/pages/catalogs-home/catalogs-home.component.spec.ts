import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogsHomeComponent } from './catalogs-home.component';

describe('CatalogsHomeComponent', () => {
  let component: CatalogsHomeComponent;
  let fixture: ComponentFixture<CatalogsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogsHomeComponent]
    });
    fixture = TestBed.createComponent(CatalogsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
