import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageServices {
  constructor() {}

  // Verificar si estamos en el navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // Métodos para localStorage
  setLocalItem(key: string, value: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('Error setting localStorage item:', error);
      }
    }
  }

  getLocalItem(key: string): string | null {
    if (this.isBrowser()) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('Error getting localStorage item:', error);
        return null;
      }
    }
    return null;
  }

  removeLocalItem(key: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Error removing localStorage item:', error);
      }
    }
  }

  // Métodos para sessionStorage
  setSessionItem(key: string, value: string): void {
    if (this.isBrowser() && typeof window.sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem(key, value);
      } catch (error) {
        console.warn('Error setting sessionStorage item:', error);
      }
    }
  }

  getSessionItem(key: string): string | null {
    if (this.isBrowser() && typeof window.sessionStorage !== 'undefined') {
      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        console.warn('Error getting sessionStorage item:', error);
        return null;
      }
    }
    return null;
  }

  removeSessionItem(key: string): void {
    if (this.isBrowser() && typeof window.sessionStorage !== 'undefined') {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn('Error removing sessionStorage item:', error);
      }
    }
  }

  // Método para limpiar todos los datos de auth
  clearAuthData(): void {
    localStorage.removeItem('email');
    localStorage.removeItem('expiresAt');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('expiresAt');
  }

  // Verificar si hay datos de autenticación válidos
  getValidAuthData(): { email: string; isValid: boolean } | null {
    // 🔹 1) Revisar primero localStorage (RememberMe)
    const emailLocal = this.getLocalItem('email');
    const expiresLocal = this.getLocalItem('expiresAt');
  
    if (emailLocal && expiresLocal) {
      if (Date.now() < Number(expiresLocal)) {
        return { email: emailLocal, isValid: true };
      } else {
        this.removeLocalItem('email');
        this.removeLocalItem('expiresAt');
      }
    }
  
    const emailSession = this.getSessionItem('email');
    const expiresSession = this.getSessionItem('expiresAt');
  
    if (emailSession && expiresSession) {
      if (Date.now() < Number(expiresSession)) {
        return { email: emailSession, isValid: true };
      } else {
        this.removeSessionItem('email');
        this.removeSessionItem('expiresAt');
      }
    }
  
    return null;
  }
}
