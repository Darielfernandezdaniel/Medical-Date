import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { signUp, signIn, confirmSignUp, resendSignUpCode, confirmSignIn } from 'aws-amplify/auth';
import { fieldsMatchValidator } from '../Custom-Validators/Match-Validator';
import { passwordStrengthValidator } from '../Custom-Validators/Password-Character-Validator';
import { noWhitespaceValidator } from '../Custom-Validators/no-whitespace.validator';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css']
})
export class RegisterForm {
  animating = false;
  params: 'join' | 'login' | 'confirmation' | 'new-password'  = 'join';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  pendingUsername = '';
  private challengeUser: any = null;
  
  private destroy$ = new Subject<void>();
  RegisterForm!: FormGroup;
  ConfirmationForm!: FormGroup;
  resendPasswordForm!: FormGroup

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone 
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const param = params.get('params');
      const validParam = param === 'join' || param === 'login' ? param : 'join';
      this.params = validParam;
      this.initForm(validParam);
      this.cdr.detectChanges();
    });
  }

  paramsChanger(target: 'login' | 'join' | 'confirmation' | 'new-password' ) {
    if (this.params === target) return;
    this.animating = true;
    
    this.initForm(target);

    setTimeout(() => {
      this.params = target;
      this.animating = false;
      this.cdr.detectChanges(); // Fuerza actualización
    }, 300);
  }

  private initForm(formType: 'join' | 'login' | 'confirmation' | 'new-password' ) {
    if (formType === 'join') {
      
      this.RegisterForm = this.fb.group({
        password: ['', [ Validators.required, Validators.minLength(8), passwordStrengthValidator(), 
                        Validators.maxLength(15), noWhitespaceValidator()]],
        repitPassword: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        rememberMe: [false]
      }, {validators: fieldsMatchValidator('password', 'repitPassword')});

    } else if (formType === 'login') {
      this.RegisterForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        rememberMe: [false]
      });

    } else if (formType === 'confirmation') {
      this.ConfirmationForm = this.fb.group({
        confirmationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      });

    } else if (formType === 'new-password') {
      this.resendPasswordForm = this.fb.group({
        newPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          passwordStrengthValidator(),
          Validators.maxLength(15),
          noWhitespaceValidator()
        ]]
      });
    }
  }

  async enviarDataJoin() {
    if (this.RegisterForm.invalid) {
      this.RegisterForm.markAllAsTouched();
      return;
    }
  
    this.isLoading = true; // Angular detecta este cambio porque está antes del await
    this.errorMessage = '';
    this.successMessage = '';
  
    try {
      const { email, password } = this.RegisterForm.value;
      await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: { email }
        }
      });

      this.zone.run(() => {
        this.pendingUsername = email;
        this.paramsChanger('confirmation'); // Ahora paramsChanger también se ejecutará en la zona
        this.successMessage = `Hemos enviado un código de confirmación a ${email}`;
      });
  
    } catch (error: any) {
      this.zone.run(() => {
        this.handleAuthError(error);
      });

    } finally {
      this.zone.run(() => {
        this.isLoading = false;
      });
    }
  }

  async enviarDataLogin() {
    if (this.RegisterForm.invalid) {
      this.RegisterForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { email, password } = this.RegisterForm.value;
      const response = await signIn({ username: email, password });
  
      this.zone.run(() => {
        if (response.isSignedIn) {
          this.successMessage = 'Inicio de sesión exitoso';
          setTimeout(() => {
            this.router.navigate(['/patient']);
          }, 1500);
        } else {
          if (response.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
            this.pendingUsername = email;
            this.paramsChanger('confirmation');
            this.successMessage = `Debes confirmar tu cuenta. Se envió un código a ${email}`;
          } else if(response.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
            this.challengeUser = response;
            this.paramsChanger('new-password');
          }
          else {
            this.errorMessage = 'Se requiere verificación adicional';
            console.log('nextStep:', response.nextStep);
          }
        }
      });
    } catch (error: any) {
      this.zone.run(() => {
        this.handleAuthError(error);
      });
    } finally {
      this.zone.run(() => {
        this.isLoading = false;
      });
    }
  }
  private handleAuthError(error: any) {
    this.errorMessage = ''; // Limpio error por defecto

    switch (error.name) {
      case 'UsernameExistsException':
        this.errorMessage = 'Email existente. Por favor intente iniciar sesión';
        break;
      case 'InvalidPasswordException':
        this.errorMessage = 'La contraseña no cumple con los requisitos';
        break;
      case 'UserNotConfirmedException':
        this.errorMessage = 'Debes confirmar tu cuenta primero';
        break;
      case 'NotAuthorizedException':
        this.errorMessage = 'Email o contraseña incorrectos';
        break;
      case 'UserNotFoundException':
        this.errorMessage = 'Usuario no encontrado';
        break;
      case 'CodeMismatchException':
        this.errorMessage = 'Código de confirmación incorrecto';
        break;
      case 'ExpiredCodeException':
        this.errorMessage = 'El código ha expirado. Solicita uno nuevo';
        break;
      case 'LimitExceededException':
        this.errorMessage = 'Demasiados intentos. Intenta más tarde';
        break;
      default:
        this.errorMessage = error.message || 'Ha ocurrido un error inesperado';
    }
  }

  async confirmSignUpCode() {
    if (this.ConfirmationForm.invalid) {
      this.ConfirmationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { confirmationCode } = this.ConfirmationForm.value;
      const response = await confirmSignUp({
        username: this.pendingUsername,
        confirmationCode
      });

      if (response.isSignUpComplete) {
        this.successMessage = 'Cuenta confirmada exitosamente';
        this.animating = true;
        setTimeout(() => this.paramsChanger('login'), 2000);
        this.animating= false
      }
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async resendConfirmationCode() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await resendSignUpCode({ username: this.pendingUsername });
      this.successMessage = 'Código reenviado exitosamente';
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async enviarNuevaPassword() {
    if (this.RegisterForm.invalid) {
      this.RegisterForm.markAllAsTouched();
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    try {
      const { newPassword } = this.resendPasswordForm.value;
  
      const response = await confirmSignIn({
        challengeResponse: newPassword
      });

      if (response.isSignedIn) {
        this.successMessage = 'Contraseña actualizada correctamente';
        setTimeout(() => {
          this.router.navigate(['/patient']);
        }, 1500);
      }
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
