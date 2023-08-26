import { TestBed } from '@angular/core/testing';

import { ChecklistsService } from './checklists.service';

describe('ChecklistsServiceTsService', () => {
  let service: ChecklistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
