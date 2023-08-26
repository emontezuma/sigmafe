import { CanDeactivateFn } from '@angular/router';

export const formDeactivateGuard: CanDeactivateFn<unknown> = (component: any, currentRoute, currentState, nextState) => {
  if (component && component.unsavedChanges) {
    return confirm('Los datos no se han guardado, desea cambiar?');
  } else {
    return true;
  }
  
};
