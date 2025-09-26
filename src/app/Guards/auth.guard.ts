import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthStatus } from '../Services/auth-status';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor(
    private router: Router, 
    private authStatus: AuthStatus
  ) {}

  canActivate(): Observable<boolean> {
    return this.authStatus.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/register/login'], { replaceUrl: true });
          return false;
        }
        return true;
      })
    );
  }
}