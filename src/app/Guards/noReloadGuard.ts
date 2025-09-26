import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BrowserStorageServices } from '../Services/browser-storage-services';

@Injectable({
  providedIn: 'root'
})
export class NoReloadGuard implements CanActivate {
  
  constructor(private router: Router, private storage: BrowserStorageServices) {}
  
  canActivate(): boolean {
    // Verificar si es una recarga
    if (this.storage.getLocalItem('payment-visited')) {
      console.log('🔄 Recarga detectada, redirigiendo a /patient');
      this.storage.removeLocalItem('payment-visited')
      this.router.navigate(['/patient']);
      return false;
    }
    
    return true;
  }
}