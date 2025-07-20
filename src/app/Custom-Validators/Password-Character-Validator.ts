import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      // Al menos: 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      
      if (value && !passwordRegex.test(value)) {
        return { passwordStrength: true };
      }
      
      return null;
    };
  }