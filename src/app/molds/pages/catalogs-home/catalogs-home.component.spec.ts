import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldsHomeComponent } from './catalogs-home.component';

describe('MoldsHomeComponent', () => {
  let component: MoldsHomeComponent;
  let fixture: ComponentFixture<MoldsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoldsHomeComponent]
    });
    fixture = TestBed.createComponent(MoldsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
