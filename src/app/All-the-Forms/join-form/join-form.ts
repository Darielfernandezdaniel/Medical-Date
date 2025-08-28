import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { passwordStrengthValidator } from '../../Custom-Validators/Password-Character-Validator';
import { noWhitespaceValidator } from '../../Custom-Validators/no-whitespace.validator';
import { fieldsMatchValidator } from '../../Custom-Validators/Match-Validator';
import { AuthData } from '../../Interfaces/Insurances';


@Component({
  selector: 'app-join-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './join-form.html',
  styleUrl: './join-form.css'
})
export class JoinForm {
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() submitForm = new EventEmitter<AuthData>();
  @Output() switchToLogin = new EventEmitter<void>();
  @Output() switchToPassword = new EventEmitter<void>();

  joinForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.joinForm = this.fb.group({
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        passwordStrengthValidator(), 
        Validators.maxLength(15), 
        noWhitespaceValidator()
      ]],
      repitPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rememberMe: [false]
    }, { validators: fieldsMatchValidator('password', 'repitPassword') });
  }

  onSubmit() {
    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.joinForm.value);
  }
}
