import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldFastQueryComponent } from './mold-fast-query.component';

describe('MoldFastQueryComponent', () => {
  let component: MoldFastQueryComponent;
  let fixture: ComponentFixture<MoldFastQueryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoldFastQueryComponent]
    });
    fixture = TestBed.createComponent(MoldFastQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
