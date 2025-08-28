import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestorePassword } from '../../../Services/RestorePassword-password';
import { passwordStrengthValidator } from '../../../Custom-Validators/Password-Character-Validator';
import { noWhitespaceValidator } from '../../../Custom-Validators/no-whitespace.validator';
import { AuthData } from '../../../Interfaces/Insurances';

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
  @Input() emailConfirmation = '';
  @Input() codecConfirmation = '';
  @Output() submitForm = new EventEmitter<AuthData>();
  @Output() returnLogin = new EventEmitter<void>();

  emailForm!: FormGroup;
  newPasswordForm!: FormGroup;
  formStatus: string | null = null;
  private currentEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private restorePassword: RestorePassword,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForms();
  }

  private initForms() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // CORREGIDO: El formControlName debe coincidir con el template
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        passwordStrengthValidator(),
        noWhitespaceValidator()
      ]],
      codec: ['', [ // CAMBIADO: 'code' -> 'codec' para coincidir con el template
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^\d+$/)
      ]]
    });
  }

  onSubmitEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    // Limpiar mensajes previos
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();
    const email = this.emailForm.get('email')!.value;
    
    this.restorePassword.checkEmailForSendCode(email)
      .then(serviceState => {
        this.formStatus = 'newPassword'; 
        this.currentEmail = email;
        this.successMessage = 'Correo enviado, revisa tu email.';
        this.errorMessage = '';
        this.isLoading = false;
        this.cdr.detectChanges();
        this.emailForm.get('email')!.disable();
      })
      .catch((error) => {
        console.error('Error al enviar correo:', error);
        this.errorMessage = 'Error al enviar el correo. Intenta de nuevo.';
        this.successMessage = '';
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  onSubmitNewPassword() {
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    // Limpiar mensajes previos
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;
    
    const code = this.newPasswordForm.get('codec')!.value;
    const newPassword = this.newPasswordForm.get('newPassword')!.value;

    this.restorePassword.resetPasswordWithCode(this.currentEmail, code, newPassword)
      .then(() => {
        this.successMessage = 'Contraseña restablecida exitosamente.';
        this.errorMessage = '';
        this.isLoading = false;
        this.submitForm.emit();
        
        setTimeout(() => {
          this.returnLogin.emit();
        }, 2000);
        
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error al restablecer contraseña:', error);
        this.errorMessage = 'Error al restablecer la contraseña. Intenta nuevamente.';
        this.successMessage = '';
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
}