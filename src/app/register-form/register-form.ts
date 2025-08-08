import { ApplicationRef, ChangeDetectorRef, Component, NgZone, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { LoginForm } from '../All-the-Forms/login-form/login-form';
import { JoinForm } from '../All-the-Forms/join-form/join-form';
import { ConfirmationForm } from '../All-the-Forms/confirmation-form/confirmation-form';
import { ResetPassword } from "../All-the-Forms/Reset-password/reset-password/reset-password";

export interface AuthData {
  email: string;
  password: string;
  rememberMe?: boolean;
  repitPassword?: string;
  confirmationCode?: string;
  newPassword?: string;
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    LoginForm,
    JoinForm,
    ConfirmationForm,
    ResetPassword
],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterForm {
  animating = false;
  params: 'join' | 'login' | 'confirmation' | 'new-password' = 'join';
  
  // Estados compartidos
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  pendingUsername = '';
  
  private challengeUser: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const param = params.get('params');
      const validParam = param === 'join' || param === 'login' ? param : 'join';
      this.params = validParam;
    });
  }

  paramsChanger(target: 'login' | 'join' | 'confirmation' | 'new-password') {
    
    this.animating = true;
    this.cdr.detectChanges();
  
      setTimeout(() => {
        this.clearMessages();
        this.params = target;
        this.animating = false;
        this.cdr.detectChanges();
      }, 300);
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Event handlers para cada formulario
  onLoginSubmit(data: AuthData) {
    this.handleLogin(data);
  }

  onJoinSubmit(data: AuthData) {
    this.handleSignUp(data);
  }

  onConfirmationSubmit(data: AuthData) {
    this.handleConfirmation(data);
  }

  onNewPasswordSubmit(data: AuthData) {
    this.handleNewPassword(data);
  }

  onResendCode() {
    this.handleResendCode();
  }


  // Métodos de manejo de autenticación (mantén tu lógica actual)
  private async handleLogin(data: AuthData) {
    this.isLoading = true;
    this.clearMessages();

    try {
      const { signIn } = await import('aws-amplify/auth');
      const response = await signIn({ 
        username: data.email, 
        password: data.password 
      });

        if (response.isSignedIn) {
          this.successMessage = 'Inicio de sesión exitoso';
          setTimeout(() => {
            this.router.navigate(['/patient']);
          }, 1500);
        } else {
          if (response.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
            this.pendingUsername = data.email;
            this.paramsChanger('confirmation');
            this.successMessage = `Debes confirmar tu cuenta. Se envió un código a ${data.email}`;
          } else if (response.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
            this.challengeUser = response;
            this.paramsChanger('new-password');
          } else {
            this.errorMessage = 'Se requiere verificación adicional';
          }
        };
    } catch (error: any) {
    
        this.handleAuthError(error);

    } finally {
        this.isLoading = false;
    }
  }

  private async handleSignUp(data: AuthData) {
    this.isLoading = true;
    this.clearMessages();

    try {
      const { signUp } = await import('aws-amplify/auth');
      await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: { email: data.email }
        }
      });

   
        this.pendingUsername = data.email;
        this.paramsChanger('confirmation');
        this.successMessage = `Si no recibe el codigo pruebe con el boton reenviar o revise si el correo es Correcto`;

    } catch (error: any) {
        this.handleAuthError(error);
    } finally {
        this.isLoading = false;
    }
  }

  private async handleConfirmation(data: AuthData) {
    this.isLoading = true;
    this.clearMessages();

    try {
      const { confirmSignUp } = await import('aws-amplify/auth');
      const response = await confirmSignUp({
        username: this.pendingUsername,
        confirmationCode: data.confirmationCode!
      });

      if (response.isSignUpComplete) {
        this.successMessage = 'Cuenta confirmada exitosamente';
        setTimeout(() => this.paramsChanger('login'), 2000);
      }
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async handleNewPassword(data: AuthData) {
    this.isLoading = true;
    this.clearMessages();

    try {
      const { confirmSignIn } = await import('aws-amplify/auth');
      const response = await confirmSignIn({
        challengeResponse: data.newPassword!
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

  private async handleResendCode() {
    this.isLoading = true;
    this.clearMessages();

    try {
      const { resendSignUpCode } = await import('aws-amplify/auth');
      await resendSignUpCode({ username: this.pendingUsername });
      this.successMessage = 'Código reenviado exitosamente';
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleAuthError(error: any) {
    
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

    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}