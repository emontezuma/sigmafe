import { TestBed } from '@angular/core/testing';

import { CustomPaginator } from './custom-paginator.service';

describe('CustomPaginator', () => {
  let service: CustomPaginator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomPaginator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
