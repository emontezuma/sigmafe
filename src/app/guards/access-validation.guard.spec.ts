import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { accessValidationGuard } from './access-validation.guard';

describe('accessValidationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => accessValidationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
