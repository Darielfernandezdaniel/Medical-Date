import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from '../actions/auth.actions';
import { catchError, from, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStatus } from '../../../Services/auth-status';
import { inject } from '@angular/core';
import { BrowserStorageServices } from '../../../Services/browser-storage-services';

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authStatus = inject(AuthStatus);
    private router = inject(Router);
    private storageService = inject(BrowserStorageServices);

    logout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => console.log('🔍 Logout action received')),
            mergeMap(() =>
                from(this.authStatus.logOut()).pipe(
                    map(() => {
                        console.log('✅ Logout successful');
                        return AuthActions.logoutSuccess();
                    }),
                    catchError((error) => {
                        console.error('❌ Logout failed:', error);
                        return of(AuthActions.logoutFailure({ error }));
                    })
                )
            )
        );
    });

    logoutRedirect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.logoutSuccess),
            tap(() => {
                this.router.navigate(['/']);
            })
        );
    }, { dispatch: false });

    loginSuccess$ = createEffect(
        () =>
          this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            tap(({ email }) => {
              console.log('✅ Login success effect - email:', email);
              // ✅ Guardar el email para el checkAuth (fallback)
              this.storageService.setLocalItem('authEmail', email);
            })
          ),
        { dispatch: false }
      );
   
    // ✅ Mejorado: checkAuth usando BrowserStorageService
    checkAuth$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AuthActions.checkAuth),
          map(() => {
            console.log('🔍 Checking auth status...');
            
            const authData = this.storageService.getValidAuthData();
            
            if (authData && authData.isValid) {
              console.log('✅ Found valid auth data for:', authData.email);
              return AuthActions.setAuth({ 
                isAuthenticated: true, 
                email: authData.email 
              });
            }

            console.log('❌ No valid auth found');
            return AuthActions.setAuth({ isAuthenticated: false });
          })
        )
      );
}