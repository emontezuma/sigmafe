import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistTemplateEditionLineComponent } from './checklist-template-edition-line.component';

describe('ChecklistTemplateEditionLineComponent', () => {
  let component: ChecklistTemplateEditionLineComponent;
  let fixture: ComponentFixture<ChecklistTemplateEditionLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistTemplateEditionLineComponent]
    });
    fixture = TestBed.createComponent(ChecklistTemplateEditionLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
