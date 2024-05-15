import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionToolbarComponent } from './question-toolbar.component';

describe('ToolbarComponent', () => {
  let component: QuestionToolbarComponent;
  let fixture: ComponentFixture<QuestionToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionToolbarComponent]
    });
    fixture = TestBed.createComponent(QuestionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
