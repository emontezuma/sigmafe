import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RecordStatus } from '../shared/models';

export class CustomValidators {
  static statusIsInactiveValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {      
      if (control.value && control.value.status != RecordStatus.ACTIVE) {
        console.log('entro aqui 88');
        return { statusIsInactive: true };
      }

      console.log('entro aqui 99');
      return null;
    };
  }
}
