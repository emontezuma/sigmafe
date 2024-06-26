import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleSelectionListComponent } from './multiple-selection-list.component';

describe('MultipleSelectionListComponent', () => {
  let component: MultipleSelectionListComponent;
  let fixture: ComponentFixture<MultipleSelectionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleSelectionListComponent]
    });
    fixture = TestBed.createComponent(MultipleSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
