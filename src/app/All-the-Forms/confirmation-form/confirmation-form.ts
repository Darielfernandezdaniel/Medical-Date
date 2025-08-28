import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthData } from '../../Interfaces/Insurances';

@Component({
  selector: 'app-confirmation-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './confirmation-form.html',
  styleUrls: ['./confirmation-form.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationForm {
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() pendingUsername = '';
  
  @Output() submitForm = new EventEmitter<AuthData>();
  @Output() resendCode = new EventEmitter<void>();

  confirmationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.confirmationForm = this.fb.group({
      confirmationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSubmit() {
    if (this.confirmationForm.invalid) {
      this.confirmationForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.confirmationForm.value);
  }
}
