// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BrowserStorageServices } from '../Services/browser-storage-services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private storage: BrowserStorageServices) {}

  canActivate(): Observable<boolean> {
    return of(this.checkAuth()).pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/register/login'], { replaceUrl: true });
        }
        return isAuthenticated;
      })
    );
  }

  private checkAuth(): boolean {
    const email = this.storage.getLocalItem('email') || this.storage.getSessionItem('email');
    return !!email;
  }
}