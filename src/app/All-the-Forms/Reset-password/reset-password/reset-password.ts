import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthData } from '../../../register-form/register-form';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordStrengthValidator } from '../../../Custom-Validators/Password-Character-Validator';
import { noWhitespaceValidator } from '../../../Custom-Validators/no-whitespace.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() submitForm = new EventEmitter<AuthData>();
  @Output() returnLogin = new EventEmitter<void>();

  newPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator(),
        Validators.maxLength(15),
        noWhitespaceValidator()
      ]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.newPasswordForm.value);
  }
}
