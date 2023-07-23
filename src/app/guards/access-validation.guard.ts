import { CanActivateFn } from '@angular/router';

export const accessValidationGuard: CanActivateFn = (route, state) => {
  return true;
};
