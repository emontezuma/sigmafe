import { TestBed } from '@angular/core/testing';

import { MoldsService } from './molds.service';

describe('MoldsService', () => {
  let service: MoldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
