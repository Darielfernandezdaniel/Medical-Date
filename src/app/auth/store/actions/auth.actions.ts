import {createAction} from '@ngrx/store'

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
    '[Auth] Logout Failure',
    (error: any) => ({error})
);