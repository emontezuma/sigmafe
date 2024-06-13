import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RecordStatus } from '../shared/models';

export class CustomValidators {
  static statusIsInactiveValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {      
      if (control.value && control.value.status != RecordStatus.ACTIVE) {
        return { statusIsInactive: true };
      }

      return null;
    };
  }
}
