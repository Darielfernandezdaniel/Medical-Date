import { AbstractControl } from "@angular/forms";

export function onlyNumbersValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      return /^[0-9]*$/.test(value) ? null : { onlyNumbers: true };
    };
  }