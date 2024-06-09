import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyLoadingListComponent } from './lazy-loading-list.component';

describe('LazyLoadingListComponent', () => {
  let component: LazyLoadingListComponent;
  let fixture: ComponentFixture<LazyLoadingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LazyLoadingListComponent]
    });
    fixture = TestBed.createComponent(LazyLoadingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
