import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { LoginForm } from '../All-the-Forms/login-form/login-form';
import { JoinForm } from '../All-the-Forms/join-form/join-form';
import { ConfirmationForm } from '../All-the-Forms/confirmation-form/confirmation-form';
import { ResetPassword } from "../All-the-Forms/Reset-password/reset-password/reset-password";
import { AuthStatus } from '../Services/auth-status';
import { AuthData } from '../Interfaces/Insurances';
import { Store } from '@ngrx/store';
import * as AuthActions from '../auth/store/actions/auth.actions';
import { DataForm } from "../All-the-Forms/data-form/data-form";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    LoginForm,
    JoinForm,
    ConfirmationForm,
    ResetPassword,
    DataForm
],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterForm {
  animating = false;
  params: 'join' | 'login' | 'confirmation' | 'new-password' | 'dataProfile' = 'dataProfile';
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  pendingUsername = '';

  fadeClass = 'fade-in';
  
  private challengeUser: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthStatus,
    private store: Store
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const param = params.get('params');
      const validParam = param === 'join' || param === 'login' ? param : 'dataProfile';
      this.params = validParam;
    });
  }

  paramsChanger(target: 'login' | 'join' | 'confirmation' | 'new-password'|'dataProfile') {
    this.animating = true;
    this.cdr.detectChanges();
  
    setTimeout(() => {
      this.clearMessages();
      this.params = target;
      this.animating = false;
      this.cdr.detectChanges();
    }, 200);
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

  // Métodos que manejan la UI y llaman al servicio
  private async handleLogin(data: AuthData) {
    this.isLoading = true;
    this.clearMessages();

    try {
      const response = await this.authService.login(data);
      
      if (response.success && response.isSignedIn) {
        this.successMessage = response.message!;

        this.store.dispatch(AuthActions.loginSuccess({ email: data.email }))
        this.fadeClass = 'fade-out';
        this.cdr.detectChanges();
        
        setTimeout(() => {
          
          this.router.navigate(['/patient']);
        }, 1500);
      } else if (!response.success) {
        this.errorMessage = response.error!;
        this.store.dispatch(AuthActions.loginFailure({ error: response.error }));
      } else {
        // Manejar next steps
        if (response.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
          this.pendingUsername = data.email;
          this.paramsChanger('confirmation');
          this.successMessage = `Debes confirmar tu cuenta. Se envió un código a ${data.email}`;
        } else if (response.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          this.challengeUser = response.challengeUser;
          this.paramsChanger('new-password');
        } else {
          this.errorMessage = 'Se requiere verificación adicional';
        }
      }
    } catch (error) {
      this.errorMessage = 'Error inesperado durante el inicio de sesión';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async handleSignUp(data: AuthData) {
    this.isLoading = true;
    this.clearMessages();

    try {
      const response = await this.authService.signUp(data);
      
      if (response.success) {
        this.pendingUsername = data.email;
        this.paramsChanger('confirmation');
        this.successMessage = response.message!;
      } else {
        this.errorMessage = response.error!;
      }
    } catch (error) {
      this.errorMessage = 'Error inesperado durante el registro';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async handleConfirmation(data: AuthData) {
    this.isLoading = true;
    this.clearMessages();

    try {
      const response = await this.authService.confirmSignUp(
        this.pendingUsername, 
        data.confirmationCode!
      );

      if (response.success) {
        this.successMessage = response.message!;
        setTimeout(() => this.paramsChanger('login'), 2000);
      } else {
        this.errorMessage = response.error!;
      }
    } catch (error) {
      this.errorMessage = 'Error inesperado durante la confirmación';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async handleNewPassword(data: AuthData) {
    this.isLoading = true;
    this.clearMessages();

    try {
      const response = await this.authService.confirmNewPassword(data.newPassword!);

      if (response.success && response.isSignedIn) {
        this.successMessage = response.message!;
        setTimeout(() => {
          this.router.navigate(['/patient']);
        }, 1500);
      } else {
        this.errorMessage = response.error!;
      }
    } catch (error) {
      this.errorMessage = 'Error inesperado al actualizar la contraseña';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async handleResendCode() {
    this.isLoading = true;
    this.clearMessages();

    try {
      const response = await this.authService.resendCode(this.pendingUsername);
      
      if (response.success) {
        this.successMessage = response.message!;
      } else {
        this.errorMessage = response.error!;
      }
    } catch (error) {
      this.errorMessage = 'Error inesperado al reenviar el código';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private handleDataLogin(){

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}