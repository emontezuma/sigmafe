import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelEllipsisComponent } from './label-ellipsis.component';

describe('LabelEllipsisComponent', () => {
  let component: LabelEllipsisComponent;
  let fixture: ComponentFixture<LabelEllipsisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelEllipsisComponent]
    });
    fixture = TestBed.createComponent(LabelEllipsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
