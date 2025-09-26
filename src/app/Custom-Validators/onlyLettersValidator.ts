import { AbstractControl, ValidatorFn } from "@angular/forms";

export const onlyLettersValidator = (): ValidatorFn => {
  return (control: AbstractControl) => {
    const value = control.value;
    // Solo letras y espacios
    return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value) ? null : { onlyLetters: true };
  };
};