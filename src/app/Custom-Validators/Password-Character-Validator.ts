import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
   
    if (!value) {
      return null;
    }

    // 1. Verificar longitud
    if (value.length < 8 || value.length > 50) {
      return { invalidLength: true };
    }

    // 2. Verificar caracteres permitidos únicamente
    const allowedCharsOnly = /^[a-zA-Z0-9@$!%*?&#+=\-_.,;:\/~^()]+$/.test(value);
    if (!allowedCharsOnly) {
      return { invalidCharacters: true };
    }

    // 3. Verificar fortaleza
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&#+=\-_.,;:\/~^()]/.test(value);
   
    const isStrong = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
   
    if (!isStrong) {
      return { passwordStrength: true };
    }

    return null;
  };
}