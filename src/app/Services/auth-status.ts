import { Injectable } from '@angular/core';
import { 
  signIn, 
  signUp, 
  confirmSignUp, 
  confirmSignIn, 
  resendSignUpCode, 
  signOut 
} from 'aws-amplify/auth';
import { AuthData, AuthResponse } from '../Interfaces/Insurances';
import { BrowserStorageServices } from './browser-storage-services';


@Injectable({
  providedIn: 'root'
})
export class AuthStatus {
  
  constructor(private storageService: BrowserStorageServices) {}

  async logOut(): Promise<void> {
    try {
      await signOut();
      // Limpiar datos de storage
      this.storageService.clearAuthData();
    } catch (error) {
      console.log('error during sign out:', error);
      throw error;
    }
  }

  async login(data: AuthData): Promise<AuthResponse> {
    try {
      const response = await signIn({ 
        username: data.email, 
        password: data.password 
      });

      if (response.isSignedIn) {
        // Guardar datos de sesión
        this.saveAuthData(data.email, data.rememberMe || false);
        
        return {
          success: true,
          isSignedIn: true,
          message: 'Inicio de sesión exitoso'
        };
      } else {
        return {
          success: false,
          isSignedIn: false,
          nextStep: response.nextStep,
          challengeUser: response
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  async signUp(data: AuthData): Promise<AuthResponse> {
    try {
      await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: { email: data.email }
        }
      });

      return {
        success: true,
        message: 'Si no recibe el codigo pruebe con el boton reenviar o revise si el correo es Correcto'
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  async confirmSignUp(username: string, confirmationCode: string): Promise<AuthResponse> {
    try {
      const response = await confirmSignUp({
        username: username,
        confirmationCode: confirmationCode
      });

      if (response.isSignUpComplete) {
        return {
          success: true,
          message: 'Cuenta confirmada exitosamente'
        };
      } else {
        return {
          success: false,
          error: 'Error al confirmar la cuenta'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  async confirmNewPassword(newPassword: string): Promise<AuthResponse> {
    try {
      const response = await confirmSignIn({
        challengeResponse: newPassword
      });

      if (response.isSignedIn) {
        return {
          success: true,
          isSignedIn: true,
          message: 'Contraseña actualizada correctamente'
        };
      } else {
        return {
          success: false,
          error: 'Error al actualizar la contraseña'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  async resendCode(username: string): Promise<AuthResponse> {
    try {
      await resendSignUpCode({ username: username });
      return {
        success: true,
        message: 'Código reenviado exitosamente'
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Método privado para guardar datos de autenticación
  private saveAuthData(email: string, rememberMe: boolean): void {
    const expiresAt = Date.now() + 1000 * 60 * 30; // 30 minutos
    
    const sessionData = {
      email: email,
      expiresAt
    };
  
    if (rememberMe) {
      this.storageService.setLocalItem("auth", JSON.stringify(sessionData));
    } else {
      this.storageService.setSessionItem("auth", JSON.stringify(sessionData));
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.name) {
      case 'UsernameExistsException':
        return 'Email existente. Por favor intente iniciar sesión';
      case 'InvalidPasswordException':
        return 'La contraseña no cumple con los requisitos';
      case 'UserNotConfirmedException':
        return 'Debes confirmar tu cuenta primero';
      case 'NotAuthorizedException':
        return 'Email o contraseña incorrectos';
      case 'UserNotFoundException':
        return 'Usuario no encontrado';
      case 'CodeMismatchException':
        return 'Código de confirmación incorrecto';
      case 'ExpiredCodeException':
        return 'El código ha expirado. Solicita uno nuevo';
      case 'LimitExceededException':
        return 'Demasiados intentos. Intenta más tarde';
      default:
        return error.message || 'Ha ocurrido un error inesperado';
    }
  }
}