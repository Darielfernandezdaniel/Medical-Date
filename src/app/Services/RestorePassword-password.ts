import { Injectable } from '@angular/core';
import { resetPassword} from '@aws-amplify/auth';


@Injectable({
  providedIn: 'root'
})
export class RestorePassword {
  

  async checkEmailForSendCode(email: string): Promise<string> {
    try {
      const output = await resetPassword({ username: email });
  
      if (output.nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        return 'emailSent';
      } else {
        return 'unexpectedState';
      }
    } catch (error: any) {
      if (error.code === 'UserNotFoundException') {
        return 'invalidEmail';
      }
      return 'error';
    }
  }

  async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<void> {
    try {
      const { confirmResetPassword } = await import('aws-amplify/auth');
      
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword
      });

      console.log('Contraseña restablecida exitosamente');
      
    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    switch (error.name) {
      case 'UserNotFoundException':
        return new Error('Usuario no encontrado');
      case 'CodeMismatchException':
        return new Error('Código de confirmación incorrecto');
      case 'ExpiredCodeException':
        return new Error('El código ha expirado. Solicita uno nuevo');
      case 'InvalidPasswordException':
        return new Error('La contraseña no cumple con los requisitos');
      case 'LimitExceededException':
        return new Error('Demasiados intentos. Intenta más tarde');
      case 'NotAuthorizedException':
        return new Error('No autorizado. Verifica tus datos');
      default:
        return new Error(error.message || 'Ha ocurrido un error inesperado');
    }
  }
}

