import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null; // Si no hay valor, no validamos
    }
    
    // Verifica si hay espacios en blanco EN EL TEXTO
    const hasWhitespace = /\s/.test(value);
    return hasWhitespace ? { whitespace: true } : null;
  };
}