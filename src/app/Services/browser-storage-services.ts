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
    this.removeLocalItem('auth');
    this.removeLocalItem('authEmail');
    this.removeSessionItem('auth');
  }

  // Verificar si hay datos de autenticación válidos
  getValidAuthData(): { email: string; isValid: boolean } | null {
    // Verificar localStorage primero (rememberMe)
    const authDataLocal = this.getLocalItem('auth');
    if (authDataLocal) {
      try {
        const parsed = JSON.parse(authDataLocal);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt && parsed.email) {
          return { email: parsed.email, isValid: true };
        } else {
          // Limpiar datos expirados
          this.removeLocalItem('auth');
        }
      } catch (e) {
        this.removeLocalItem('auth');
      }
    }

    // Verificar sessionStorage
    const authDataSession = this.getSessionItem('auth');
    if (authDataSession) {
      try {
        const parsed = JSON.parse(authDataSession);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt && parsed.email) {
          return { email: parsed.email, isValid: true };
        } else {
          // Limpiar datos expirados
          this.removeSessionItem('auth');
        }
      } catch (e) {
        this.removeSessionItem('auth');
      }
    }

    // Fallback: verificar el viejo sistema
    const email = this.getLocalItem('authEmail');
    if (email) {
      return { email, isValid: true };
    }

    return null;
  }
}
