import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AuthData } from '../../register-form/register-form';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginForm {
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() submitForm = new EventEmitter<AuthData>();
  @Output() switchToJoin = new EventEmitter<void>();
  @Output() switchToPassword = new EventEmitter<void>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.loginForm.value);
  }
}
