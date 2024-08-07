import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDialogComponent } from './variable-selection-dialog.component';

describe('GenericDialogComponent', () => {
  let component: GenericDialogComponent;
  let fixture: ComponentFixture<GenericDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericDialogComponent]
    });
    fixture = TestBed.createComponent(GenericDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
