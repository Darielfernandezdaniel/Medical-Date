import {createAction, props } from '@ngrx/store'


export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
    '[Auth] Logout Failure',
    (error: any) => ({error})
);

export const login = createAction (
    '[Auth] Login',
    props<{email:string}>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ email: string }>()
  );
  
  export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: any }>()
  );

  export const checkAuth = createAction('[Auth] Check Auth');

  export const setAuth = createAction(
    '[Auth] Set Auth',
    props<{ isAuthenticated: boolean; email?: string }>()
  );

  