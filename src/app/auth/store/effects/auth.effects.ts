import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from '../actions/auth.actions';
import { catchError, from, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStatus } from '../../../Services/auth-status';
import { inject } from '@angular/core';

@Injectable()
export class AuthEffects {
    // Usa inject() para inyectar dependencias
    private actions$ = inject(Actions);
    private authStatus = inject(AuthStatus);
    private router = inject(Router);

    logout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => console.log('🔍 Logout action received')),
            mergeMap(() =>
                from(this.authStatus.logOut()).pipe(
                    map(() => {
                        return AuthActions.logoutSuccess();
                    }),
                    catchError((error) => {
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
}