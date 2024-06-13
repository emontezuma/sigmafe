import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceHistoryDialogComponent } from './maintenance-history-dialog.component';

describe('MaintenanceHistoryDialogComponent', () => {
  let component: MaintenanceHistoryDialogComponent;
  let fixture: ComponentFixture<MaintenanceHistoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceHistoryDialogComponent]
    });
    fixture = TestBed.createComponent(MaintenanceHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
