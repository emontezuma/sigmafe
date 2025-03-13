import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../shared/services';
import { inject } from '@angular/core';

export const accessValidationGuard: CanActivateFn = (route, state) => {  
  if (inject(SharedService).userIsAuthenticated()) {
    if (route.data?.['accessType'] === 'admin' && !inject(SharedService).isAdminUser()) {
      inject(SharedService).showSnackMessage({
        message: `Esta opción es para usuarios Administradores`,
        snackClass: 'snack-warn',
        progressBarColor: 'warn',
        icon: 'admin',
      });  
      return false
    } else if (route.data?.['accessType'] === 'team-leader' && !inject(SharedService).isTeamLeader() && !inject(SharedService).isAdminUser()) {
      inject(SharedService).showSnackMessage({
        message: `Esta opción es para usuarios Team Leaders`,
        snackClass: 'snack-warn',
        progressBarColor: 'warn',
        icon: 'admin',
      });  
      return false
    } 
    
  } else {
    inject(Router).navigate(['/checklists/login']);
    inject(SharedService).showSnackMessage({
        message: `Por favor ingrese al sistema`,
        snackClass: 'snack-primary',
        progressBarColor: 'primary',
        icon: 'admin',
      });  
    return false
  }
  return true;
};
